"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("react-dom/client");
const react_1 = require("react");
const App_1 = require("./App");
function renderInBrowser() {
    const containerEl = document.getElementById('app');
    if (!containerEl) {
        throw new Error('#app element is not exist!');
    }
    const root = (0, client_1.createRoot)(containerEl);
    root.render((0, jsx_runtime_1.jsx)(App_1.App, {}));
}
renderInBrowser();
