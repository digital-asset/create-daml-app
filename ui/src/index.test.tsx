import { ChildProcess, exec } from 'child_process';
import waitOn from 'wait-on';

import Ledger from '@daml/ledger';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';
import { wsBaseUrl } from './config';
import Credentials, { computeCredentials } from './Credentials';

// import React from 'react';
// import ReactDOM from 'react-dom';
// import puppeteer from "puppeteer";

const LEDGER_ID = 'create-daml-app-sandbox';
const APPLICATION_ID = 'create-daml-app';
const SANDBOX_PORT = 6865;
const JSON_API_PORT = 7575;

let sandboxProc: ChildProcess | undefined = undefined;
let jsonApiProc: ChildProcess | undefined = undefined;
let startProc:   ChildProcess | undefined = undefined;

beforeAll(async () => {
});

afterAll(() => {
  // Shut down all possibly running daml processes
  if (startProc) {
    startProc.kill("SIGTERM");
    console.log('Killed daml start');
  }
  if (sandboxProc) {
    sandboxProc.kill("SIGTERM");
    console.log('Killed sandbox');
  }
  if (jsonApiProc) {
    jsonApiProc.kill("SIGTERM");
    console.log('Killed JSON API server');
  }
});

const fail = () => expect(false).toBeTruthy();

// it('run daml start and shut it down', async () => {
//   const startArgs = [ "start", "--open-browser=no", "--start-navigator=no", "--sandbox-option=--wall-clock-time", "--sandbox-option='--ledgerid=create-daml-app-sandbox'" ];
//   const startCmd = ["daml"].concat(startArgs).join(' ');
//   const env = Object.assign(process.env, {PATH: process.env.HOME + '/.daml/bin:' + process.env.PATH});
//   const startOpts = { cwd: '..', env }; // run in root dir with extended path
//   startProc = exec(startCmd, startOpts, (error, stdout, stderr) => {
//     if (error && !error.killed) {
//       console.error(error);
//       fail();
//     }
//     if (stderr) {
//       console.error(stderr);
//       fail();
//     }
//     if (stdout) {
//       console.error(stdout);
//       fail();
//     }
//   });
//   await waitOn({resources: [`tcp:localhost:${SANDBOX_PORT}`]});
//   await waitOn({resources: [`tcp:localhost:${JSON_API_PORT}`]});

  // Connect browser
  // let browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.goto(`http://localhost:3000`);
// });

// Default timeout is too short to allow both sandbox and json api server to start running
jest.setTimeout(10_000);
it('starts sandbox and json api server', async () => {
  // Set up enviroment to run daml assistant commands
  const env = Object.assign(process.env, {PATH: process.env.HOME + '/.daml/bin:' + process.env.PATH});
  const cmdOpts = { cwd: '..', env }; // run in root dir with extended path

  // Start sandbox
  const sandboxArgs = [ 'sandbox', '--wall-clock-time', `--port=${SANDBOX_PORT}`, `--ledgerid=${LEDGER_ID}` ];
  const sandboxCmd = ['daml'].concat(sandboxArgs).join(' ');
  sandboxProc = exec(sandboxCmd, cmdOpts, (error, stdout, stderr) => {
    if (error && !error.killed) {
      console.error(error);
      fail();
    }
    if (stderr) {
      console.error(stderr);
      fail();
    }
    if (stdout) {
      console.error(stdout);
    }
  });
  await waitOn({resources: [`tcp:localhost:${SANDBOX_PORT}`]});

  // Start JSON API server
  const jsonApiCmd = `daml json-api --ledger-host localhost --ledger-port ${SANDBOX_PORT} --http-port ${JSON_API_PORT} --application-id ${APPLICATION_ID}`
  jsonApiProc = exec(jsonApiCmd, cmdOpts, (error, stdout, stderr) => {
    if (error && !error.killed) {
      console.error(error);
      fail();
    }
    if (stderr) {
      console.error(stderr);
      fail();
    }
    if (stdout) {
      console.error(stdout);
    }
  });
  await waitOn({resources: [`tcp:localhost:${JSON_API_PORT}`]});

  console.log("Ports open!")
  await queryUser();
});

const queryUser = async () => {
  const credentials = computeCredentials('Alice');
  const ledger = new Ledger({token: credentials.token, httpBaseUrl: undefined, wsBaseUrl});
  const events = await ledger.query(User);
  expect(events).toEqual([]);
}

const createAndLookUpUser = async () => {
  const credentials = computeCredentials('Alice');
  const ledger = new Ledger({token: credentials.token, httpBaseUrl: undefined, wsBaseUrl});
  await ledger.query(User);
  const user: User = {username: credentials.party, friends: []};
  const userContract1 = await ledger.create(User, user);
  const userContract2 = await ledger.lookupByKey(User, credentials.party);
  expect(userContract1).toEqual(userContract2);
}
