/*
* @File     : doll.js
* @Author   : jade
* @Date     : 2024/1/4 14:15
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : doll
*/

import {Spider} from "./spider.js";
import {Crypto, load} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";

class Doll extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://hongkongdollvideo.com/"
    }

    getAppName() {
        return "🍥┃玩偶姐姐┃🍥"
    }

    getName() {
        return "玩偶姐姐"
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $("[class=\"row\"]").find("[class=\"video-detail\"]")
        for (const vodElement of vodElements) {
            let resource = $(vodElement).find("a")[0]
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
            let navElements = $("[class=\"list-unstyled topnav-menu d-flex d-lg-block align-items-center justify-content-center flex-fill topnav-menu-left m-0\"]").find("li")
            let index = 1
            for (const navElement of navElements) {
                let type_list = $(navElement).text().split("\n")
                let valueElements = $(navElement).find("a")
                let valueList = []
                let type_id = index.toString()
                for (const valueElement of valueElements) {
                    let title = $(valueElement).text().replaceAll("\n", "")
                    let href = valueElement.attribs["href"]
                    if (href !== undefined) {
                        valueList.push({"n": title, "v": href})
                    }
                }
                type_list = type_list.filter(element => element !== "");
                let type_dic = {
                    "type_name": type_list[0],
                    "type_id": type_id
                }
                this.filterObj[type_id] = []
                let new_value_list = []
                for (let i = 0; i < valueList.length; i++) {
                    new_value_list.push(valueList[i])
                    if (i % 8 === 0 && i !== 0) {
                        this.filterObj[type_id].push({"key": type_id, "name": type_list[0], "value": new_value_list})
                        new_value_list = []
                    }
                }
                this.filterObj[type_id].push({"key": type_id, "name": type_list[0], "value": new_value_list})
                index = index + 1
                this.classes.push(type_dic)

            }

            let menuElements = $("[id=\"side-menu\"]").find("li")
            for (const menuElement of menuElements) {
                let type_id = $(menuElement).find("a")[0].attribs["href"]
                if (type_id !== undefined) {
                    let type_dic = {
                        "type_name": $(menuElement).text(),
                        "type_id": type_id
                    }
                    this.classes.push(type_dic)
                }
            }
        }

    }

    async setHome(filter) {
        await this.setClasses()
        let x = 0
    }

    async setCategory(tid, pg, filter, extend) {
        let cateUrl = ""
        if (tid.indexOf(this.siteUrl) > -1) {
            cateUrl = tid
        } else {
            cateUrl = this.siteUrl
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
        if (html !== null) {
            let matcher = Utils.getStrByRegex(/player_aaaa=(.*?)<\/script>/, html)
            let player = JSON.parse(matcher);
            try {
                this.playUrl = decodeURIComponent(Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(player["url"])))
            } catch (e) {
                await this.jadeLog.error(e)
            }
        }
    }
}

let spider = new Doll()

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