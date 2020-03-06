import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import waitOn from 'wait-on';

import Ledger from '@daml/ledger';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';
import { computeCredentials } from './Credentials';

const DAR_PATH = '.daml/dist/create-daml-app-0.1.0.dar';
const LEDGER_ID = 'create-daml-app-sandbox';
const APPLICATION_ID = 'create-daml-app';
const SANDBOX_PORT = 6865;
const JSON_API_PORT = 7575;

let sandboxProc: ChildProcess | undefined = undefined;
let jsonApiProc: ChildProcess | undefined = undefined;

// Start a fresh sandbox and json api server for each test to have a clean slate
beforeEach(async () => {
  // Start processes in create-daml-app root dir
  // The path should already include '.daml/bin' in the environment where this is run
  const opts: SpawnOptions = { cwd: '..', stdio: 'inherit' };

  // Start sandbox
  const sandboxArgs = ['sandbox', '--wall-clock-time', `--port=${SANDBOX_PORT}`, `--ledgerid=${LEDGER_ID}`, DAR_PATH];
  sandboxProc = spawn('daml', sandboxArgs, opts);
  await waitOn({resources: [`tcp:localhost:${SANDBOX_PORT}`]});

  // Start JSON API server
  const jsonApiArgs = ['json-api', '--ledger-host=localhost', `--ledger-port=${SANDBOX_PORT}`, `--http-port=${JSON_API_PORT}`, `--application-id=${APPLICATION_ID}`];
  jsonApiProc = spawn('daml', jsonApiArgs, opts);
  await waitOn({resources: [`tcp:localhost:${JSON_API_PORT}`]});
}, 15_000);

afterEach(() => {
  // Shut down running daml processes
  // TODO: Test/fix this for windows
  if (sandboxProc) {
    sandboxProc.kill("SIGTERM");
    console.log('Killed sandbox');
  }
  if (jsonApiProc) {
    jsonApiProc.kill("SIGTERM");
    console.log('Killed JSON API server');
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
  expect(users[0].contractId).toEqual(userContract1.contractId);
});
