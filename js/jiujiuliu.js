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
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";

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

    async parseVodShortListFromDoc($) {
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

    async parseVodPlayFromUrl(play_url) {
        let html = await this.fetch(play_url, null, this.getHeader())
        if (html !== null) {
            let $ = load(html)
        }

    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail()
        let vodElement = $("[class=\"col-pd clearfix\"]")[1]
        let vodShortElement = $(vodElement).find("[class=\"stui-content__thumb\"]")[0]
        let vodItems = []
        for (const playElement of $("[class=\"stui-content__playlist clearfix\"]").find("a")) {
            let episodeUrl = this.siteUrl + playElement.attribs["href"];
            let episodeName = $(playElement).text();
            vodItems.push(episodeName + "$" + episodeUrl);
        }
        vodDetail.vod_name = $(vodShortElement).find("[class=\"stui-vodlist__thumb picture v-thumb\"]")[0].attribs["title"]
        vodDetail.vod_pic = $(vodShortElement).find("img")[0].attribs["data-original"]
        vodDetail.vod_remarks = $($(vodShortElement).find("[class=\"pic-text text-right\"]")[0]).text()
        let data_str = $($(vodElement).find("[class=\"data\"]")).text().replaceAll(" ", " ")
        vodDetail.type_name = Utils.getStrByRegex(/类型：(.*?) /, data_str)
        vodDetail.vod_area = Utils.getStrByRegex(/地区：(.*?) /, data_str)
        vodDetail.vod_year = Utils.getStrByRegex(/年份：(.*?) /, data_str)
        vodDetail.vod_actor = Utils.getStrByRegex(/主演：(.*?) /, data_str)
        vodDetail.vod_director = Utils.getStrByRegex(/导演：(.*?) /, data_str)
        vodDetail.vod_content = $($("[class=\"stui-pannel_bd\"]").find("[class=\"col-pd\"]")).text()
        vodDetail.vod_play_from = "996"
        vodDetail.vod_play_url = vodItems.join("$$$")
        return vodDetail
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
            this.vodList = await this.parseVodShortListFromDoc($)
        }
    }

    async setDetail(id) {
        let detailUrl = this.siteUrl + id
        let html = await this.fetch(detailUrl, null, this.getHeader())
        if (html != null) {
            let $ = load(html)
            this.vodDetail = await this.parseVodDetailFromDoc($)
        }
    }

    async setPlay(flag, id, flags) {
        let html = await this.fetch(id, null, this.getHeader())
        await this.jadeLog.info(html)
        if (html !== null) {
            let matcher = Utils.getStrByRegex(/player_aaaa=(.*?)<\/script>/, html)
            let player = JSON.parse(matcher);
            this.playUrl = decodeURIComponent(atob(player["url"]))
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