import { createServer } from "vite";
import { pluginIndexHtml } from './plugin-adsionli/indexHtml';
import react from '@vitejs/plugin-react'
export function createDevServer(root: string) {
    return createServer({
        root,
        plugins: [pluginIndexHtml(), react()]
    })
}