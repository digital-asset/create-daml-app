import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import waitOn from 'wait-on';

import Ledger from '@daml/ledger';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';
import { computeCredentials } from './Credentials';

import puppeteer, { Browser, Page } from 'puppeteer';

const LEDGER_ID = 'create-daml-app-sandbox';
const SANDBOX_PORT = 6865;
const JSON_API_PORT = 7575;
const UI_PORT = 3000;

// `daml start` process (which spawns a sandbox and JSON API server)
let startProc: ChildProcess | undefined = undefined;

// Headless Chrome browser:
// https://developers.google.com/web/updates/2017/04/headless-chrome
let browser: Browser | undefined = undefined;

let uiProc: ChildProcess | undefined = undefined;

// Function to generate unique party names for us.
// This should be replaced by the party management service once that is exposed
// in the HTTP JSON API.
let nextPartyId = 1;
function getParty(): string {
  const party = `P${nextPartyId}`;
  nextPartyId++;
  return party;
}

test('Party names are unique', async () => {
  const parties = new Set(Array(10).fill({}).map(() => getParty()));
  expect(parties.size).toEqual(10);
});

// Use a single sandbox, JSON API server and browser for all tests for speed.
// This means we need to use a different set of parties and a new browser page for each test.
beforeAll(async () => {
  // Use `daml start` to start up the sandbox and json api server.
  // This is what we recommend to our users (over running the two processes separately),
  // so we replicate it in these tests.
  const startArgs = [
    'start',
    '--open-browser=no',
    '--start-navigator=no',
    '--sandbox-option=--wall-clock-time',
    `--sandbox-option=--ledgerid=${LEDGER_ID}`,
  ];
  // Run `daml start` from create-daml-app root dir.
  // The path should already include '.daml/bin' in the environment where this is run.
  const startOpts: SpawnOptions = { cwd: '..', stdio: 'inherit' };
  startProc = spawn('daml', startArgs, startOpts);

  // Run `yarn start` in another shell.
  // Disable automatically opening a browser using the env var described here:
  // https://github.com/facebook/create-react-app/issues/873#issuecomment-266318338
  const env = {...process.env, BROWSER: 'none'};
  uiProc = spawn('yarn', ['start'], { env, stdio: 'inherit' });

  // We know the `daml start` and `yarn start` servers are ready once the relevant ports become available.
  await waitOn({resources: [
    `tcp:localhost:${SANDBOX_PORT}`,
    `tcp:localhost:${JSON_API_PORT}`,
    `tcp:localhost:${UI_PORT}`
  ]});

  // Launch a browser once for all tests.
  browser = await puppeteer.launch();
}, 40_000);

afterAll(async () => {
  // Kill the `daml start` and `yarn start` processes.
  // Note that `kill()` sends the `SIGTERM` signal but the actual processes may
  // not die immediately.
  // TODO: Test/fix this for windows.
  if (startProc) {
    startProc.kill();
  }
  if (uiProc) {
    uiProc.kill();
  }

  if (browser) {
    browser.close();
  }
});

test('create and look up user using ledger library', async () => {
  const partyName = getParty();
  const {party, token} = computeCredentials(partyName);
  const ledger = new Ledger({token});
  const users0 = await ledger.query(User);
  expect(users0).toEqual([]);
  const user: User = {username: party, friends: []};
  const userContract1 = await ledger.create(User, user);
  const userContract2 = await ledger.lookupByKey(User, party);
  expect(userContract1).toEqual(userContract2);
  const users = await ledger.query(User);
  expect(users[0]).toEqual(userContract1);
});

// The tests following use the headless browser to interact with the app.
// We select the relevant DOM elements using CSS class names that we embedded
// specifically for testing.
// See https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors.

const newUiPage = async (): Promise<Page> => {
  if (!browser) {
    throw Error('Puppeteer browser has not been launched');
  }
  const page = await browser.newPage();
  await page.goto(`http://localhost:${UI_PORT}`); // ignore the Response
  return page;
}

// Log in using a party name and wait for the main screen to load.
const login = async (page: Page, partyName: string) => {
  const usernameInput = await page.waitForSelector('.test-select-username-field');
  await usernameInput.click();
  await usernameInput.type(partyName);
  await page.click('.test-select-login-button');
  await page.waitForSelector('.test-select-main-menu');
}

// Log out and wait to get back to the login screen.
const logout = async (page: Page) => {
  await page.click('.test-select-log-out');
  await page.waitForSelector('.test-select-login-screen');
}

// Add a friend using the text input and button in the Friends panel.
const addFriend = async (page: Page, friend: string) => {
  const friendInput = await page.waitForSelector('.test-select-add-friend-input');
  await friendInput.click();
  await friendInput.type(friend);
  await page.click('.test-select-add-friend-button');

  // Wait for the request to complete, either successfully or after the error
  // dialog has been handled.
  // We check this by the absence of the `loading` class.
  // (Both the `test-...` and `loading` classes appear in `div`s surrounding
  // the `input`, due to the translation of Semantic UI's `Input` element.)
  await page.waitForSelector('.test-select-add-friend-input > :not(.loading)');
}

