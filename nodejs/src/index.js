import fastify from 'fastify';
import router from './router.js';
import {JsonDB, Config} from 'node-json-db';
import axios from 'axios';
import {JadeLogging} from "./util/log.js";
import * as repl from "repl";

let server = null;
let JadeLog = new JadeLogging("服务管理", "DEBUG")

/**
 * Start the server with the given configuration.
 *
 * Be careful that start will be called multiple times when
 * work with catvodapp. If the server is already running,
 * the stop will be called by engine before start, make sure
 * to return new server every time.
 *
 * @param {Map} config - the config of the server
 * @return {void}
 */
export async function start(config) {
    /**
     * @type {import('fastify').FastifyInstance}
     */
    server = fastify({
        serverFactory: catServerFactory,
        forceCloseConnections: true,
        logger: !!(process.env.NODE_ENV !== 'development'),
        maxParamLength: 10240,
    });
    server.messageToDart = async (data, inReq) => {
        try {
            if (!data.prefix) {
                data.prefix = inReq ? inReq.server.prefix : '';
            }
            console.log(data);
            const port = catDartServerPort();
            if (port == 0) {
                return null;
            }
            let sniffUrlList = ["https://jx.xmflv.com/?url=", "https://jx.quankan.app/?url=","https://jx.yparse.com/index.php?url="]
            for (const sniffUrl of sniffUrlList) {
                data["opt"]["url"] = sniffUrl + data["opt"]["url"]
                data["opt"]["timeout"] = Math.floor(parseInt(data["opt"]["timeout"]) / sniffUrlList.length)
                await JadeLog.debug(`嗅探,请求URL为:${`http://127.0.0.1:${port}/msg`},传参:${JSON.stringify(data)}`)
                const resp = await axios.post(`http://127.0.0.1:${port}/msg`, data);
                if (resp.data === "sniff timeout") {
                    await JadeLog.debug(`嗅探失败,返回结果为:${JSON.stringify(resp.data)},继续嗅探`)
                    continue
                }
                await JadeLog.debug(`嗅探成功,返回结果为:${JSON.stringify(resp.data)},headers:${JSON.stringify(resp.headers)}`)
                return resp.data;
            }

        } catch (error) {
            return null;
        }
    };
    server.address = function () {
        const result = this.server.address();
        result.url = `http://${result.address}:${result.port}`;
        result.dynamic = 'js2p://_WEB_';
        return result;
    };
    server.addHook('onError', async (_request, _reply, error) => {
        console.error(error);
        if (!error.statusCode) error.statusCode = 500;
        return error;
    });
    server.stop = false;
    server.config = config;
    // 推荐使用NODE_PATH做db存储的更目录，这个目录在应用中清除缓存时会被清空
    server.db = new JsonDB(new Config((process.env['NODE_PATH'] || '.') + '/db.json', true, true, '/', true));
    server.register(router);
    // 注意 一定要监听ipv4地址 build后 app中使用时 端口使用0让系统自动分配可用端口
    server.listen({port: process.env['DEV_HTTP_PORT'] || 0, host: '127.0.0.1'});
}

/**
 * Stop the server if it exists.
 *
 */
export async function stop() {
    if (server) {
        server.close();
        server.stop = true;
    }
    server = null;
}
