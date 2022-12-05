"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const dev_1 = require("./dev");
const build_1 = require("./build");
const path_1 = require("path");
const version = require("../../package.json").version;
const cli = (0, cac_1.cac)("adsionli").version(version).help();
cli
    .command("[root]", "start dev server")
    .alias("dev")
    .action(async (root) => {
    const server = await (0, dev_1.createDevServer)(root);
    await server.listen();
    server.printUrls();
});
cli
    .command("build [root]", "build for production")
    .action(async (root) => {
    try {
        root = (0, path_1.resolve)(root);
        await (0, build_1.build)(root);
    }
    catch (e) {
        console.log(e);
    }
});
cli.parse();