test('log in as a new user, log out and log back in', async () => {
  const partyName = getParty();

  // Log in as a new user.
  const page = await newUiPage();
  await login(page, partyName);

  // Check that the ledger contains the new User contract.
  const {token} = computeCredentials(partyName);
  const ledger = new Ledger({token});
  const users = await ledger.query(User);
  expect(users).toHaveLength(1);
  expect(users[0].payload.username).toEqual(partyName);

  // Log out and in again as the same user.
  await logout(page);
  await login(page, partyName);

  // Check we have the same one user.
  const usersFinal = await ledger.query(User);
  expect(usersFinal).toHaveLength(1);
  expect(usersFinal[0].payload.username).toEqual(partyName);

  await page.close();
}, 10_000);

// This tests adding friends in a few different ways:
// - using the text box in the Friends panel
// - using the icon in the Network panel
// - while the friend is logged in
// - while the friend is logged out
// These are all successful cases.
test('log in as different users and add each other as friends', async () => {
  const party1 = getParty();
  const party2 = getParty();
  const party3 = getParty();

  // Log in as Party 1.
  const page1 = await newUiPage();
  await login(page1, party1);

  // Party 1 should initially have no friends.
  const noFriends1 = await page1.$$('.test-select-friend');
  expect(noFriends1).toEqual([]);

  // Add Party 2 as a friend using the text input.
  // This should work even though Party 2 has not logged in yet.
  // Check Party 1's friend list contains exactly Party 2.
  await addFriend(page1, party2);
  await page1.waitForSelector('.test-select-friend');
  const friendList1 = await page1.$$eval('.test-select-friend', friends => friends.map(e => e.innerHTML));
  expect(friendList1).toEqual([party2]);

  // Add Party 3 as well and check both friends are in the list.
  await addFriend(page1, party3);
  await page1.waitForSelector('.test-select-friend');
  const friendList11 = await page1.$$eval('.test-select-friend', friends => friends.map(e => e.innerHTML));
  expect(friendList11).toHaveLength(2);
  expect(friendList11).toContain(party2);
  expect(friendList11).toContain(party3);

  // Log in as Party 2.
  const page2 = await newUiPage();
  await login(page2, party2);

  // Party 2 should initially have no friends.
  const noFriends2 = await page2.$$('.test-select-friend');
  expect(noFriends2).toEqual([]);

  // However, Party 2 should see Party 1 in the network.
  await page2.waitForSelector('.test-select-user-in-network');
  const network2 = await page2.$$eval('.test-select-user-in-network', users => users.map(e => e.innerHTML));
  expect(network2).toEqual([party1]);

  // Add Party 1 as a friend using the 'add friend' icon on the right.
  await page2.waitForSelector('.test-select-add-user-icon');
  const userIcons = await page2.$$('.test-select-add-user-icon');
  expect(userIcons).toHaveLength(1);
  await userIcons[0].click();

  // Also add Party 3 as a friend using the text input.
  // Note that we can also use the icon to add Party 3 as they appear in the
  // friends of Party 1 in the Network panel, but that's harder to test at the
  // moment because there is no loading indicator to tell when it's done.
  await addFriend(page2, party3);

  // Check the friend list is updated correctly.
  await page2.waitForSelector('.test-select-friend');
  const friendList2 = await page2.$$eval('.test-select-friend', friends => friends.map(e => e.innerHTML));
  expect(friendList2).toHaveLength(2);
  expect(friendList2).toContain(party1);
  expect(friendList2).toContain(party3);

  // Party 1 should now also see Party 2 in the network (but not Party 3 as they
  // didn't yet add Party 1 as a friend).
  await page1.waitForSelector('.test-select-user-in-network');
  const network1 = await page1.$$eval('.test-select-user-in-network', users => users.map(e => e.innerHTML));
  expect(network1).toEqual([party2]);

  // Log in as Party 3.
  const page3 = await newUiPage();
  await login(page3, party3);

  // Party 3 should have no friends.
  const noFriends3 = await page3.$$('.test-select-friend');
  expect(noFriends3).toEqual([]);

  // However, Party 3 should see both Party 1 and Party 2 in the network.
  await page3.waitForSelector('.test-select-user-in-network');
  const network3 = await page3.$$eval('.test-select-user-in-network', users => users.map(e => e.innerHTML));
  expect(network3).toHaveLength(2);
  expect(network3).toContain(party1);
  expect(network3).toContain(party2);

  await page1.close();
  await page2.close();
  await page3.close();
}, 30_000);

test('error when adding self as a friend', async () => {
  const party = getParty();
  const page = await newUiPage();

  const dismissError = jest.fn(dialog => dialog.dismiss());
  page.on('dialog', dismissError);

  await login(page, party);
  await addFriend(page, party);

  expect(dismissError).toHaveBeenCalled();

  await page.close();
});

test('error when adding existing friend', async () => {
  const party1 = getParty();
  const party2 = getParty();
  const page = await newUiPage();

  const dismissError = jest.fn(dialog => dialog.dismiss());
  page.on('dialog', dismissError);

  await login(page, party1);
  // First attempt should succeed
  await addFriend(page, party2);
  // Second attempt should result in an error
  await addFriend(page, party2);

  expect(dismissError).toHaveBeenCalled();

  await page.close();
});
