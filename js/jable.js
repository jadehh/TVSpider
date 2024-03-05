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
        let navElements = $("[class=\"title-box\"]").slice(0,8)
        let defaultTypeIdElements = $("div.row").slice(0,8)
        for (let i = 0; i < navElements.length; i++) {
            let typeName = $(navElements[i]).text().replaceAll("\n","")
            let typeId = $(defaultTypeIdElements[i]).find("a")[0].attribs["href"]
            this.classes.push(this.getTypeDic(typeName,typeId));
        }
    }

    async setFilterObj() {
        let $ = await this.getHtml(this.siteUrl)
        let navElements = $("[class=\"row gutter-20 pb-5\"]").find("div.col-6 > a")
        for (const element of navElements) {
            let typeId = element.attribs.href
            let typeName = $(element).text()
            if (typeId.indexOf(this.siteUrl) > -1){
               this.classes.push(this.getTypeDic(typeName,typeId));
            }
        }
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements =  $("[class=\"video-img-box mb-e-20\"]")
        for (const element of vodElements) {
            let vodShort = new VodShort();
            let picElement = $(element).find("img")
            if (picElement.length > 0) {
                vodShort.vod_pic = $(element).find("img")[0].attribs["data-src"];
                vodShort.vod_remarks = $($(element).find("div")[1]).text()
                let url = $(element).find("a")[0].attribs["href"];
                vodShort.vod_name = url.split("/")[4]
                vodShort.vod_id = url.split("/")[4];
                vodShort.vod_remarks = $($(element).find("[class=\"sub-title\"]")).text().split("\n")[1].replaceAll(" ","")
                vod_list.push(vodShort)
            }
        }
        return vod_list
    }

    async parseVodShortListFromDocByCategory($) {
        let vod_list = []
        let vodElements = $("div.video-img-box")
        for (const element of vodElements ) {
            let vodShort = new VodShort()
            vodShort.vod_pic  = $(element).find("img").attr("data-src");
            let url = $(element).find("a").attr("href");
            vodShort.vod_id= url.split("/")[4];
            vodShort.vod_name = url.split("/")[4];
            vodShort.vod_remarks = $($(element).find("[class=\"sub-title\"]")).text().split("\n")[1].replaceAll(" ","").replaceAll("\t","")
            vod_list.push(vodShort);
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail();
        let leftElement = $("[class=\"header-left\"]")
        vodDetail.vod_name = $($(leftElement).find("h4")).text();
        vodDetail.vod_pic = Utils.getStrByRegex(/<video poster="(.*?)" id=/,$.html())
        vodDetail.vod_year = $($("[class=\"inactive-color\"]")).text()
        let episodeName = Utils.getStrByRegex(/<span class="text-danger fs-1 mr-2"(.*?)\n/,$.html()).replaceAll(">","").replaceAll("</span","")
        let vodItems = []
        let episodeUrl = Utils.getStrByRegex(/var hlsUrl = '(.*?)';/,$.html())
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