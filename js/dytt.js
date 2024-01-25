/*
* @File     : freeok.js
* @Author   : jade
* @Date     : 2024/1/19 10:26
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 电影天堂
*/
import {_, load} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";


class DyttSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.dy2018.com"

    }

    getName() {
        return "👼|电影天堂|👼"
    }

    getAppName() {
        return "|电影天堂|"
    }

    async getHtml(url = this.siteUrl, headers = this.getHeader()) {
        let buffer = await this.fetch(url,null,headers,false,false,1)
        let html = Utils.gb2312Decode(buffer,"gb2312")
        if (!_.isEmpty(html)) {
            return load(html)
        } else {
            await this.jadeLog.error(`html获取失败`, true)
        }
    }


    async setFilterObj() {

    }

    async setClasses() {
        let $ = await this.getHtml()
        let vodShortElements = $("[class=\"title_all\"]")
        for (const vodShortElement of vodShortElements){
            await this.jadeLog.debug(`${$(vodShortElement).html()}`)
            let spanElement = $(vodShortElement).find("span")[0]
            let aElement = $(vodShortElement).find("a")[0]
            let type_name= $(spanElement).text()
            let type_id = aElement.attribs["href"]
            if (type_id.indexOf("https:") === -1 && type_id.indexOf("http:") === -1){
                type_id = this.siteUrl + type_id
            }
            this.classes.push(this.getTypeDic(type_name,type_id))
        }
        let containElements = $($("[id=\"menu\"]").find("[class=\"contain\"]")).find("a").slice(0,-3)
        for (const contaElement of containElements){
            let type_name= $(contaElement).text()
            let type_id = contaElement.attribs["href"]
            if (type_id.indexOf("https:") === -1 && type_id.indexOf("http:") === -1){
                type_id = this.siteUrl + type_id
            }
            this.classes.push(this.getTypeDic(type_name,type_id))
        }
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodShortElements = $($("[class=\"co_area2\"]")[0]).find("li").slice(1)
        for (const vodShortElement of vodShortElements){
            await this.jadeLog.debug(`${$(vodShortElement).html()}`)
            let vodShort = new VodShort()
            let vodElement = $(vodShortElement).find("a")[0]
            vodShort.vod_id = vodElement.attribs["href"]
            vodShort.vod_name = vodElement.attribs["title"]
            vodShort.vod_remarks = $($(vodShortElement).find("span")).text().replaceAll("","")
            vodShort.vod_pic = ""
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setHomeVod() {
        let $ = await this.getHtml()
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    async setCategory(tid, pg, filter, extend) {

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
