/*
* @File     : jable.js
* @Author   : jade
* @Date     : 2024/3/4 9:44
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {_, load} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";

class JableTVSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://jable.tv"
        this.cookie = ""

    }
    getAppName() {
        return "Jable"
    }

    getName() {
        return "🐈|Jable|🐈"
    }
    getHeader() {
        // let header = super.getHeader()
        let header = {}
        header["User-Agent"] = "PostmanRuntime/7.36.3"
        header["Host"] = "jable.tv"
        // header["Postman-Token"] = "33290483-3c8d-413f-a160-0d3aea9e6f95"
        return header
    }

    async setClasses() {
        let $ = await this.getHtml(this.siteUrl)
        let navElements = $("[class=\"title-box\"]")
        let defaultTypeIdElements = $("div.row")
        for (const navElement of $(defaultTypeIdElements[0]).find("a")) {
            let type_name = $(navElement).text()
            let type_id = navElement.attribs.href
            if (type_id.indexOf(this.siteUrl) > -1) {
                this.classes.push(this.getTypeDic(type_name, type_id))
            }
        }
        navElements = navElements.slice(1, 8)
        defaultTypeIdElements = defaultTypeIdElements.slice(1, 8)
        for (let i = 0; i < navElements.length; i++) {
            let typeName = $(navElements[i]).text().replaceAll("\n", "")
            let typeId = $(defaultTypeIdElements[i]).find("a")[0].attribs["href"]
            this.classes.push(this.getTypeDic(typeName, typeId));
        }
        let x = 0
    }

    async getFilter($, index, type_id,type_name) {
        let extend_list = []
        let extend_dic = {"name": type_name,"key":type_name, "value": []}
        let defaultTypeIdElements = $("div.row").slice(0, 8)[index]
        let type_seletc_list = ["div.img-box > a","[class=\"horizontal-img-box ml-3 mb-3\"] > a","","sort"]
        let type_id_select_list = ["div.absolute-center > h4","div.detail>h6"]
        if (index < 4) {
            let default$ = await this.getHtml(type_id)
            for (const element of default$(type_seletc_list[index])) {
                let typeId = element.attribs["href"]
                let typeName = $($(element).find(type_id_select_list[index])).text();
                extend_dic["value"].push({"n": typeName, "v": typeId})
            }
            if (extend_dic.value.length > 0){
                extend_list.push(extend_dic)
            }
        } else {
            let filterElements = $(defaultTypeIdElements).find("a")
            for (const filterElement of filterElements) {
                let filter_type_id = filterElement.attribs.href
                if (filter_type_id.indexOf(this.siteUrl) > -1) {
                    extend_dic["value"].push({"n": $(filterElement).text(), "v": filter_type_id})
                }
            }
            extend_list.push(extend_dic)
        }
        return extend_list
    }

    async setFilterObj() {
        let $ = await this.getHtml(this.siteUrl)
        let classes = this.classes.slice(1, -1)
        for (let i = 0; i < classes.length; i++) {
            let type_name =classes[i].type_name
            let type_id = classes[i].type_id
            this.filterObj[type_id] = await this.getFilter($, i, type_id,type_name)
        }
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $("[class=\"video-img-box mb-e-20\"]")
        for (const element of vodElements) {
            let vodShort = new VodShort();
            let picElement = $(element).find("img")
            if (picElement.length > 0) {
                vodShort.vod_pic = $(element).find("img")[0].attribs["data-src"];
                vodShort.vod_remarks = $($(element).find("div")[1]).text()
                let url = $(element).find("a")[0].attribs["href"];
                vodShort.vod_name = url.split("/")[4]
                vodShort.vod_id = url.split("/")[4];
                vodShort.vod_remarks = $($(element).find("[class=\"sub-title\"]")).text().split("\n")[1].replaceAll(" ", "")
                vod_list.push(vodShort)
            }
        }
        return vod_list
    }

    async parseVodShortListFromDocByCategory($) {
        let vod_list = []
        let vodElements = $("div.video-img-box")
        for (const element of vodElements) {
            let vodShort = new VodShort()
            vodShort.vod_pic = $(element).find("img").attr("data-src");
            let url = $(element).find("a").attr("href");
            vodShort.vod_id = url.split("/")[4];
            vodShort.vod_name = url.split("/")[4];
            vodShort.vod_remarks = $($(element).find("[class=\"sub-title\"]")).text().split("\n")[1].replaceAll(" ", "").replaceAll("\t", "")
            vod_list.push(vodShort);
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail();
        let leftElement = $("[class=\"header-left\"]")
        vodDetail.vod_name = $($(leftElement).find("h4")).text();
        vodDetail.vod_pic = Utils.getStrByRegex(/<video poster="(.*?)" id=/, $.html())
        vodDetail.vod_year = $($("[class=\"inactive-color\"]")).text()
        let episodeName = Utils.getStrByRegex(/<span class="text-danger fs-1 mr-2"(.*?)\n/, $.html()).replaceAll(">", "").replaceAll("</span", "")
        let vodItems = []
        let episodeUrl = Utils.getStrByRegex(/var hlsUrl = '(.*?)';/, $.html())
        vodItems.push(episodeName + "$" + episodeUrl)
        let vod_play_list = []
        vod_play_list.push(vodItems.join("#"))
        let vod_play_from_list = ["Jable"]
        vodDetail.vod_play_from = vod_play_from_list.join("$$$")
        vodDetail.vod_play_url = vod_play_list.join("$$$")
        return vodDetail
    }

    async setHomeVod() {
        let $ = await this.getHtml(this.siteUrl)
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    async setDetail(id) {
        let $ = await this.getHtml(this.siteUrl + "/videos/" + id + "/")
        this.vodDetail = await this.parseVodDetailFromDoc($)
    }

    async setCategory(tid, pg, filter, extend) {
        let extend_type = extend["a"] ?? "video_viewed"
        let cateUrl = this.siteUrl + `/categories/bdsm/${pg}/?mode=async&function=get_block&block_id=list_videos_common_videos_list&sort_by=${extend_type}&_=${new Date().getTime()}`
        let $ = await this.getHtml(cateUrl);
        this.vodList = await this.parseVodShortListFromDocByCategory($)
    }

    async setSearch(wd, quick) {
        let searchUrl = this.siteUrl + `/search/${wd}/`
        let $ = await this.getHtml(searchUrl)
        this.vodList = await this.parseVodShortListFromDocByCategory($)
    }
}

let spider = new JableTVSpider()

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