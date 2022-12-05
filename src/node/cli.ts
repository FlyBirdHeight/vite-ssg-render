import { cac } from "cac";
import { createDevServer } from './dev';

const version = require("../../package.json").version;

const cli = cac("adsionli").version(version).help();

cli
    .command("[root]", "start dev server")
    .alias("dev")
    .action(async (root: string) => {
        const server = await createDevServer(root);
        await server.listen();
        server.printUrls();
    })

cli
    .command("build [root]", "build for production")
    .action(async (root: string) => {
        console.log("build", root)
    });

cli.parse();
