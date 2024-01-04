/*
* @File     : jiujiuliu.js
* @Author   : jade
* @Date     : 2024/1/4 14:15
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 996影视
*/

import {Spider} from "./spider.js";
import {load} from "../lib/cat.js";
import {VodShort} from "../lib/vod.js";


class JiuJiuLiuSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.cs1369.com"
    }

    getAppName() {
        return "🍥┃九九六影视┃🍥"
    }

    getName() {
        return "九九六影视"
    }

    parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $("[class=\"stui-vodlist clearfix\"]").find("li")
        for (const vodElement of vodElements) {
            let resource = $(vodElement).find("[class=\"stui-vodlist__thumb lazyload\"]")[0]
            let vodShort = new VodShort()
            vodShort.vod_id = resource.attribs["href"]
            vodShort.vod_name = resource.attribs["title"]
            vodShort.vod_pic = resource.attribs["data-original"]
            vodShort.vod_remarks = $($(resource).find("[class=\"pic-text text-right\"]")[0]).text()
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setClasses() {
        let html = await this.fetch(this.siteUrl, null, this.getHeader())
        if (html !== null) {
            let $ = load(html)
            let menuElements = $("[class=\"stui-header__menu type-slide\"]").find("a")
            for (const menuElement of menuElements) {
                let type_dic = {
                    "type_name": $(menuElement).text(),
                    "type_id": menuElement.attribs["href"]
                }
                this.classes.push(type_dic)
            }
        }

    }

    async setHome(filter) {
        // await this.setClasses()
        this.classes = [
            {
                "type_name": "首页",
                "type_id": "/"
            },
            {
                "type_name": "电影",
                "type_id": "/show/id/1"
            },
            {
                "type_name": "电视剧",
                "type_id": "/show/id/2"
            },
            {
                "type_name": "动漫",
                "type_id": "/show/id/3"
            },
            {
                "type_name": "爽文短剧",
                "type_id": "/show/id/4"
            }
        ];
        if (!this.catOpenStatus) {
            this.classes.shift()
        }
    }

    async setCategory(tid, pg, filter, extend) {
        let cateUrl = ""
        if (tid !== "/") {
            cateUrl = this.siteUrl + tid + `/page/${pg.toString()}.html`
        } else {
            cateUrl = this.siteUrl + tid
        }
        this.limit = 36
        let html = await this.fetch(cateUrl, null, this.getHeader())
        if (html != null) {
            let $ = load(html)
            this.vodList = this.parseVodShortListFromDoc($)
        }
    }
}

let spider = new JiuJiuLiuSpider()

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

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}