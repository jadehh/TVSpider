/*
* @File     : pipixia.js
* @Author   : jade
* @Date     : 2024/2/2 13:33
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {_, load} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";
import {pipixiaMd5} from "../lib/pipiXiaObject.js"

class PiPiXiaSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "http://pipixia.vip"
        this.pipixiaReconnectTimes = 0
    }

    getHeader() {
        let headers = super.getHeader();
        headers["Connection"] = "keep-alive"
        headers["Host"] = "pipixia.vip"
        return headers
    }

    getName() {
        return "🦐┃皮皮虾影视┃🦐"
    }

    getAppName() {
        return "皮皮虾影视"
    }

    async parseVodShortListFromJson(obj) {
        let vod_list = []
        for (const vod_json of obj["list"]){
            let vodShort = new VodShort();
            vodShort.vod_name = vod_json["vod_name"]
            vodShort.vod_id = vod_json["vod_id"]
            vodShort.vod_pic = vod_json["vod_pic"]
            vodShort.vod_remarks = vod_json["vod_remarks"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async getHtml(url = this.siteUrl, headers = this.getHeader()) {
        try {
            let html = await this.fetch(url, null, headers)
            if (!_.isEmpty(html) && html.indexOf("江苏反诈公益宣传") === -1) {
                return load(html)
            } else {
                if (this.pipixiaReconnectTimes < this.maxReconnectTimes) {
                    Utils.sleep(2)
                    this.dyttReconnectTimes = this.dyttReconnectTimes + 1
                    return await this.getHtml(url, headers)
                } else {
                    await this.jadeLog.error(`html获取失败`, true)
                }
            }
        } catch (e) {
            await this.jadeLog.error(`获取html出错,出错原因为${e}`)
        }

    }


    async setClasses() {
        let $ = await this.getHtml()
        this.classes = [this.getTypeDic("首页", "最近更新")]
        let navElemets = $("[class=\"head-more none box size\"]").find("a")
        for (const navElement of navElemets) {
            let type_name = $(navElement).text()
            let type_id = navElement.attribs.href
            if (type_name !== "留言板") {
                if (type_id.indexOf("/s/") > -1) {
                    type_id = Utils.getStrByRegex(/\/s\/(.*?).html/, type_id)
                    this.classes.push(this.getTypeDic($(navElement).text(), type_id))
                } else {
                    this.classes.push(this.getTypeDic($(navElement).text(), type_id))

                }
            }
        }
    }

    async setFilterObj() {
        super.setFilterObj();
    }

    async setHomeVod() {
        super.setHomeVod();
    }

    async setCategory(tid, pg, filter, extend) {
        if (Utils.isNumeric(tid)){
            let url = this.siteUrl + "/index.php/api/vod"
            let time_1 = Math.floor(new Date().getTime() / 1000)
            let key_1 = pipixiaMd5(time_1)
            let params = {
                "type":tid,
                "page":pg,
                "time":time_1.toString(),
                "key":key_1
            }
            let content_json = JSON.parse(await this.post(url,params))
            if (content_json["code"] === 1){
                this.vodList = await this.parseVodShortListFromJson(JSON.parse(await this.post(url,params)))
            }
        }
    }

    async setDetail(id) {
        let $
    }

}

let spider = new PiPiXiaSpider()

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
        proxy: proxy,
        search: search,
    };
}
