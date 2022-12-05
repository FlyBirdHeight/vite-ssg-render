"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginIndexHtml = void 0;
const promises_1 = require("fs/promises");
const index_1 = require("../constants/index");
function pluginIndexHtml() {
    return {
        name: 'adsionli: index-html',
        configureServer(server) {
            return () => {
                server.middlewares.use(async (req, res, next) => {
                    //1. 读取index.html内容
                    //2. 通过res对象，响应 HTML 浏览器
                    let content = await (0, promises_1.readFile)(index_1.DEFAULT_INDEX_PATH, "utf-8");
                    try {
                        content = await server.transformIndexHtml(req.url, content, req.originalUrl);
                        res.setHeader("Content-Type", "text/html");
                        res.end(content);
                    }
                    catch (e) {
                        return next(e);
                    }
                });
            };
        }
    };
}
exports.pluginIndexHtml = pluginIndexHtml;
