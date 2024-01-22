/*
* @File     : freeok.js
* @Author   : jade
* @Date     : 2024/1/19 10:26
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 电影天堂
*/
import {_} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";


class DyttSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://dytt17.com"
    }

    getName() {
        return "👼|电影天堂|👼"
    }

    getAppName() {
        return "|电影天堂|"
    }

    async setFilterObj() {
        super.setFilterObj();
    }

    async setClasses() {
        let $ = await this.getHtml()
        let navElements = $("[class=\"swiper-slide\"]").find("a")
        for (const navElement of navElements) {
            let type_name = $(navElement).text()
            if (type_name !== "首页" && type_name !== "留言/求片") {
                let type_id = navElement.attribs["href"]
                this.classes.push({"type_name": type_name, "type_id": type_id})
            }
        }
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodShortElements = $("[class=\"public-list-box public-pic-a [swiper]\"]")
        for (const vodShortElement of vodShortElements){
            let vodShort = new VodShort()
            vodShort.vod_id = $(vodShortElement).find("a")[0].attribs["href"]
            vodShort.vod_name = $(vodShortElement).find("a")[0].attribs["title"]
            vodShort.vod_remarks = $($(vodShortElement).find("span")).text().replaceAll("","")
            vodShort.vod_pic = $(vodShortElement).find("img")[0].attribs["data-src"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setHomeVod() {
        let $ = await this.getHtml()
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }


    async detail(id) {
        let $ = await this.getHtml(this.siteUrl + id)

    }
}


let spider = new DyttSpider()

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
        proxy: proxy,
        search: search,
    };
}
