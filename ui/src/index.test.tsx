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

let startProc: ChildProcess | undefined = undefined;
let uiProc:    ChildProcess | undefined = undefined;

// Start a fresh sandbox and json api server for each test to have a clean slate
beforeEach(async () => {
  // Run daml process in create-daml-app root dir.
  // The path should already include '.daml/bin' in the environment where this is run.
  const opts: SpawnOptions = { cwd: '..', stdio: 'inherit' };

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
  startProc = spawn('daml', startArgs, opts);

  // We know that the processes are up and running once their ports become available.
  await waitOn({resources: [`tcp:localhost:${SANDBOX_PORT}`, `tcp:localhost:${JSON_API_PORT}`]});
}, 20_000);

afterEach(() => {
  // Shut down `daml start` process
  // TODO: Test/fix this on windows
  if (startProc) {
    startProc.kill("SIGTERM");
    console.log('Killed daml start');
  }
});

test('create and look up user using ledger library', async () => {
  const {party, token} = computeCredentials('Alice');
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

test('open webpage using headless browser', async () => {
  // Start the UI process using `yarn start` in a shell.
  // Disable automatically opening a browser using the env var described here:
  // https://github.com/facebook/create-react-app/issues/873#issuecomment-266318338
  let env = process.env;
  env.BROWSER = 'none';
  uiProc = spawn('yarn', ['start'], { env, stdio: 'inherit' });
  await waitOn({resources: [`tcp:localhost:${UI_PORT}`]});

  // Launch a headless Chrome browser:
  // https://developers.google.com/web/updates/2017/04/headless-chrome
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${UI_PORT}`);

  // Log in as Alice by selecting the login elements using CSS selectors.
  // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors
  const usernameField = await page.waitForSelector('input');
  if (!usernameField) {
    throw Error('Did not find username field to login');
  }
  await page.click('input');
  await page.type('input', 'Alice');
  const button = await page.$('button');
  if (!button) {
    throw Error('Did not find button to login');
  }
  await page.click('button');
  await page.waitForSelector('.menu');

  // Check that the ledger contains Alice's User contract.
  const {party, token} = computeCredentials('Alice');
  const ledger = new Ledger({token});
  const users = await ledger.query(User);
  expect(users.length).toEqual(1);
  const userContract = await ledger.lookupByKey(User, party);
  expect(userContract?.payload.username).toEqual('Alice');

  // Clean up.
  // TODO: Wait for the UI process to be killed before exiting
  // (instead of just sending the SIGTERM signal).
  browser.close();
  uiProc.kill();
}, 30_000);
