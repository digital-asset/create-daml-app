import { ChildProcess, exec } from 'child_process';
import waitOn from 'wait-on';

import Ledger from '@daml/ledger';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';
import { wsBaseUrl } from './config';
import { computeCredentials } from './Credentials';

const DAR_PATH = '.daml/dist/create-daml-app-0.1.0.dar';
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

// Extend timeout to allow sandbox and json api server to start running
jest.setTimeout(20_000);

it('starts sandbox and json api server', async () => {
  // Start processes in create-daml-app root dir
  // The path should already include '.daml/bin' in the environment where this is run
  const cmdOpts = { cwd: '..' };

  // Start sandbox
  const sandboxCmd = `daml sandbox --wall-clock-time --port=${SANDBOX_PORT} --ledgerid=${LEDGER_ID} ${DAR_PATH}`;
  sandboxProc = exec(sandboxCmd, cmdOpts, (error, stdout, stderr) => {
    if (error && !error.killed) {
      console.error(error);
      fail();
    }
    if (stderr) {
      console.error(stderr);
      fail();
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
  });
  await waitOn({resources: [`tcp:localhost:${JSON_API_PORT}`]});

  await createAndLookUpUser();
});

const createAndLookUpUser = async () => {
  const credentials = computeCredentials('Alice');
  const ledger = new Ledger({token: credentials.token, httpBaseUrl: undefined, wsBaseUrl});
  await ledger.query(User);
  const user: User = {username: credentials.party, friends: []};
  const userContract1 = await ledger.create(User, user);
  const userContract2 = await ledger.lookupByKey(User, credentials.party);
  expect(userContract1).toEqual(userContract2);
  const events = await ledger.query(User);
  expect(events[0].contractId).toEqual(userContract1.contractId);
}
