/*
* @File     : ciliduo.js
* @Author   : jade
* @Date     : 2024/3/1 13:26
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {_, load} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";


class CiliDuoSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://of.cilido.top"
        this.vodShortObj = {}
    }

    getName() {
        return "🍚|磁力多BT|🍚"
    }

    getAppName() {
        return "磁力多BT"
    }

    getProxy(src) {
        return atob(src)
    }

    async home(filter) {
        try {
            await this.jadeLog.info("正在解析首页类别", true)
            let $ = await this.getHtml()
            let proxy_src = Utils.getStrByRegex(/var proxy = atob\('(.*?)'\)/, $.html())
            let proxy = this.getProxy(proxy_src)
            let params = `/?host=${Utils.getHost(this.siteUrl).split("://").slice(-1)[0]}&v=1`
            let homeContent = await this.fetch(proxy, params, this.getHeader())
            return await this.parseVodShortListFromDoc(load(homeContent))
        } catch (e) {
            await this.jadeLog.error(`首页解析失败,失败原因为:${e}`)
        }

    }

    async parseVodShortListFromDoc($) {
        let rootElemet = $("[class=\"htab\"]")
        let navElements = rootElemet.find("a")
        let vodElements = $("[class=\"hotwords\"]").find("ul")
        for (let i = 0; i < navElements.length; i++) {
            let navElement = navElements[i]
            if (i !== navElements.length - 1) {
                let type_name = $(navElement).text()
                if (type_name === "热门") {
                    type_name = "最近更新"
                }
                this.classes.push(this.getTypeDic(type_name, type_name))
                let vodElement = vodElements[i]
                let vod_list = []
                for (const vodShorElement of $(vodElement).find("a")) {
                    let vodShort = new VodShort()
                    vodShort.vod_id = vodShorElement.attribs.href
                    vodShort.vod_name = $(vodShorElement).html()
                    vodShort.vod_pic = Utils.RESOURCEURL + "/resources/cili.jpg"
                    vod_list.push(vodShort)
                }
                this.vodShortObj[type_name] = vod_list
            }
        }
        return this.result.home(this.classes, [], this.filterObj)
    }


    async setHomeVod() {
        this.homeVodList = this.vodShortObj["最近更新"]
    }

    async setCategory(tid, pg, filter, extend) {
        this.vodList = this.vodShortObj[tid]
    }

}

let spider = new CiliDuoSpider()

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
