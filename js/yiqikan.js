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

    getRequestId() {
        let strArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        let sb = "";
        for (let i = 0; i < 32; i++) {
            sb = sb + strArr[_.random(0, strArr.length)];
        }
        return sb.toString();
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

    getParams(is_category=false,tid=null) {
        let requestId = this.getRequestId()
        let appid = "e6ddefe09e0349739874563459f56c54"
        let reqDomain = "m.yqktv888.com"
        let udid = Utils.getUUID();
        let appKey = "3359de478f8d45638125e446a10ec541"
        let params = {"appId":appid}
        if (is_category){
            if (!_.isEmpty(this.nextObj[tid])){
                params["nextVal"] = this.nextObj[tid]
            }
            params["queryValueJson"] = JSON.stringify([{"filerName": "channelId", "filerValue": tid.toString()}]).replaceAll("\\\\","")
        }
        params["reqDomain"] = reqDomain
        params["requestId"] = requestId
        params["udid"] = udid
        params["appKey"] = appKey
        params["sign"] = md5X(Utils.objectToStr(params))
        delete params["appKey"]
        return params
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
        this.limit = 18
        let params = this.getParams(true,tid)
        let response = await this.post(url, params, this.getHeader(), "raw")
        let resJson = JSON.parse(response)
        if (resJson["data"]["hasNext"]) {
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