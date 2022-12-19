import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-adsionli/indexHtml';
import react from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants/index';
import { resolveConfig } from './config';
export async function createDevServer(root: string, host: string) {
  const config = await resolveConfig(root, 'serve', 'development');
  return createServer({
    root,
    plugins: [pluginIndexHtml(), react()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      },
      host
    }
  });
}
