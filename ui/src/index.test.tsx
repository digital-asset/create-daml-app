import React from 'react';
import ReactDOM from 'react-dom';

import { ChildProcess, spawn, exec, ExecOptions } from 'child_process';

const LEDGER_ID = 'create-daml-app-sandbox';
const SANDBOX_PORT = 6865;
const JSON_API_PORT = 7575;

let sandboxProcess: ChildProcess | undefined = undefined;
let jsonApiProcess: ChildProcess | undefined = undefined;
let startProc: ChildProcess | undefined = undefined;

const getEnv = (variable: string): string => {
  const result = process.env[variable];
  if (!result) {
    throw Error(`${variable} not set in environment`);
  }
  return result;
}

beforeAll(async () => {
  // const rootDir = getEnv('PWD') + '/..';
  // const darPath = rootDir + '/.daml/dist/create-daml-app-0.1.0.dar';
  // const startArgs = [ "start", "--open-browser=no", "--start-navigator=no", "--sandbox-option=--wall-clock-time", "--sandbox-option='--ledgerid=create-daml-app-sandbox'" ];
  // const env = Object.assign(process.env, {PATH: process.env.HOME + '/.daml/bin:' + process.env.PATH});
  // console.log(env.PATH);
  // const startOpts: SpawnOptions = { cwd: '..', env, stdio: 'pipe' }; // run in root dir
  // startProc = spawn('dam', ['fail'], startOpts)
  // startProc.on('error', (err) => console.error('daml start failed with error:' + JSON.stringify(err)));
  // startProc.stderr.on('data', (data) => {
  //   console.error(`stdout: ${data}`);
  // });
  // const ls = spawn('ls', [], );
  // ls.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`);
  // });
  // console.log('Sandbox up');
  // console.log('JSON API up');
});

afterAll(() => {
  // if (ls) {
  //   ls.kill();
  // }
  // if (startProc) {
  //   startProc.kill("SIGTERM");
  //   console.log('Killed daml start');
  // }
});

const fail = () => expect(false).toBeTruthy();

it('run daml start and shut it down', () => {
  const startArgs = [ "start", "--open-browser=no", "--start-navigator=no", "--sandbox-option=--wall-clock-time", "--sandbox-option='--ledgerid=create-daml-app-sandbox'" ];
  const startCmd = ["daml"].concat(startArgs).join(' ');
  const env = Object.assign(process.env, {PATH: process.env.HOME + '/.daml/bin:' + process.env.PATH});
  const startOpts = { cwd: '..', env }; // run in root dir with extended path
  startProc = exec(startCmd, startOpts, (error, stdout, stderr) => {
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
      fail();
    }
  });
  if (startProc) {
    startProc.kill("SIGTERM");
    console.log('Killed daml start');
  }
});

it('starts sandbox and json api server', () => {
  // Set up enviroment to run daml assistant commands
  const env = Object.assign(process.env, {PATH: process.env.HOME + '/.daml/bin:' + process.env.PATH});
  const cmdOpts = { cwd: '..', env }; // run in root dir with extended path

  // Start sandbox
  const sandboxArgs = [ 'sandbox', '--wall-clock-time', '--ledgerid=create-daml-app-sandbox' ];
  const sandboxCmd = ['daml'].concat(sandboxArgs).join(' ');
  let sandboxProc = exec(sandboxCmd, cmdOpts, (error, stdout, stderr) => {
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
      fail();
    }
  });
  exec('sleep 10');

  // Start JSON API server
  const jsonApiCmd = 'daml json-api --ledger-host localhost --ledger-port 6865 --http-port 7575 --application-id create-daml-app-sandbox'
  let jsonApiProc = exec(jsonApiCmd, cmdOpts, (error, stdout, stderr) => {
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
      fail();
    }
  });

  // Shut down processes
  if (sandboxProc) {
    sandboxProc.kill("SIGTERM");
  }
});
