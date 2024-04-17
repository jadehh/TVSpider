/*
* @File     : kunyu77.js
* @Author   : jade
* @Date     : 2024-04-16 18:55:12
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 酷云77 (已失效)
*/

import {NodeJSSpider} from "../spider.js";
import {formatPlayUrl, randDeviceWithId, jsonParse, randUUID} from '../../util/misc.js';
import dayjs from 'dayjs';
import NodeRSA from 'node-rsa';
import CryptoJS from 'crypto-js';
import {VodDetail, VodShort} from "../../../../lib/vod.js";
let device = {};
let timeOffset = 0;
const appVer = '2.3.0';
const rsa = NodeRSA(`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7QHUVAUM7yghB0/3qz5C
bWX5YYD0ss+uDtbDz5VkTclop6YnCY+1U4aw4z134ljkp/jL0mWnYioZHTTqxXMf
R5q15FcMZnnn/gMZNj1ZR67/c9ti6WTG0VEr9IdcJgwHwwGak/xQK1Z9htl7TR3Q
WA45MmpCSSgjVvX4bbV43IjdjSZNm8s5efdlLl1Z+7uJTR024xizhK5NH0/uPmR4
O8QEtxO9ha3LMmTYTfERzfNmpfDVdV3Rok4eoTzhHmxgqQ0/S0S+FgjHiwrCTFlv
NCiDhSemnJT+NIzAnMQX4acL5AYNb5PiDD06ZMrtklTua+USY0gSIrG9LctaYvHR
swIDAQAB
-----END PUBLIC KEY-----`, 'pkcs8-public-pem', {
    encryptionScheme: 'pkcs1',
});


class KunYun77Spider extends NodeJSSpider {
    constructor() {
        super();
        this.siteUrl = 'https://api.tyun77.cn';
    }

    getName() {
        return `👒|酷云77|👒`
    }

    getAppName() {
        return "酷云77"
    }

    getJSName() {
        return "kunyu77"
    }

    async request(reqUrl, ua) {
        let sj = dayjs().unix() - timeOffset;
        let uri = new URL(reqUrl);
        uri.searchParams.append('pcode', '010110010');
        uri.searchParams.append('version', appVer);
        uri.searchParams.append('devid', device.id);
        uri.searchParams.append('package', 'com.sevenVideo.app.android'); // com.xiaoxiaoVideo.app.android
        uri.searchParams.append('sys', 'android');
        uri.searchParams.append('sysver', device.release);
        uri.searchParams.append('brand', device.brand);
        uri.searchParams.append('state', 'on');
        uri.searchParams.append('model', device.model.replaceAll(' ', '_'));
        uri.searchParams.append('sj', sj);
        let keys = [];
        for (const k of uri.searchParams.keys()) {
            keys.push(k);
        }
        keys.sort();
        let tkSrc = uri.pathname;
        for (let k of keys) {
            let v = uri.searchParams.get(k);
            v = encodeURIComponent(v);
            tkSrc += v;
        }
        tkSrc += sj;
        tkSrc += 'XSpeUFjJ';
        let tk = CryptoJS.enc.Hex.stringify(CryptoJS.MD5(tkSrc)).toString().toLowerCase();
        let header = {
            'User-Agent': ua || 'okhttp/3.12.0', T: sj, TK: tk,
        };

        if (reqUrl.indexOf('getVideoPlayAuth') > 0) {
            header['TK-VToken'] = rsa.encrypt(`{"videoId":"${uri.searchParams.get('videoId')}","timestamp":"${sj}"}`, 'base64');
        } else if (reqUrl.indexOf('parserUrl') > 0) {
            header['TK-VToken'] = rsa.encrypt(`{"url":"${uri.searchParams.get('url')}","timestamp":"${sj}"}`, 'base64');
        }

        let resp = await req(uri.toString(), {
            headers: header,
        });

        let serverTime = resp.headers.date; //  dart all response header key is lowercase
        let serverTimeS = dayjs(serverTime).unix();
        timeOffset = dayjs().unix() - serverTimeS;
        return JSON.parse(resp.content);
    }

    async init(inReq, _outResp) {
        const deviceKey = inReq.server.prefix + '/device';
        device = await inReq.server.db.getObjectDefault(deviceKey, {});
        if (!device.id) {
            device = randDeviceWithId(32);
            device.id = device.id.toLowerCase();
            device.ua = 'Dalvik/2.1.0 (Linux; U; Android ' + device.release + '; ' + device.model + ' Build/' + device.buildId + ')';
            await inReq.server.db.push(deviceKey, device);
        }
        await this.request(this.siteUrl + '/api.php/provide/getDomain');
        await this.request(this.siteUrl + '/api.php/provide/config');
        await this.request(this.siteUrl + '/api.php/provide/checkUpgrade');
        await this.request(this.siteUrl + '/api.php/provide/channel');
        await super.init(inReq, _outResp)
    }

