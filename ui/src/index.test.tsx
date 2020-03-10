import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import waitOn from 'wait-on';

import Ledger from '@daml/ledger';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';
import { computeCredentials } from './Credentials';

import puppeteer from 'puppeteer';

const LEDGER_ID = 'create-daml-app-sandbox';
const SANDBOX_PORT = 6865;
const JSON_API_PORT = 7575;
const UI_PORT = 3000;

// `daml start` process (which spawns a sandbox and JSON API server)
let startProc: ChildProcess | undefined = undefined;

// Headless Chrome browser:
// https://developers.google.com/web/updates/2017/04/headless-chrome
let browser: puppeteer.Browser | undefined = undefined;

let uiProc: ChildProcess | undefined = undefined;

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
  let env = process.env;
  env.BROWSER = 'none';
  uiProc = spawn('yarn', ['start'], { env, stdio: 'inherit' });

  // We know the `daml start` and `yarn start` servers are ready once the relevant ports become available.
  await waitOn({resources: [
    `tcp:localhost:${SANDBOX_PORT}`,
    `tcp:localhost:${JSON_API_PORT}`,
    `tcp:localhost:${UI_PORT}`
  ]});

  // Launch a browser once for all tests.
  browser = await puppeteer.launch();
}, 30_000);

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

// Note(cocreature): Once the party management service is exposed via the HTTP JSON API,
// I would recommend to use the party management service to allocate parties. If you don’t
// supply a party id hint you will always get a fresh party.
test('create and look up user using ledger library', async () => {
  const partyName = 'Bob';
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

test('log in as a new user', async () => {
  const partyName = 'Alice'; // See Note(cocreature)
  if (!browser) {
    throw Error('Puppeteer browser has not been launched');
  }
  const page = await browser.newPage();
  await page.goto(`http://localhost:${UI_PORT}`);

  // Select the login elements using the CSS class names we gave specifically for testing.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
  await page.click('.test-select-username-field');
  await page.type('.test-select-username-field', partyName);
  await page.click('.test-select-login-button');

  // Wait until we reach the main menu (meaning the login was successful) before
  // checking the ledger state.
  await page.waitForSelector('.test-select-main-menu');
  await page.close();

  // Check that the ledger contains the new User contract.
  const {party, token} = computeCredentials(partyName);
  const ledger = new Ledger({token});
  const users = await ledger.query(User);
  expect(users.length).toEqual(1);
  const userContract = await ledger.lookupByKey(User, party);
  expect(userContract?.payload.username).toEqual(partyName);
}, 10_000);
