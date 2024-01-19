/*
* @File     : freeok.js
* @Author   : jade
* @Date     : 2024/1/19 10:26
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : OK资源网
*/
import {Spider} from "./spider.js";
import {load, _} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";

class OkSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.freeok.vip/"
    }

    getName() {
        return "🆗|OK资源网|🆗"
    }

    getAppName() {
        return "|OK资源网|"
    }

    async init(cfg) {
        await super.init(cfg);
        this.jsBase = await js2Proxy(true, this.siteType, this.siteKey, 'img/', {});
    }

    async parseVodShortListFromDoc($) {
        let vod_list = [];
        let VodShortElements = $($("[class=\"row list-wp\"]")).find("a")
        for (const vodShortElement of VodShortElements) {
            let vodShort = new VodShort()
            let reElement = $(vodShortElement).find("img")[0]
            vodShort.vod_id = vodShortElement.attribs["href"]
            vodShort.vod_pic = this.jsBase + Utils.base64Encode(reElement.attribs["data-src"])
            vodShort.vod_name = reElement.attribs["alt"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        const detail = $('div.detail > .meta');
        let vodDetail = new VodDetail();
        vodDetail.vod_pic = this.jsBase + Utils.base64Encode($('div.item-root > img')[0].attribs['data-src'])
        vodDetail.vod_name = detail[0].children[0].data;
        vodDetail.vod_year = detail[2].children[0].data;
        vodDetail.vod_area = detail[3].children[0].data;
        vodDetail.vod_actor = detail[4].children[0].data;

        let id = Utils.getStrByRegex(/<input type="hidden" id="current_id" value="(.*?)"/, $.html())
        let token = Utils.getStrByRegex(/<input type="hidden" id="e_token" value="(.*?)"/, $.html())
        let mtype = Utils.getStrByRegex(/<input type="hidden" id="mtype" value="(.*?)"/, $.html())
        let params = {
            "videoId": id, "mtype": mtype, "token": get_tks(id, token),
        }
        let content = await this.fetch(this.siteUrl + '/api/getResN', params, this.getHeader())

        const list = JSON.parse(content)["data"]["list"];
        let playlist = {};

        let index = 0
        let form_list = []
        for (const l of list) {
            const flagData = JSON.parse(l["resData"]);
            for (const f of flagData) {
                index = index + 1
                const from = f.flag;
                const urls = f.url;
                if (!from || !urls) continue;
                if (playlist[from]) continue;
                form_list.push(`线路${index}`)
                playlist[from] = urls;
            }
        }
        vodDetail.vod_play_from = form_list.join('$$$');
        vodDetail.vod_play_url = _.values(playlist).join('$$$');
        return vodDetail
    }

    async parseVodShortListFromDocBySearch($) {
        let vod_list = []
        const items = $('div.media > div.media-left > a');
        for (const item of items) {
            let vodShort = new VodShort();
            const img = $(item).find('img:first')[0];
            vodShort.vod_id = item.attribs.href
            vodShort.vod_name = img.attribs.alt
            vodShort.vod_pic = this.jsBase + Utils.base64Encode(img.attribs['data-src'])
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setClasses() {
        let html = await this.fetch(this.siteUrl + "/category", null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            let navElements = $("[class=\"navbar navbar-default navbar-fixed-bottom visible-xs-block visible-sm-block\"]").find("li").find("a")

            let classElements = $($($("[class=\"row visible-xs-block visible-sm-block\"]")).find("li")).find("a")
            let classList = []
            for (const classElement of classElements) {
                classList.push($(classElement).text())
                this.classes.push({"type_name": $(classElement).text(), "type_id": classElement.attribs["href"]})
            }


            for (const navElement of navElements) {
                let type_name = $(navElement).text().replaceAll("\n", "")

                if (type_name !== "首页" && type_name !== "看过" && type_name !== "分类") {
                    if (classList.indexOf(type_name) > -1) {
                        this.classes[classList.indexOf(type_name) + 1]["type_id"] = this.classes[classList.indexOf(type_name) + 1]["type_id"] + "," + navElement.attribs["href"]
                    } else {
                        this.classes.push({"type_name": type_name, "type_id": navElement.attribs["href"]})
                    }
                }
            }


        }

    }

    async setFilterObj() {
        for (const class_dic of this.classes.slice(1, 9)) {
            let type_id = class_dic["type_id"]
            if (type_id.indexOf("category") === -1 || type_id.indexOf(",") > -1) {
                let type_url = type_id.split(",").slice(-1)[0]
                let html = await this.fetch(this.siteUrl + type_url, null, this.getHeader())
                if (!_.isEmpty(html)) {
                    let $ = load(html)
                    let containerElement = $("[class=\"row visible-xs-block visible-sm-block\"]")
                    let filterElements = containerElement.find("[class=\"nav nav-pills\"]").find("a")
                    let value_list = []
                    if (type_id.indexOf(",") > -1) {
                        value_list.push({"n": "全部", "v": type_id.split(",")[0]})

                    }
                    let extend_dic = {
                        "key": type_id, "name": $(containerElement.find("h5")).text(), "value": value_list
                    }
                    for (const filterElement of filterElements) {
                        value_list.push({"n": $(filterElement).text(), "v": filterElement.attribs["href"]})
                    }
                    if (value_list.length > 0) {
                        this.filterObj[type_id] = [extend_dic]
                    }

                }
            }

        }
    }

    async setHomeVod() {
        let html = await this.fetch(this.siteUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.homeVodList = await this.parseVodShortListFromDoc($)
        }
    }

    async setCategory(tid, pg, filter, extend) {
        let categoryUrl = (this.siteUrl + (extend[tid] || tid.split(",")[0]))
        let update_page = false
        if (categoryUrl.indexOf("html") > -1) {
            categoryUrl = categoryUrl.replace('.html', pg > 1 ? `-p-${pg}.html` : '.html');
        } else {
            categoryUrl = categoryUrl + `?p=${pg}`
            update_page = true

        }
        await this.jadeLog.debug(`分类URL:${categoryUrl}`)
        let html = await this.fetch(categoryUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDoc($)
            let pageDoc = $('div.page-more > a:contains(下一页)')
            if (update_page) {
                this.page = parseInt(pageDoc[0].attribs["href"].split("p=")[1])
            }
            const hasMore = pageDoc.length > 0;
            this.limit = 24
            this.count = hasMore ? parseInt(pg) + 1 : parseInt(pg);
            this.total = this.limit * this.count

        }
    }

    async setDetail(id) {
        let html = await this.fetch(this.siteUrl + id, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html);
            this.vodDetail = await this.parseVodDetailFromDoc($)
        }
    }


    async setSearch(wd, quick) {
        const html = await this.fetch(this.siteUrl + '/search?q=' + wd, null, this.getHeader());
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDocBySearch($)
        }

    }

    async setPlay(flag, id, flags) {
        this.playUrl = id
    }



}


let spider = new IKanBotSpider()

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
