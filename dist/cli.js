"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// src/node/cli.ts
var _cac = require('cac');

// src/node/dev.ts
var _vite = require('vite');

// src/node/plugin-adsionli/indexHtml.ts
var _promises = require('fs/promises');

// src/node/constants/index.ts
var _path = require('path'); var path = _interopRequireWildcard(_path);
var PACKAGE_ROOT = path.join(__dirname, "..");
var DEFAULT_INDEX_PATH = path.join(PACKAGE_ROOT, "index.html");
var CLIENT_ENTRY_PATH = path.join(
  PACKAGE_ROOT,
  "src",
  "runtime",
  "client-entry.tsx"
);
var SERVER_ENTRY_PATH = path.join(
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
          let content = await _promises.readFile.call(void 0, DEFAULT_INDEX_PATH, "utf-8");
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
var _pluginreact = require('@vitejs/plugin-react'); var _pluginreact2 = _interopRequireDefault(_pluginreact);
function createDevServer(root) {
  return _vite.createServer.call(void 0, {
    root,
    plugins: [pluginIndexHtml(), _pluginreact2.default.call(void 0, )]
  });
}

// src/node/build.ts



var _fsextra = require('fs-extra'); var _fsextra2 = _interopRequireDefault(_fsextra);
console.log("213");
async function bundle(root) {
  const resolveViteConfig = (isServer) => ({
    mode: "production",
    root,
    plugins: [_pluginreact2.default.call(void 0, )],
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
      _vite.build.call(void 0, resolveViteConfig(false)),
      _vite.build.call(void 0, resolveViteConfig(true))
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
  await _fsextra2.default.writeFile(_path.join.call(void 0, root, "build", "index.html"), html);
  await _fsextra2.default.remove(_path.join.call(void 0, root, ".temp"));
}
async function build(root = process.cwd()) {
  const [clientBundle] = await bundle(root);
  const serverEntryPath = _path.join.call(void 0, root, ".temp", "ssr-entry.js");
  const { render } = await Promise.resolve().then(() => require(serverEntryPath));
  await renderPage(render, root, clientBundle);
}

// src/node/cli.ts

var version = "0.0.1";
var cli = _cac.cac.call(void 0, "adsionli").version(version).help();
cli.command("[root]", "start dev server").alias("dev").action(async (root) => {
  const server = await createDevServer(root);
  await server.listen();
  server.printUrls();
});
cli.command("build [root]", "build for production").action(async (root) => {
  try {
    root = _path.resolve.call(void 0, root);
    await build(root);
  } catch (e) {
    console.log(e);
  }
});
cli.parse();
