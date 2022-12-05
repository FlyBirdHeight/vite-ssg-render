"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const App_1 = require("./App");
const server_1 = require("react-dom/server");
const react_1 = require("react");
function render() {
    return (0, server_1.renderToString)((0, jsx_runtime_1.jsx)(App_1.App, {}));
}
exports.render = render;
