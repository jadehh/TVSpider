/*
* @File     : dygangs.js
* @Author   : jade
* @Date     : 2024/2/21 15:06
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 电影港
*/

import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";
import {_, load} from "../lib/cat.js";


class MoviePortSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.dygangs.xyz"
    }

    getAppName() {
        return "电影港"
    }

    getName() {
        return "🏖️|电影港|🏖️"
    }


    async setClasses() {
        let $ = await this.getHtml()
        let navElements = $($("[class=\"top-nav\"]")[0]).find("a")
        for (const navElement of navElements) {
            let type_id = navElement.attribs.href.replaceAll(this.siteUrl, "")
            let type_name = $(navElement).text()
            if (type_id !== "/") {
                this.classes.push(this.getTypeDic(type_name, type_id))
            }
        }
    }


    async getFilter($, index) {
        let element = $("[class=\"nav-down-2 clearfix\"]")[index]
        let extend_list = []
        if (element !== undefined) {
            let name = "按类型"
            let extend_dic = {"key": name, "name": name, "value": []}
            extend_dic["name"] = name
            extend_dic["value"].push({"n": "全部", "v": "0"})
            for (const ele of $(element).find("a")) {
                let type_name = $(ele).html()
                let type_id = ele.attribs.href.split("/").slice(-2)[0]
                extend_dic["value"].push({"n": type_name, "v": type_id})
            }
            extend_list.push(extend_dic)
        }
        return extend_list
    }

    async setFilterObj() {
        let index = 0
        for (const type_dic of this.classes.slice(1, 5)) {
            let type_id = type_dic["type_id"]
            if (type_id !== "最近更新") {
                let url = this.siteUrl + `${type_id}`
                let $ = await this.getHtml(url)
                this.filterObj[type_id] = await this.getFilter($, index)
            }
            index = index + 1
        }
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $("[class=\"index-tj-l\"]").find("li")
        for (const vodElement of vodElements) {
            let vodShortElement = $(vodElement).find("a")[0]
            let vodShort = new VodShort();
            vodShort.vod_id = vodShortElement.attribs.href
            vodShort.vod_name = vodShortElement.attribs.title
            vodShort.vod_pic = $(vodShortElement).find("img")[0].attribs["data-original"]
            vodShort.vod_remarks = $($(vodShortElement).find("i")[0]).text().replaceAll(" ", "").replaceAll("\n", "")
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setHomeVod() {
        let $ = await this.getHtml()
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }


    async setCategory(tid, pg, filter, extend) {

    }

    async setDetail(id) {
    }

    async setSearch(wd, quick) {
        let url = this.siteUrl + "/e/search/index.php"
        let params = {"keyboard": wd, "submit": "搜 索", "show": "title,zhuyan", "tempid": "1"}
        let resp = await this.post(url, params, this.getHeader())
        let $ = load(resp)
        this.vodList = this.parseVodShortListFromDocBySearch($)

    }

}

let spider = new MoviePortSpider()

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