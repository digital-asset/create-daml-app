import { ChildProcess, spawn, SpawnOptions } from 'child_process';
import waitOn from 'wait-on';

import Ledger from '@daml/ledger';
import { User } from '@daml2ts/create-daml-app/lib/create-daml-app-0.1.0/User';
import { computeCredentials } from './Credentials';

const LEDGER_ID = 'create-daml-app-sandbox';
const SANDBOX_PORT = 6865;
const JSON_API_PORT = 7575;

let startProc: ChildProcess | undefined = undefined;

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
