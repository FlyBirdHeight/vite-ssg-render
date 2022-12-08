import path from 'path';
import fs from 'fs-extra';
import * as execa from 'execa';

const exampleDir = path.resolve(__dirname, '../e2e/playground/basic');
const ROOT = path.resolve(__dirname, '../');

const defaultOption = {
  stdout: process.stdout,
  stdin: process.stdin,
  stderr: process.stderr
};

async function prepareE2E() {
  if (fs.existsSync(path.resolve(__dirname, '../dist'))) {
    execa.commandSync('pnpm build', {
      cwd: ROOT
    });
  }
}

execa.commandSync('npx playwright install', {
  cwd: ROOT,
  ...defaultOption
});

execa.commandSync('pnpm dev', {
  cwd: exampleDir,
  ...defaultOption
});

prepareE2E();
