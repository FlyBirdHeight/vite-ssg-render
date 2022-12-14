import { join } from 'path';
import react from '@vitejs/plugin-react';
import type { RollupOutput } from 'rollup';
import { build as viteBuild, InlineConfig } from 'vite';
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants/index';
import fs from 'fs-extra';
// const dynamicImport = new Function('m', 'return import(m)');
// import ora from 'ora';
// console.log('213');
export async function bundle(root: string) {
  // const { default: ora } = await dynamicImport('ora');
  // const spinner = ora();
  // spinner.start("Building client + server bundles...");
  const resolveViteConfig = (isServer: boolean): InlineConfig => ({
    mode: 'production',
    root,
    plugins: [react()],
    build: {
      ssr: isServer,
      outDir: isServer ? '.temp' : 'build',
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? 'cjs' : 'esm'
        }
      }
    }
  });
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ]);

    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch (e) {
    console.log(e);
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>adsionli</title>
        </head>
        <body>
            <div id="app">
                ${appHtml}
            </div>
            <script src="/${clientChunk.fileName}" type="module"></script>
        </body>
        </html>
    `.trim();
  await fs.writeFile(join(root, 'build', 'index.html'), html);
  await fs.remove(join(root, '.temp'));
}

/**
 * 1. ????????????????????? client ??? + server ???
 * 2. ?????? server-entry ??????
 * 3. ????????????????????????
 */
export async function build(root: string = process.cwd()) {
  //1. ????????????????????? client ??? + server ???
  const [clientBundle] = await bundle(root);
  //2. ?????? server-entry ??????
  const serverEntryPath = join(root, '.temp', 'ssr-entry.js');
  //3. ????????????????????????
  const { render } = await import(serverEntryPath);
  await renderPage(render, root, clientBundle);
}
