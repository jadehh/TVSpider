/*
* @File     : liangzi.js
* @Author   : jade
* @Date     : 2024/1/24 9:15
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 量子资源
*/
import {_, load} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";

class JiaFeiMaoSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://jfmys.app"

    }

    getAppName() {
        return "加菲猫"
    }

    getName() {
        return "🐈|加菲猫|🐈"
    }

    parseVodShortFromElement($, element) {
        let vodShort = new VodShort()
        vodShort.vod_id = $(element).find("a")[0].attribs.href
        vodShort.vod_name = $(element).find("a")[0].attribs.title
        vodShort.vod_pic = this.siteUrl + $(element).find("img")[0].attribs["data-src"]
        vodShort.vod_remarks = $($(element).find("[class=\"v-tips\"]")).html()
        return vodShort
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $(".icon > .container").find("[class=\"imain clearfix\"]").find("li")
        for (const vodElement of vodElements) {
            let vodShort = this.parseVodShortFromElement($, vodElement)
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodShortListFromDocByCategory($) {
        let vod_list = []
        let vodElements = $("[class=\"tv-list clearfix\"]").find("li")
        for (const vodElement of vodElements) {
            let vodShort = this.parseVodShortFromElement($, vodElement)
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail()
        let html = $.html()
        vodDetail.vod_name = $($("[class=\"iptit\"]").find("h3")).html().split(" ")[0]
        vodDetail.vod_content = $($("[class=\"idetail container\"]").find("[class=\"infor_intro\"]")).text()
        let vodPlayElements = $("[class=\"fjcon\"]")
        let vod_play_from_list = []
        let vod_play_list = []
        let playFormatElemets = $($(vodPlayElements).find("[class=\"fjtop clearfix\"]")).find("a")
        let playUrlElements = $(vodPlayElements).find("[class=\"xjn_ul play-list\"]")
        for (let i = 0; i < playFormatElemets.length; i++) {
            let playFormatElement = playFormatElemets[i]
            vod_play_from_list.push("线路" +( i+1).toString())
            let vodItems = []
            for (const playUrlElement of $(playUrlElements[i]).find("a")) {
                let episodeName = $(playUrlElement).text()
                let episodeUrl = playUrlElement.attribs.href
                vodItems.push(episodeName + "$" + episodeUrl)
            }
            vod_play_list.push(vodItems.join("#"))
        }
        vodDetail.vod_play_from = vod_play_from_list.join("$$$")
        vodDetail.vod_play_url = vod_play_list.join("$$$")
        return vodDetail
    }

    async setClasses() {
        let $ = await this.getHtml()
        let content = $($("[class=\"container\"]").find("script")).html()
        let navContent = Utils.getStrByRegex(/document.write\('(.*?);/, content)
        for (const navElement of $(navContent).find("a")) {
            let type_id = navElement.attribs["href"]
            let type_name = $(navElement).text()
            if (type_id !== "/" && type_name !== "专题" && type_name !== "站长模板") {
                this.classes.push(this.getTypeDic(type_name, Utils.getStrByRegex(/id\/(.*?).html/, type_id)))
            }
        }
    }


    async getFilter($) {
        let elements = $($("[class=\"container\"]").find("[class=\"select_list clearfix\"]")).find("li")
        let extend_list = []
        let key_value_dic = {
            "分类": /id\/(.*?).html/,
            "地区": /area\/(.*?)\//,
            "年份": /year\/(.*?).html/,
            "字母": /letter\/(.*?).html/,
            "排序": /by\/(.*?)\//,
        }
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            let name = $($($(element).find("[class=\"v-tit\"]"))).text().replaceAll("：", "")
            if (name !== "频道") {
                let extend_dic = {"key": (i + 1).toString(), "name": name, "value": []}
                for (const ele of $(element).find("a")) {
                    let type_id = Utils.getStrByRegex(key_value_dic[name], ele.attribs.href)
                    if (_.isEmpty(type_id)) {
                        type_id = "/"
                    }
                    extend_dic["value"].push({"n": $(ele).text(), "v": decodeURIComponent(type_id)})
                }
                extend_list.push(extend_dic)
            }
        }

        let sortElments = $("[class=\"v-hd clearfix\"]")
        let extend_dic = {"key": (elements.length + 1).toString(), "name": "排序", "value": []}
        extend_dic["value"].push({"n": "全部", "v": "/"})
        for (const ele of $(sortElments).find("a")) {
            let type_id = Utils.getStrByRegex(key_value_dic["排序"], ele.attribs.href)
            if (_.isEmpty(type_id)) {
                type_id = "/"
            }
            extend_dic["value"].push({"n": $(ele).text(), "v": type_id})
        }
        extend_list.push(extend_dic)

        return extend_list
    }

    async setFilterObj() {
        for (const class_dic of this.classes) {
            let type_id = class_dic["type_id"]
            if (type_id !== "最近更新") {
                let $ = await this.getHtml(this.siteUrl + `/index.php/vod/show/id/${type_id}.html`)
                this.filterObj[type_id] = await this.getFilter($)
            }
        }
    }


    async setHomeVod() {
        let $ = await this.getHtml()
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    getExtend(extend, key, value) {
        if (extend[key] !== undefined && extend[key] !== "/") {
            return value + "/" + extend[key] + "/"
        } else {
            return ""
        }
    }

    async setCategory(tid, pg, filter, extend) {
        let area = this.getExtend(extend, "3", "area")
        let sort = this.getExtend(extend, "6", "by")
        let id = this.getExtend(extend, "2", "id")
        let letter = this.getExtend(extend, "5", "letter")
        let year = this.getExtend(extend, "4", "year")
        if (_.isEmpty(id)) {
            id = "id/" + tid + "/"
        }
        let url = this.siteUrl + `/index.php/vod/show/${area}${sort}${id}${letter}${year}page/${pg}.html`
        let $ = await this.getHtml(url)
        this.vodList = await this.parseVodShortListFromDocByCategory($)
    }


    async setDetail(id) {
        let $ = await this.getHtml(this.siteUrl + id)
        this.vodDetail = await this.parseVodDetailFromDoc($)
    }

    async setPlay(flag, id, flags) {
        let $ = await this.getHtml(this.siteUrl + id)
        let html = $.html()
        let playConfig = JSON.parse( Utils.getStrByRegex(/var player_aaaa=(.*?)<\/script>/,html))
        this.playUrl = playConfig["url"]
    }

    async setSearch(wd, quick) {
        let content = await this.fetch(this.siteUrl + "/api.php/provide/vod", {
            "ac": "detail", "wd": wd, "pg": "1"
        }, this.getHeader())
        this.vodList = await this.parseVodShortListFromJson(JSON.parse(content))
    }
}

let spider = new JiaFeiMaoSpider()

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