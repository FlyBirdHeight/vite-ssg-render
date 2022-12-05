import * as path from "path";
export const PACKAGE_ROOT = path.join(__dirname, "..", "..", "..");
export const DEFAULT_INDEX_PATH = path.join(PACKAGE_ROOT, "index.html");

export const CLIENT_ENTRY_PATH = path.join(
    PACKAGE_ROOT,
    "src",
    "runtime",
    "client-entry.tsx"
);

export const SERVER_ENTRY_PATH = path.join(PACKAGE_ROOT, "src", "runtime", "ssr-entry.tsx");