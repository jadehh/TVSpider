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
import {_} from "../lib/cat.js";


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
        let navElements = $($("[class=\"nav_nav__zgz60\"]")[0]).find("a")
        for (const navElement of navElements) {
            let type_id = navElement.attribs.href
            let type_name = $(navElement).text()
            if (type_id !== "/" && type_name !== "电视直播") {
                this.classes.push(this.getTypeDic(type_name, type_id))
            }
        }
    }


    async getFilter($) {
    }

    async setFilterObj() {
        for (const type_dic of this.classes.slice(1, 5)) {
            let type_id = type_dic["type_id"]
            if (type_id !== "最近更新") {
                let url = this.siteUrl + `${type_id}/all/all/all`
                let $ = await this.getHtml(url)
                this.filterObj[type_id] = await this.getFilter($)
            }
        }
    }





    async setHomeVod() {
    }


    async setCategory(tid, pg, filter, extend) {

    }

    async setDetail(id) {
    }

    async setSearch(wd, quick) {
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