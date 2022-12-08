import { createServer } from 'vite';
import { pluginIndexHtml } from './plugin-adsionli/indexHtml';
import react from '@vitejs/plugin-react';
import { PACKAGE_ROOT } from './constants/index';
export function createDevServer(root: string) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), react()],
    server: {
      fs: {
        allow: [PACKAGE_ROOT]
      }
    }
  });
}
