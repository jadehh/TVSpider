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

const confs = {};
globalThis.local = {
    get: async function (storage, key) {
        return localGet(storage, key);
    }, set: async function (storage, key, val) {
        localSet(storage, key, val);
    },
};


function initLocalStorage(storage) {
    if (!_.has(confs, storage)) {
        if (!fs.existsSync('local')) {
            fs.mkdirSync('local');
        }

        const storagePath = 'local/js_' + storage;

        if (!fs.existsSync(storagePath)) {
            fs.writeFileSync(storagePath, '{}');
            confs[storage] = {};
        } else {
            confs[storage] = JSON.parse(fs.readFileSync(storagePath).toString());
        }
    }
}

function localGet(storage, key) {
    initLocalStorage(storage);
    return _.get(confs[storage], key, '');
}

function localSet(storage, key, value) {
    initLocalStorage(storage);
    confs[storage][key] = value;
    fs.writeFileSync('local/js_' + storage, JSON.stringify(confs[storage]));
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
    fs.writeFileSync('log/info.log', initLocalLogStorage() + "\n" +value );
}

globalThis.req = request;

async function request(url, opt) {
    try {
        let data = opt ? opt.data || null : null;
        let postType = opt ? opt.postType || null : null;
        let returnBuffer = opt ? opt.buffer || 0 : 0;
        let timeout = opt ? opt.timeout || 5000 : 5000;
        let redirect = (opt ? opt.redirect || 1 : 1) === 1;

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
        // const agent = tunnel.httpsOverHttp({
        //     proxy: {
        //         host: '127.0.0.1', port: 7890,
        //     }
        // });

        let resp = await axios(url, {
            responseType: respType,
            method: opt ? opt.method || 'get' : 'get',
            headers: headers,
            data: data,
            timeout: timeout,
            maxRedirects: !redirect ? 0 : null,
            httpsAgent: https.Agent({
                rejectUnauthorized: false,
            }), // httpsAgent: agent,

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
