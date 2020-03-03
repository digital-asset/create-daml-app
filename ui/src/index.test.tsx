import React from 'react';
import ReactDOM from 'react-dom';

import { ChildProcess, spawn } from 'child_process';
import { lstat } from 'fs';
// import waitOn from 'wait-on';

const LEDGER_ID = 'daml2ts-tests';

const SANDBOX_PORT = 6865;
const JSON_API_PORT = 7575;

let sandboxProcess: ChildProcess | undefined = undefined;
let jsonApiProcess: ChildProcess | undefined = undefined;
let startProc: ChildProcess | undefined = undefined;
let ls: ChildProcess | undefined = undefined;

const getEnv = (variable: string): string => {
  const result = process.env[variable];
  if (!result) {
    throw Error(`${variable} not set in environment`);
  }
  return result;
}

// const spawnJvmAndWaitOnPort = async (jar: string, args: string[], port: number): Promise<ChildProcess> => {
//   const java = getEnv('JAVA');
//   const proc = spawn(java, ['-jar', jar, ...args], {stdio: "inherit",});
//   await waitOn({resources: [`tcp:localhost:${port}`]})
//   return proc;
// }

beforeAll(async () => {
  // const rootDir = getEnv('PWD') + '/..';
  // const darPath = rootDir + '/.daml/dist/create-daml-app-0.1.0.dar';
  const startArgs = [ "start", "--open-browser=no", "--start-navigator=no", "--sandbox-option=--wall-clock-time", "--sandbox-option='--ledgerid=create-daml-app-sandbox'" ];
  const env = Object.assign(process.env, {PATH: process.env.HOME + '/.daml/bin:' + process.env.PATH});
  console.log(env.PATH);
  const startOpts = { cwd: '..', env }; // run in root dir
  startProc = spawn('daml', ['fail'], startOpts)
  startProc.on('error', (err) => console.error('daml start failed with error:' + JSON.stringify(err)));
  startProc.stderr.on('data', (data) => {
    console.error(`stdout: ${data}`);
  });
  // const ls = spawn('ls', [], );
  // ls.stdout.on('data', (data) => {
  //   console.log(`stdout: ${data}`);
  // });
  console.log('Sandbox up');
  console.log('JSON API up');
});

afterAll(() => {
  // if (ls) {
  //   ls.kill();
  // }
  if (startProc) {
    startProc.kill("SIGTERM");
  }
  console.log('Killed daml start');
});

test('create + fetch & exercise', async () => {
});
