/*
* @File     : ikanbot.js
* @Author   : jade
* @Date     : 2024/1/15 10:32
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {Spider} from "./spider.js";
import {load,_} from "../lib/cat.js";
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
        for (const vodShortElement of VodShortElements){
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
        let html = await this.fetch(this.siteUrl + "/category",null,this.getHeader())
        if (!_.isEmpty(html)){
            let $ = load(html)
            let navElements = $($($("[class=\"row visible-xs-block visible-sm-block\"]")).find("li")).find("a")
            for (const navElement of navElements){
                this.classes.push({"type_name": $(navElement).text(), "type_id": navElement.attribs["href"]})
            }

        }

    }

    async setFilterObj() {
        super.setFilterObj();
    }

    async setHome(filter) {
        await this.setClasses()
        await this.setFilterObj()
        let html = await this.fetch(this.siteUrl,null,this.getHeader())
        if (!_.isEmpty(html)){
            let $ = load(html)
            this.homeVodList = this.parseVodShortListFromDoc($)
        }
    }

    async setHomeVod() {
        super.setHomeVod();
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
