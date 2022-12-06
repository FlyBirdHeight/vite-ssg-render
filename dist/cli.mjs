var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "island-ssg",
      version: "1.0.0",
      description: "",
      main: "index.js",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
        start: "tsup --watch",
        build: "tsup",
        lint: "eslint --fix --ext .ts,.tsx,.js,.jsx ./"
      },
      bin: {
        adsionli: "bin/island.js"
      },
      keywords: [],
      author: "",
      license: "ISC",
      devDependencies: {
        "@types/fs-extra": "^9.0.13",
        "@types/node": "^18.11.10",
        "@typescript-eslint/eslint-plugin": "^5.45.1",
        "@typescript-eslint/parser": "^5.45.1",
        eslint: "^8.29.0",
        "eslint-config-prettier": "^8.5.0",
        "eslint-plugin-prettier": "^4.2.1",
        "eslint-plugin-react": "^7.31.11",
        "eslint-plugin-react-hooks": "^4.6.0",
        ora: "^6.1.2",
        prettier: "^2.8.0",
        rollup: "^3.5.1",
        serve: "^14.1.2",
        tsup: "^6.5.0",
        typescript: "^4.9.3"
      },
      dependencies: {
        "@vitejs/plugin-react": "^2.2.0",
        "@vitejs/plugin-react-refresh": "^1.3.6",
        cac: "^6.7.14",
        "fs-extra": "^11.1.0",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        vite: "3.2.4"
      }
    };
  }
});

// node_modules/.pnpm/registry.npmmirror.com+tsup@6.5.0_typescript@4.9.3/node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/node/cli.ts
import { cac } from "cac";

// src/node/dev.ts
import { createServer } from "vite";

// src/node/plugin-adsionli/indexHtml.ts
import { readFile } from "fs/promises";

// src/node/constants/index.ts
import * as path2 from "path";
var PACKAGE_ROOT = path2.join(__dirname, "..");
var DEFAULT_INDEX_PATH = path2.join(PACKAGE_ROOT, "index.html");
var CLIENT_ENTRY_PATH = path2.join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = path2.join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "ssr-entry.tsx"
);

// src/node/plugin-adsionli/indexHtml.ts
function pluginIndexHtml() {
  return {
    name: "adsionli: index-html",
    apply: "serve",
    transformIndexHtml(html) {
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              type: "module",
              src: `/@fs/${CLIENT_ENTRY_PATH}`
            },
            injectTo: "body"
          }
        ]
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          let content = await readFile(DEFAULT_INDEX_PATH, "utf-8");
          try {
            content = await server.transformIndexHtml(
              req.url,
              content,
              req.originalUrl
            );
            res.setHeader("Content-Type", "text/html");
            res.end(content);
          } catch (e) {
            return next(e);
          }
        });
      };
    }
  };
}

// src/node/dev.ts
import react from "@vitejs/plugin-react";
function createDevServer(root) {
  return createServer({
    root,
    plugins: [pluginIndexHtml(), react()]
  });
}

// src/node/build.ts
import { join as join2 } from "path";
import react2 from "@vitejs/plugin-react";
import { build as viteBuild } from "vite";
import fs from "fs-extra";
async function bundle(root) {
  const resolveViteConfig = (isServer) => ({
    mode: "production",
    root,
    plugins: [react2()],
    build: {
      ssr: isServer,
      outDir: isServer ? ".temp" : "build",
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? "cjs" : "esm"
        }
      }
    }
  });
  try {
    const [clientBundle, serverBundle] = await Promise.all([
      viteBuild(resolveViteConfig(false)),
      viteBuild(resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle];
  } catch (e) {
    console.log(e);
  }
}
async function renderPage(render, root, clientBundle) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === "chunk" && chunk.isEntry
  );
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
            <script src="/${clientChunk.fileName}" type="module"><\/script>
        </body>
        </html>
    `.trim();
  await fs.writeFile(join2(root, "build", "index.html"), html);
  await fs.remove(join2(root, ".temp"));
}
async function build(root = process.cwd()) {
  const [clientBundle] = await bundle(root);
  const serverEntryPath = join2(root, ".temp", "ssr-entry.js");
  const { render } = await import(serverEntryPath);
  await renderPage(render, root, clientBundle);
}

// src/node/cli.ts
import { resolve } from "path";
var version = require_package().version;
var cli = cac("adsionli").version(version).help();
cli.command("[root]", "start dev server").alias("dev").action(async (root) => {
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});
cli.command("build [root]", "build for production").action(async (root) => {
  try {
    root = resolve(root);
    await build(root);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();