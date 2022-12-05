"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevServer = void 0;
const vite_1 = require("vite");
const indexHtml_1 = require("./plugin-adsionli/indexHtml");
const plugin_react_1 = require("@vitejs/plugin-react");
function createDevServer(root) {
    return (0, vite_1.createServer)({
        root,
        plugins: [(0, indexHtml_1.pluginIndexHtml)(), (0, plugin_react_1.default)()]
    });
}
exports.createDevServer = createDevServer;
