import { join } from "path"
import react from "@vitejs/plugin-react";
import type { RollupOutput } from "rollup";
import { build as viteBuild, InlineConfig } from "vite";
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants/index';
import * as fs from "fs-extra"


export async function bundle(root: string) {
    const resolveViteConfig = (isServer: boolean): InlineConfig => ({
        mode: "production",
        root,
        plugins: [react()],
        build: {
            ssr: isServer,
            outDir: isServer ? '.temp' : 'build',
            rollupOptions: {
                input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
                output: {
                    format: isServer ? "cjs" : "esm"
                }
            }
        }
    })
    try {
        const [clientBundle, serverBundle] = await Promise.all([
            viteBuild(resolveViteConfig(false)),
            viteBuild(resolveViteConfig(true))
        ])

        return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
    } catch (e) {
        console.log(e);
    }
}

export async function renderPage(render: () => string, root: string, clientBundle: RollupOutput) {
    const appHtml = render();
    const clientChunk = clientBundle.output.find(
        (chunk) => chunk.type === "chunk" && chunk.isEntry
    )
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
    await fs.remove(join(root, '.temp'))
}

/**
 * 1. 打包代码，包括 client 端 + server 端
 * 2. 引入 server-entry 模块
 * 3. 服务端渲染，产出
 */
export async function build(root: string = process.cwd()) {
    //1. 打包代码，包括 client 端 + server 端
    const [clientBundle] = await bundle(root);
    //2. 引入 server-entry 模块
    const serverEntryPath = join(root, ".temp", "ssr-entry.js");
    //3. 服务端渲染，产出
    const { render } = require(serverEntryPath);
    await renderPage(render, root, clientBundle);
}

