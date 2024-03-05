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
        let $ = await this.getHtml(this.siteUrl + "/categories/")
        for (const element of $("div.img-box > a")) {
            let typeId = element.attribs.href.split("/")[4];
            let typeName = $(element).find("div.absolute-center > h4").text();
            this.classes.push(this.getTypeDic(typeId, typeName));
        }
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        for (const element of $("div.video-img-box")) {
            let vodShort = new VodShort();
            let picElement = $(element).find("img")
            if (picElement.length > 0) {
                vodShort.vod_pic = $(element).find("img")[0].attribs["data-src"];
                vodShort.vod_remarks = $($(element).find("div")[1]).text()
                let url = $(element).find("a")[0].attribs["href"];
                vodShort.vod_name = $($(element).find("div.detail > h6")).text()

                if (vodShort.vod_pic.endsWith(".gif") || _.isEmpty(vodShort.vod_name)) continue;
                vodShort.vod_id = url.split("/")[4];
                vod_list.push(vodShort)
            }
        }
        return vod_list
    }

    async setHomeVod() {
        let $ = await this.getHtml(this.siteUrl)
        this.homeVodList = await this.parseVodShortListFromDoc($)
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