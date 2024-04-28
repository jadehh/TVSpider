/*
* @File     : global.js
* @Author   : jade
* @Date     : 2024/3/26 10:17
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {_} from "../../../lib/cat.js";
import fs from "node:fs";
import qs from "qs";
import axios, {toFormData} from "axios";
import https from "https";
import crypto from "crypto";
import tunnel from "tunnel";

let confs = {};
globalThis.dataBase = null

globalThis.local = {
    get: async function (storage, key) {
        return await localGet(storage, key);
    }, set: async function (storage, key, val) {
        await localSet(storage, key, val);
    },
};


async function localGet(storage, key) {
    const storagePath = "/js_" + storage + `/${key}/`
    return await dataBase.getObjectDefault(storagePath, {});
}

async function localSet(storage, key, value) {
    const storagePath = "/js_" + storage
    confs = await dataBase.getObjectDefault(storagePath, {})
    confs[key] = value;
    if (storage === "log"){
        await req(`http://127.0.0.1:8099/upload`,{data:{"log":value + "\n"},timeout:0.1})
    }
    await dataBase.push(storagePath, confs);
}


globalThis.localLog = {
    set: async function (storage, key, val) {
        localLogSet(storage, key, val);
    },
};

function initLocalLogStorage() {
    if (!fs.existsSync('log')) {
        fs.mkdirSync('log');
    }
    const storagePath = 'log/info.log';
    if (!fs.existsSync(storagePath)) {
        fs.writeFileSync(storagePath, '');
        return ""
    } else {
        return fs.readFileSync(storagePath).toString();
    }
}

function localLogSet(value) {
    fs.writeFileSync('log/info.log', initLocalLogStorage() + "\n" + value);
}

globalThis.req = request;

async function request(url, opt) {
    try {
        let data = opt ? opt.data || null : null;
        let postType = opt ? opt.postType || null : null;
        let returnBuffer = opt ? opt.buffer || 0 : 0;
        let timeout = opt ? opt.timeout || 5000 : 5000;
        let redirect = (opt ? opt.redirect || 1 : 1) === 1;
        let vpn_proxy = opt.proxy ?? false;

        let headers = opt ? opt.headers || {} : {};
        if (postType === 'form') {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';

            if (data != null) {
                data = qs.stringify(data, {encode: false});
            }
        } else if (postType === 'form-data') {
            headers['Content-Type'] = 'multipart/form-data';
            data = toFormData(data);
        }
        let respType = returnBuffer === 1 || returnBuffer === 2 ? 'arraybuffer' : undefined;
        let agent;
        if (vpn_proxy) {
            agent = tunnel.httpsOverHttp({
                proxy: {
                    host: '127.0.0.1',port:7890,
                }
            });
        } else {
            agent = https.Agent({
                rejectUnauthorized: false,
            })
        }
        let resp = await axios(url, {
            responseType: respType,
            method: opt ? opt.method || 'get' : 'get',
            headers: headers,
            data: data,
            timeout: timeout,
            maxRedirects: !redirect ? 0 : null,
            httpsAgent: agent

        });
        data = resp.data;

        let resHeader = {};
        for (const hks of resp.headers) {
            let v = hks[1];
            resHeader[hks[0]] = Array.isArray(v) ? (v.length === 1 ? v[0] : v) : v;
        }

        if (!returnBuffer) {
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
        } else if (returnBuffer === 1) {
            return {code: resp.status, headers: resHeader, content: data};
        } else if (returnBuffer === 2) {
            return {code: resp.status, headers: resHeader, content: data.toString('base64')};
        } else if (returnBuffer === 3) {
            let stream = opt.stream;
            if (stream['onResp']) await stream['onResp']({code: resp.status, headers: resHeader});
            if (stream['onData']) {
                data.on('data', async (data) => {
                    await stream['onData'](data);
                });
                data.on('end', async () => {
                    if (stream['onDone']) await stream['onDone']();
                });
            } else {
                if (stream['onDone']) await stream['onDone']();
            }
            return 'stream...';
        }
        return {code: resp.status, headers: resHeader, content: data};
    } catch (error) {
        let resp = error.response
        try {
            return {code: resp.status, headers: resp.headers, content: JSON.stringify(resp.data)};
        } catch (err) {
            return {headers: {}, content: ''};
        }
    }
}


globalThis.md5X = md5;

function md5(text) {
    return crypto.createHash('md5').update(Buffer.from(text, 'utf8')).digest('hex');
}

let charStr = 'abacdefghjklmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';

function randStr(len, withNum) {
    let _str = '';
    let containsNum = withNum === undefined ? true : withNum;
    for (let i = 0; i < len; i++) {
        let idx = _.random(0, containsNum ? charStr.length - 1 : charStr.length - 11);
        _str += charStr[idx];
    }
    return _str;
}

globalThis.js2Proxy = function (inReq, url, headers) {
    let hd = Object.keys(headers).length === 0 ? ' ' : encodeURIComponent(JSON.stringify(headers));
    return inReq.server.address().dynamic + inReq.server.prefix + "/proxy/" + encodeURIComponent(url) + "/" + hd + '/'
};