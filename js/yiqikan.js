/*
* @File     : yiqikan.js
* @Author   : jade
* @Date     : 2024/3/19 18:45
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import * as Utils from "../lib/utils.js";
import {_, load} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import {Spider} from "./spider.js";


class YiQiKanSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://api.gquaxhce.com"
        this.nextObj = {}
    }

    getName() {
        return "🛫|一起看|🛫"
    }

    getAppName() {
        return "一起看"
    }

    getHeader() {
        let headers = super.getHeader();
        headers["Connection"] = "keep-alive"
        headers["Host"] = "api.gquaxhce.com"
        return headers
    }

    getParams() {
        return {
            "appId": "e6ddefe09e0349739874563459f56c54",
            "reqDomain": "m.yqktv888.com",
            "requestId": "Lijp48hZIISGLLh8wsT2VGYHJrNXVPvC",
            "udid": "516d15d9-ffff-497a-86c6-959d244c28bd-18e564903e6",
            "sign": "400eb4a56f31d5c378cb28b9c2cbd9f6"
        }
    }

    async setClasses() {
        let response = JSON.parse(await this.post(this.siteUrl + "/v1/api/home/header", this.getParams(), this.getHeader(), "raw"))
        for (const data of response["data"]["channelList"]) {
            this.classes.push(this.getTypeDic(data["channelName"], data["channelId"]))
        }
    }


    async parseVodShortListFromJson(obj) {
        let vod_list = []
        for (const data of obj) {
            let vodShort = new VodShort()
            vodShort.vod_id = data["vodId"]
            vodShort.vod_name = data["vodName"]
            vodShort.vod_remarks = data["watchingCountDesc"]
            vodShort.vod_pic = data["coverImg"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setHomeVod() {
        let response = await this.post(this.siteUrl + "/v1/api/home/body", this.getParams(), this.getHeader(), "raw")
        this.homeVodList = await this.parseVodShortListFromJson(JSON.parse(response)["data"]["hotVodList"])
    }

    async setCategory(tid, pg, filter, extend) {
        let url = this.siteUrl + "/v1/api/search/queryNow"
        let params = this.getParams()
        this.limit = 18
        params["nextCount"] = this.limit
        params["nextVal"] = this.nextObj[tid] ?? ""
        params["queryValueJson"] = JSON.stringify([{"filerName":"channelId","filerValue":tid.toString()}])
        params["sign"] = "0fb3206365fb6de20b110bf59520a12a"
        params["udid"] = "ee8c303e-88f7-433a-a1eb-ddfe1aa38d1e-18e564b071a"
        params["requestId"] = "sBTpVQmS19ufWuFIjySRWxIpEYNvXKZM"
        let response = await this.post(url, params, this.getHeader(), "raw")
        let resJson = JSON.parse(response)
        if (resJson["data"]["hasNext"]){
           this.nextObj["tid"] = resJson["data"]["nextVal"]
        }
        this.vodList = await this.parseVodShortListFromJson(resJson["data"]["items"])
    }

}

let spider = new YiQiKanSpider()

async function init(cfg) {
    await spider.init(cfg)
}

async function home(filter) {
    return await spider.home(filter)
}

async function homeVod() {
    return await spider.homeVod()
}

async function category(tid, pg, filter, extend) {
    return await spider.category(tid, pg, filter, extend)
}

async function detail(id) {
    return await spider.detail(id)
}

async function play(flag, id, flags) {
    return await spider.play(flag, id, flags)
}

async function search(wd, quick) {
    return await spider.search(wd, quick)
}

async function proxy(segments, headers) {
    return await spider.proxy(segments, headers)
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
        proxy: proxy
    };
}