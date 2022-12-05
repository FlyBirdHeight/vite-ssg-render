"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.renderPage = exports.bundle = void 0;
const path_1 = require("path");
const plugin_react_1 = require("@vitejs/plugin-react");
const vite_1 = require("vite");
const index_1 = require("./constants/index");
const fs = require("fs-extra");
async function bundle(root) {
    const resolveViteConfig = (isServer) => ({
        mode: "production",
        root,
        plugins: [(0, plugin_react_1.default)()],
        build: {
            ssr: isServer,
            outDir: isServer ? '.temp' : 'build',
            rollupOptions: {
                input: isServer ? index_1.SERVER_ENTRY_PATH : index_1.CLIENT_ENTRY_PATH,
                output: {
                    format: isServer ? "cjs" : "esm"
                }
            }
        }
    });
    try {
        const [clientBundle, serverBundle] = await Promise.all([
            (0, vite_1.build)(resolveViteConfig(false)),
            (0, vite_1.build)(resolveViteConfig(true))
        ]);
        return [clientBundle, serverBundle];
    }
    catch (e) {
        console.log(e);
    }
}
exports.bundle = bundle;
async function renderPage(render, root, clientBundle) {
    const appHtml = render();
    const clientChunk = clientBundle.output.find((chunk) => chunk.type === "chunk" && chunk.isEntry);
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
    await fs.writeFile((0, path_1.join)(root, 'build', 'index.html'), html);
    await fs.remove((0, path_1.join)(root, '.temp'));
}
exports.renderPage = renderPage;
/**
 * 1. 打包代码，包括 client 端 + server 端
 * 2. 引入 server-entry 模块
 * 3. 服务端渲染，产出
 */
async function build(root = process.cwd()) {
    //1. 打包代码，包括 client 端 + server 端
    const [clientBundle] = await bundle(root);
    //2. 引入 server-entry 模块
    const serverEntryPath = (0, path_1.join)(root, ".temp", "ssr-entry.js");
    //3. 服务端渲染，产出
    const { render } = require(serverEntryPath);
    await renderPage(render, root, clientBundle);
}
exports.build = build;
