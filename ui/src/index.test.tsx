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

  // We know that the processes are up and running once their ports become available.
  await waitOn({resources: [`tcp:localhost:${SANDBOX_PORT}`, `tcp:localhost:${JSON_API_PORT}`]});

  // Launch a browser once for all tests.
  browser = await puppeteer.launch();
}, 20_000);

afterAll(async () => {
  // Kill the `daml start` process.
  // This sends the kill signal but the actual process may take some time to die.
  // TODO: Test/fix this on windows
  if (startProc) {
    startProc.kill("SIGTERM");
    console.log('Killed daml start');
  }

  // Unfortunately Puppeteer has an issue where a large number of Chromium helper processes
  // are left running even after the browser is closed.
  // See https://github.com/puppeteer/puppeteer/issues/1825.
  if (browser) {
    browser.close();
  }
});

test('create and look up user using ledger library', async () => {
  const {party, token} = computeCredentials('Bob');
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
  // Start the UI process using `yarn start` in a shell.
  // Disable automatically opening a browser using the env var described here:
  // https://github.com/facebook/create-react-app/issues/873#issuecomment-266318338
  let env = process.env;
  env.BROWSER = 'none';
  uiProc = spawn('yarn', ['start'], { env, stdio: 'inherit' });
  await waitOn({resources: [`tcp:localhost:${UI_PORT}`]});

  if (!browser) {
    throw Error('Puppeteer browser has not been launched');
  }
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

  // TODO: Wait for the UI process to be killed before exiting
  // (instead of just sending the SIGTERM signal).
  uiProc.kill();
}, 30_000);