    async setClasses() {
        let data = (await this.request(this.siteUrl + '/api.php/provide/filter')).data;
        for (const key in data) {
            this.classes.push(this.getTypeDic(data[key][0].cat, key))
        }
    }

    async getFilter() {
        let filterAll = []
        let filterData = (await this.request(this.siteUrl + '/api.php/provide/searchFilter?type_id=0&pagenum=1&pagesize=24')).data.conditions;

        let year = {
            key: 'year', name: '年份', init: '',
        };
        let yearValues = [];
        yearValues.push({n: '全部', v: ''});
        // yearValues.push({ n: '2022', v: '2022' });
        // yearValues.push({ n: '2021', v: '2021' });
        filterData.y.forEach((e) => {
            yearValues.push({n: e.name, v: e.value});
        });
        year['value'] = yearValues;
        // 地区
        let area = {
            key: 'area', name: '地区', init: '',
        };
        let areaValues = [];
        areaValues.push({n: '全部', v: ''});
        filterData.a.forEach((e) => {
            areaValues.push({n: e.name, v: e.value});
        });
        area['value'] = areaValues;
        // 类型
        let type = {
            key: 'category', name: '类型', init: '',
        };
        let typeValues = [];
        typeValues.push({n: '全部', v: ''});
        filterData.scat.forEach((e) => {
            typeValues.push({n: e.name, v: e.value});
        });
        type['value'] = typeValues;

        filterAll.push(year, area, type);
        return filterAll
    }

    async setFilterObj() {
        for (const typeDic of this.classes) {
            let type_id = typeDic["type_id"]
            if (type_id !== "最近更新") {
                this.filterObj[type_id] = await this.getFilter()
            }
        }
    }

    async parseVodShortListFromJson(list) {
        let videos = []
        for (const vod of list) {
            let vodShort = new VodShort()
            vodShort.vod_id = vod["id"]
            vodShort.vod_name = vod["title"] ?? vod["videoName"]
            vodShort.vod_pic = vod["videoCover"]
            vodShort.vod_remarks = vod["msg"]
            videos.push(vodShort)
        }
        return videos
    }

    async parseVodDetailfromJson(data) {
        let vodDetail = new VodDetail()
        vodDetail.vod_id = data["id"]
        vodDetail.vod_name = data["videoName"]
        vodDetail.vod_pic = data["videoCover"]
        vodDetail.type_name = data["subCategory"]
        vodDetail.vod_year = data["year"]
        vodDetail.vod_area = data["area"]
        vodDetail.vod_remarks = data["msg"]
        vodDetail.vod_actor = data["actor"]
        vodDetail.vod_director = data["director"]
        vodDetail.vod_content = data["brief"].trim()
        let episodes = (await this.request(this.siteUrl + '/api.php/provide/videoPlaylist?ids=' + data["id"])).data["episodes"];
        let playlist = {};
        for (const episode of episodes) {
            let playurls = episode["playurls"];
            for (const playurl of playurls) {
                let from = playurl["playfrom"];
                let t = formatPlayUrl(vodDetail.vod_name, playurl.title);
                if (t.length === 0) t = playurl.title.trim();
                if (!playlist.hasOwnProperty(from)) {
                    playlist[from] = [];
                }
                playlist[from].push(t + '$' + playurl["playurl"]);
            }
        }
        vodDetail.vod_play_from = Object.keys(playlist).join('$$$');
        let urls = Object.values(playlist);
        let vod_play_url = [];
        for (const urlist of urls) {
            vod_play_url.push(urlist.join('#'));
        }
        vodDetail.vod_play_url = vod_play_url.join('$$$');
        return vodDetail
    }

    async setHomeVod() {
        let data = (await this.request(this.siteUrl + "/api.php/provide/homeBlock?type_id=0pagenum=20")).data
        this.homeVodList = await this.parseVodShortListFromJson(data["blocks"])
    }

    async setCategory(tid, pg, filter, extend) {
        let reqUrl = this.siteUrl + '/api.php/provide/searchFilter?type_id=' + tid + '&pagenum=' + pg + '&pagesize=24&';
        reqUrl += `year=${extend.year || ''}&category=${extend.category || ''}&area=${extend.area || ''}`;
        let data = (await this.request(reqUrl)).data;
        this.vodList = await this.parseVodShortListFromJson(data.result)
    }

