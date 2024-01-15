/*
* @File     : ikanbot.js
* @Author   : jade
* @Date     : 2024/1/15 10:32
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {Spider} from "./spider.js";
import {load, _} from "../lib/cat.js";
import {VodShort} from "../lib/vod.js";

class IKanBot extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://v.ikanbot.com"
    }

    getName() {
        return "🤖|爱看机器人|🤖"
    }

    getAppName() {
        return "|爱看机器人|"
    }

    async parseVodShortListFromDoc($) {
        let vod_list = [];
        let VodShortElements = $($("[class=\"row list-wp\"]")).find("a")
        for (const vodShortElement of VodShortElements) {
            let vodShort = new VodShort()
            let reElement = $(vodShortElement).find("img")[0]
            vodShort.vod_id = vodShortElement.attribs["href"]
            vodShort.vod_pic = reElement.attribs["data-src"]
            vodShort.vod_name = reElement.attribs["alt"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setClasses() {
        let html = await this.fetch(this.siteUrl + "/category", null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            let navElements = $("[class=\"navbar navbar-default navbar-fixed-bottom visible-xs-block visible-sm-block\"]").find("li").find("a")

            let classElements = $($($("[class=\"row visible-xs-block visible-sm-block\"]")).find("li")).find("a")
            let classList = []
            for (const classElement of classElements) {
                classList.push($(classElement).text())
                this.classes.push({"type_name": $(classElement).text(), "type_id": classElement.attribs["href"]})
            }


            for (const navElement of navElements) {
                let type_name = $(navElement).text().replaceAll("\n", "")

                if (type_name !== "首页" && type_name !== "看过" && type_name !== "分类") {
                    if (classList.indexOf(type_name) > -1) {
                        this.classes[classList.indexOf(type_name) + 1]["type_id"] = this.classes[classList.indexOf(type_name) + 1]["type_id"] + "," + navElement.attribs["href"]
                    } else {
                        this.classes.push({"type_name": type_name, "type_id": navElement.attribs["href"]})
                    }
                }
            }


        }

    }

    async setFilterObj() {
        for (const class_dic of this.classes.slice(1,-1)) {
            let type_id = class_dic["type_id"]
            if (type_id.indexOf("category") === -1 || type_id.indexOf(",") > -1) {
                let type_url = type_id.split(",").slice(-1)[0]
                let html = await this.fetch(this.siteUrl + type_url, null, this.getHeader())
                if (!_.isEmpty(html)) {
                    let $ = load(html)
                    let filterElements = $("[class=\"row visible-xs-block visible-sm-block\"]").find("[class=\"nav nav-pills\"]").find("a")
                    let value_list = []
                    if (type_id.indexOf(",") > -1) {
                        value_list.push({"n": "全部", "v": type_id.split(",")[0]})

                    }
                    for (const filterElement of filterElements) {
                        value_list.push({"n": $(filterElement).text(), "v": filterElement.attribs["href"]})
                    }
                    this.filterObj[type_id] = value_list
                }
            }

        }
    }

    async setHome(filter) {
        await this.setClasses()
        await this.setFilterObj()
        let html = await this.fetch(this.siteUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.homeVodList = await this.parseVodShortListFromDoc($)
        }
    }


    async setCategory(tid, pg, filter, extend) {
        let categoryUrl = this.siteUrl + tid
        let html = this.fetch(categoryUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodList = this.parseVodShortListFromDoc($)
        }
    }
}


let spider = new IKanBot()

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
        init: init, home: home, homeVod: homeVod, category: category, detail: detail, play: play, search: search,
    };
}
