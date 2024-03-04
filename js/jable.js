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
         return {"User-Agent": "PostmanRuntime/7.29.0","Referer":this.siteUrl};
    }

    async setClasses() {
        let $ = await this.getHtml(this.siteUrl + "/categories/")
        for (const element of $("div.img-box > a")) {
            let  typeId = element.attribs.href.split("/")[4];
            let  typeName = $(element).find("div.absolute-center > h4").text();
            this.classes.push(this.getTypeDic(typeId, typeName));
        }
        let x = 0
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