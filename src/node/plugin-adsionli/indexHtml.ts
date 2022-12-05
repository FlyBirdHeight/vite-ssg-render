import { Plugin } from "vite";
import { readFile } from "fs/promises";
import { DEFAULT_INDEX_PATH } from '../constants/index';
export function pluginIndexHtml(): Plugin {
    return {
        name: 'adsionli: index-html',
        configureServer(server) {
            return () => {
                server.middlewares.use(async (req, res, next) => {
                    //1. 读取index.html内容
                    //2. 通过res对象，响应 HTML 浏览器
                    let content = await readFile(DEFAULT_INDEX_PATH, "utf-8");
                    try {
                        content = await server.transformIndexHtml(req.url, content, req.originalUrl);
                        res.setHeader("Content-Type", "text/html");
                        res.end(content);
                    } catch (e) {
                        return next(e)
                    }

                })
            }
        }
    }
}