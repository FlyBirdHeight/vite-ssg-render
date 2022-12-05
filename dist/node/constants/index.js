"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_ENTRY_PATH = exports.CLIENT_ENTRY_PATH = exports.DEFAULT_INDEX_PATH = exports.PACKAGE_ROOT = void 0;
const path = require("path");
exports.PACKAGE_ROOT = path.join(__dirname, "..", "..", "..");
exports.DEFAULT_INDEX_PATH = path.join(exports.PACKAGE_ROOT, "index.html");
exports.CLIENT_ENTRY_PATH = path.join(exports.PACKAGE_ROOT, "src", "runtime", "client-entry.tsx");
exports.SERVER_ENTRY_PATH = path.join(exports.PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");
