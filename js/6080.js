/*
* @File     : 6080.js
* @Author   : jade
* @Date     : 2024/2/20 14:14
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 新视觉影院
*/
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";
import {_, load} from "../lib/cat.js";

class NewVisionSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.6080yy3.com"
    }

    getAppName() {
        return "新视觉影院"
    }

    getName() {
        return "🐼|新视觉影院|🐼"
    }

    async setClasses() {
        let $ = await this.getHtml()
        let navElements = $($("[class=\"nav-menu-items\"]")[0]).find("a")
        for (const navElement of navElements) {
            let type_id = Utils.getStrByRegex(/\/vodtype\/(.*?).html/, navElement.attribs.href)
            let type_name = navElement.attribs.title
            if (Utils.isNumeric(type_id)) {
                this.classes.push(this.getTypeDic(type_name, type_id))
            }
        }
    }

    async getFilter($) {
        let elements = $("[class='scroll-content']").slice(1)
        let extend_list = []
        let type_key_list = [3, 1, 11, 2]
        for (let i = 0; i < elements.length; i++) {
            let name = $($(elements[i]).find("a")[0]).text()
            let extend_dic = {"key": name, "name": name, "value": []}
            extend_dic["name"] = name
            extend_dic["value"].push({"n": "全部", "v": "0"})
            for (const ele of $(elements[i]).find("a").slice(1)) {
                let type_id_list = Utils.getStrByRegex(/\/vodshow\/(.*?).html/, ele.attribs.href).split("-")
                extend_dic["value"].push({
                    "n": $(ele).text(), "v": decodeURIComponent(type_id_list[type_key_list[i]])
                })
            }
            extend_list.push(extend_dic)
        }
        return extend_list
    }

    async setFilterObj() {
        for (const type_dic of this.classes) {
            let type_id = type_dic["type_id"]
            if (type_id !== "最近更新") {
                let url = this.siteUrl + `/vodshow/${type_id}-----------.html`
                let $ = await this.getHtml(url)
                this.filterObj[type_id] = await this.getFilter($)
            }
        }
    }

    async parseVodShortListFromDoc($) {
        let items = $('.module-item');
        let vod_list = [];
        for (const item of items) {
            let vodShort = new VodShort()
            let oneA = $(item).find('.module-item-cover .module-item-pic a').first();
            vodShort.vod_id = oneA.attr('href');
            vodShort.vod_name = oneA.attr('title');
            vodShort.vod_pic = $(item).find('.module-item-cover .module-item-pic img').first().attr('data-src');
            if (vodShort.vod_pic.indexOf("img.php?url=") > 0) {
                vodShort.vod_pic = vodShort.vod_pic.split("img.php?url=")[1]
            }
            vodShort.vod_remarks = $(item).find('.module-item-text').first().text();
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setHomeVod() {
        let $ = await this.getHtml()
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    async setCategory(tid, pg, filter, extend) {
        let urlParams = [tid.toString(), "", "", "", "", "", "", "", pg.toString(), "", "", ""]
        let type_key_list = [3, 11, 1, 2]
        if (extend["全部剧情"] !== undefined && extend["全部剧情"] !== "0") {
            urlParams[type_key_list[0]] = extend["全部剧情"]
        }
        if (extend["全部时间"] !== undefined && extend["全部时间"] !== "0") {
            urlParams[type_key_list[1]] = extend["全部时间"]
        }
        if (extend["全部地区"] !== undefined && extend["全部地区"] !== "0") {
            urlParams[type_key_list[2]] = extend["全部地区"]
        }
        if (extend["时间排序"] !== undefined && extend["时间排序"] !== "0") {
            urlParams[type_key_list[3]] = extend["时间排序"]
        }
        let reqUrl = this.siteUrl + '/index.php/vodshow/' + urlParams.join("-") + '.html';
        let $ = await this.getHtml(reqUrl)
        this.vodList = await this.parseVodShortListFromDoc($)
    }
}

let spider = new NewVisionSpider()

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