    async setDetail(id) {
        let data = (await this.request(this.siteUrl + '/api.php/provide/videoDetail?ids=' + id)).data;
        this.vodDetail = await this.parseVodDetailfromJson(data)
    }

    async setPlay(flag, id, flags) {
        if (flag == 'alivc') {
            const ua = `Dalvik/2.1.0(sevenVideo android)${device.release} ${appVer} ${device.brand}`;
            let data = (await this.request(this.siteUrl + '/api.php/provide/getVideoPlayAuth?videoId=' + id)).data;
            await this.jadeLog.debug(`data:${data}`)
            var s = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(data["playAuth"]));
            s = JSON.parse(s);
            const e = {
                AccessKeyId: s.AccessKeyId,
                Action: 'GetPlayInfo',
                AuthInfo: s.AuthInfo,
                AuthTimeout: 3600,
                Channel: 'Android',
                Format: 'JSON',
                Formats: '',
                PlayerVersion: '',
                Rand: randUUID(),
                SecurityToken: s.SecurityToken,
                SignatureMethod: 'HMAC-SHA1',
                SignatureNonce: randUUID(),
                SignatureVersion: '1.0',
                Version: '2017-03-21',
                VideoId: id,
            };
            let keys = Object.keys(e);
            keys.sort();

            let param = keys.map((k) => k + '=' + encodeURIComponent(e[k])).join('&');
            let signSrc = 'GET&%2F&' + encodeURIComponent(param);
            let sign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(signSrc, s.AccessKeySecret + '&'));
            param += '&Signature=' + encodeURIComponent(sign);

            const aliurl = 'https://vod.cn-shanghai.aliyuncs.com/?' + param;
            const res = await req(aliurl, {
                header: {
                    'User-Agent': ua,
                },
            });
            if (res.code === 200) {
                this.result.header = {
                    'User-Agent': ua,
                }
                const p = JSON.parse(res.content);
                this.playUrl = p["PlayInfoList"]["PlayInfo"][0]["PlayURL"]
            } else {
                this.playUrl = id
            }
        } else {
            let data = (await this.request(this.siteUrl + '/api.php/provide/parserUrl?url=' + id + '&retryNum=0')).data;
            let playHeader = data.playHeader;
            let jxUrl = data.url;
            if (jxUrl.indexOf(this.siteUrl) >= 0) {
                let result = jsonParse(id, await this.request(jxUrl));
                this.result.parse = 0
                this.playUrl = result["url"]
                this.result.header = Object.assign(result.header, playHeader);
            } else {
                let res = await req(jxUrl, {
                    headers: {
                        'user-agent': 'okhttp/3.12.0',
                    },
                });
                let result = jsonParse(id, res.data);
                this.result.parse = 0
                this.result.header = Object.assign(result.header, playHeader);
                this.playUrl = res["url"]
            }
        }

    }

    async setSearch(wd, quick) {
        let page = 0
        let data = await this.request(this.siteUrl + '/api.php/provide/searchVideo?searchName=' + wd + '&pg=' + page, 'okhttp/3.12.0');
        this.vodList = await this.parseVodShortListFromJson(data.data)
    }

}


let spider = new KunYun77Spider()

async function init(inReq, _outResp) {
    return await spider.init(inReq, _outResp)
}

async function home(inReq, _outResp) {
    return await spider.home(inReq, _outResp)
}

async function homeVod(inReq, _outResp) {
    return await spider.homeVod(inReq, _outResp)
}

async function category(inReq, _outResp) {
    return await spider.category(inReq, _outResp)
}

async function detail(inReq, _outResp) {
    return await spider.detail(inReq, _outResp)
}

async function play(inReq, _outResp) {
    return await spider.play(inReq, _outResp)
}

async function search(inReq, _outResp) {
    return await spider.search(inReq, _outResp)
}

export default {
    meta: {
        key: spider.getJSName(), name: spider.getName(), type: spider.getType(),
    }, api: async (fastify) => {
        fastify
            .post('/init', init);
        fastify
            .post('/home', home);
        fastify
            .post('/category', category);
        fastify
            .post('/detail', detail);
        fastify
            .post('/play', play);
        fastify
            .post('/search', search);
    }, spider: {
        init: init, home: home, homeVod: homeVod, category: category, detail: detail, play: play, search: search
    }
}

