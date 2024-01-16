/*
* @File     : nivod.js
* @Author   : jade
* @Date     : 2023/12/19 14:23
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {getHeader, createSign, desDecrypt, ChannelResponse} from "../lib/nivid_object.js"
import {_, Uri} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import {Spider} from "./spider.js";

class NivodSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://api.nivodz.com"

    }

    getName() {
        return "👑‍┃泥视频┃👑"
    }

    getAppName() {
        return "泥视频"
    }


    async setClasses() {
        this.Remove18ChannelCode = parseInt(this.cfgObj["code"])
        let url = this.siteUrl + "/show/channel/list/WEB/3.2" + await createSign()
        let content = desDecrypt(await this.post(url, null, getHeader()))
        if (content !== null) {
            let channelResponse = new ChannelResponse()
            channelResponse.fromJsonString(content, this.Remove18ChannelCode)
            let filterUrl = this.siteUrl + "/show/filter/condition/WEB/3.2" + await createSign()
            let filterContent = desDecrypt(await this.post(filterUrl, null, getHeader()))
            if (filterContent !== null) {
                channelResponse.setChannelFilters(filterContent)
                this.classes = channelResponse.getClassList()
                this.filterObj = channelResponse.getFilters()
            }
        }
    }


    async parseVodShortListFromJson(obj) {
        let vod_list = []
        for (const cate_dic of obj) {
            for (const row of cate_dic.rows) {
                for (const cells of row.cells) {
                    let vodShort = new VodShort()
                    vodShort.vod_id = cells.show["showIdCode"]
                    vodShort.vod_pic = cells.img
                    vodShort.vod_name = cells.title
                    vodShort.vod_remarks = this.getVodRemarks(cells.show["hot"], cells.show["playResolutions"])
                    vod_list.push(vodShort)
                }
            }
        }
        return vod_list
    }

    getVodRemarks(hot, playResolutions) {
        let vod_remarks
        if (this.catOpenStatus) {
            vod_remarks = `清晰度:${playResolutions[0]}`
        } else {
            vod_remarks = `清晰度:${playResolutions[0]},热度:${(Math.floor(parseInt(hot) / 1000)).toString()}k`
        }
        return vod_remarks
    }

    getExtendDic(extend, params) {
        if (extend["5"] === undefined) {
            delete params.year_range
        } else {
            if (extend["5"] === "0") {
                delete params.year_range
            } else {
                params.year_range = extend["5"]
            }
        }
        if (extend["1"] !== undefined) {
            params.sort_by = extend["1"]
        }
        if (extend["2"] !== undefined) {
            params.show_type_id = extend["2"]
        }
        if (extend["3"] !== undefined) {
            params.region_id = extend["3"]
        }
        if (extend["4"] !== undefined) {
            params.lang_id = extend["4"]
        }
        return params
    }

    async setHomeVod() {
        let url = this.siteUrl + "/index/mobile/WAP/3.0" + await createSign()
        let content = await this.post(url, null, getHeader())
        if (content !== null) {
            let content_json = JSON.parse(content)
            this.vodList = await this.parseVodShortListFromJson(content_json["list"])
        }
    }

    async setCategory(tid, pg, filter, extend) {
        let params = {
            "sort_by": "0",
            "channel_id": tid.toString(),
            "show_type_id": "0",
            "region_id": "0",
            "lang_id": "0",
            "year_range": "2023",
            "start": ((parseInt(pg) - 1) * 20).toString()
        }
        this.limit = 20;
        params = this.getExtendDic(extend, params)
        let url = ApiUrl + "/show/filter/WEB/3.2" + await createSign(params)
        let content = await request(url, params)
        if (content != null) {
            let content_json = JSON.parse(content)
            for (const vod_dic of content_json["list"]) {
                let vodShort = new VodShort()
                vodShort.vod_id = vod_dic["showIdCode"]
                vodShort.vod_name = vod_dic["showTitle"]
                vodShort.vod_pic = vod_dic["showImg"]
                vodShort.vod_remarks = this.getVodRemarks(vod_dic["hot"], vod_dic["playResolutions"])
                this.vodList.push(vodShort)
            }
        }
    }

}

let spider = new NivodSpider()

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