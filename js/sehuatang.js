/*
* @File     : sehuatang
* @Author   : jade
* @Date     : 2024/1/24 16:47
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";
import {VodShort} from "../lib/vod.js";

class SHTSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.sehuatang.net"
    }

    getAppName() {
        return "色花堂BT"
    }

    getName() {
        return "🔞|色花堂BT|🔞"
    }

    getHeader() {
        return {
            "User-Agent": "PostmanRuntime/7.36.1",
            "Host": "www.sehuatang.net",
            "Cookie": "cPNj_2132_saltkey=Q4BKEOEC; cf_clearance=6Gz2tvOXPkkJP2UhLnSsN4s0RrnDUy0jBN0kUvC5FNQ-1706109144-1-AebvwBnAURwWWQhj0QRBrRPku2n8xI73PIeuZVj2ckqY9zjQ7zFzDviX7Gkex1P1bUw9SXHGEYnkBB9nmWe6Nhk=; _safe=vqd37pjm4p5uodq339yzk6b7jdt6oich",
        }
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodShortElements = $("[id=\"portal_block_43_content\"]").find("li")
        for (const vodShortElement of vodShortElements){
            let vodShort = new VodShort()
            vodShort.vod_remarks = $($(vodShortElement).find("a")[1]).text()
            vodShort.vod_id = $(vodShortElement).find("a")[2].attribs["href"]
            vodShort.vod_name = $(vodShortElement).find("a")[2].attribs["title"]
            vodShort.vod_pic = ""
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodShortListFromDocByCategory($) {
        let vod_list = []
        let vodElements = $($("[class=\"bm_c\"]")[0]).find("tbody").slice(6)
        for (const vodElement of vodElements){
            let vodShort = new VodShort()
            vodShort.vod_id = $(vodElement).find("a")[0].attribs["href"]
            vodShort.vod_remarks = $($(vodElement).find("a")[2]).text()
            vodShort.vod_name = $($(vodElement).find("a")[3]).text()
            vodShort.vod_pic = ""
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setClasses() {
        let $ = await this.getHtml()
        let tagElements = $("[id=\"category_1\"]").find("tr").slice(0,-1)
        for (const tagElement of tagElements) {
            let classElements = $($(tagElement).find("[class=\"fl_icn_g\"]")).find("a")
            for (const classElement of classElements) {
                let type_id = classElement.attribs["href"]
                let type_name = $(classElement).find("img")[0].attribs["alt"]
                this.classes.push(this.getTypeDic(type_name, type_id))
            }
        }
    }

    async setFilterObj() {
        super.setFilterObj();
    }

    async setHomeVod() {
        let $ = await this.getHtml()
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    async setCategory(tid, pg, filter, extend) {
        let tid_list = tid.split(".")[0].split("-")
        tid_list[2] = pg
        let cateUrl = this.siteUrl +"/" + tid_list.join("-") + ".html"
        let $ = await this.getHtml(cateUrl)
        this.vodList = await this.parseVodShortListFromDocByCategory($)
    }


}

let spider = new SHTSpider()

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