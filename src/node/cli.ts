import { cac } from 'cac';
import { createDevServer } from './dev';
import { build } from './build';
import { resolve } from 'path';

const version = '0.0.1';
type Options = {
  '--': any[];
  host: string;
};
const cli = cac('adsionli').version(version).help();
cli
  .command('[root]', 'start dev server')
  .option('--host <host>', 'set you newwork host')
  .alias('dev')
  .action(async (root: string, options: Options) => {
    const server = await createDevServer(root, options.host);
    await server.listen();
    server.printUrls();
  });

cli
  .command('build [root]', 'build for production')
  .action(async (root: string) => {
    try {
      root = resolve(root);
      await build(root);
    } catch (e) {
      console.log(e);
    }
  });

cli.parse();
