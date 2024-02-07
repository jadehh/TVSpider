/*
* @File     : haoxi.js
* @Author   : jade
* @Date     : 2024/2/7 14:24
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {_, load} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";

class HaoXiSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://haoxi.vip"
    }

    getAppName() {
        return "好戏追剧"
    }

    getName() {
        return "🌿|好戏追剧|🌿"
    }

    parseVodShortFromElement($, element) {
        let vodShort = new VodShort();
        vodShort.vod_id = $(element).find("a")[0].attribs.href
        vodShort.vod_name = $(element).find("a")[0].attribs.title
        vodShort.vod_pic = $(element).find("img")[0].attribs["data-src"]
        vodShort.vod_remarks = $($(element).find("[class=\"public-list-prb hide ft2\"]")).html()
        return vodShort
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $("[class=\"flex bottom4\"]").find("[class=\"public-list-box public-pic-a [swiper]\"]")
        for (const vodElement of vodElements) {
            let vodShort = this.parseVodShortFromElement($,vodElement)
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodShortListFromDocByCategory($) {
        let vod_list = []
        let vodElements = $("[class=\"public-list-box public-pic-b [swiper]\"]")
        for (const vodElement of vodElements){
            let vodShort = this.parseVodShortFromElement($,vodElement)
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setClasses() {
        let $ = await this.getHtml()
        let navElements = $("[class=\"head flex between no-null header_nav0\"]").find("li")
        for (const navElement of navElements) {
            let type_name = $($(navElement).find("a")).text()
            let type_id = Utils.getStrByRegex(/\/vodtype\/(.*?)\//, $(navElement).find("a")[0].attribs.href)
            if (Utils.isNumeric(type_id)) {
                this.classes.push(this.getTypeDic(type_name, type_id))
            }
        }
    }

    async getFilter($) {
        let elements = $("[class=\"nav-swiper rel\"]")
        let extend_list = []
        for (let i = 0; i < elements.length; i++) {
            let extend_dic = {"key": (i + 1).toString(), "name": "", "value": []}
            let name = $($($(elements[i]).find("[class=\"filter-text bj cor5\"]")[0]).find("span")).html()
            if (name !== "已选" && name !== "频道") {
                extend_dic["name"] = name
                for (const ele of $(elements[i]).find("li")) {
                    extend_dic["value"].push({"n": $(ele).text(), "v": $(ele).text()})
                }
                extend_list.push(extend_dic)
            }
        }
        let sortElments = $("[class=\"site-tabs b-b br\"]")
        let extend_dic = {"key": (elements.length + 1).toString(), "name": "排序", "value": []}
        extend_dic["value"].push({"n": "全部", "v": "/"})
        for (const ele of $(sortElments).find("a")) {
            let type_id_list = ele.attribs.href.split("-")
            extend_dic["value"].push({"n": $(ele).text(), "v": type_id_list[2]})
        }
        extend_list.push(extend_dic)

        return extend_list
    }


    async setFilterObj() {
        for (const class_dic of this.classes) {
            let type_id = class_dic["type_id"]
            if (Utils.isNumeric(type_id)) {
                let url = this.siteUrl + `/vodshow/${type_id}-----------`
                let $ = await this.getHtml(url)
                this.filterObj[type_id] = await this.getFilter($)
            }
        }
    }

    async setHomeVod() {
        let $ = await this.getHtml()
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    get_extend_sort_dic(tid) {
        /***
         tid为1,2,3的时候,电影,剧情,动漫
         urlParams#0表示类别,1表示全部地区,2表示人气评分,3表示全部剧情,4表示全部语言,5表示字母查找,6表示页数,11表示时间
         #key为1,代表全部剧情
         #key为2,代表全部地区
         #key为3,代表全部语言
         #key为4,代表全部时间
         #key为5,字幕查找
         #key为6,时间排序
         https://www.wogg.xyz/index.php/vodshow/1-全部地区-时间排序-全部剧情-全部语言-字幕查找------全部时间.html

         tid为4,综艺
         #key为1,代表全部地区
         #key为2,代表全部时间
         #key为3,字幕查找
         #key为4,时间排序
         https://tvfan.xxooo.cf/index.php/vodshow/4-全部地区-时间排序---字母查找------全部时间.html

         tid为5:音乐
         #key为1,字幕查找
         #key为2,时间排序
         https://tvfan.xxooo.cf/index.php/vodshow/5--时间排序---字幕查找------.html

         tid为6,短剧
         #key为1,代表全部剧情
         #key为2,代表全部地区
         #key为3,代表全部时间
         #key为4,字幕查找
         #key为5,时间排序
         https://tvfan.xxooo.cf/index.php/vodshow/6-全部地区-时间排序-全部剧情--字母查找------全部时间.html
         */
        let extend_dic = {}
        if (tid < 4) {
            extend_dic = {
                "1": 3, "2": 1, "3": 4, "4": 11, "5": 5, "6": 2
            }
        } else if (tid === 4) {
            extend_dic = {
                "1": 1, "2": 11, "3": 5, "4": 2,
            }
        } else if (tid === 6) {
            extend_dic = {
                "1": 3, "2": 1, "3": 11, "4": 5, "5": 2,
            }
        } else if (tid === 5) {
            extend_dic = {
                "1": 5, "2": 2,
            }
        }

        return extend_dic
    }

    async setCategory(tid, pg, filter, extend) {
        // https://haoxi.vip/vodshow/2-大陆-hits-Netflix-国语-A----正片--2023/
        let urlParams = [tid.toString(), "", "", "", "", "", "", "", pg.toString(), "", "", ""]
        let extend_dic = this.get_extend_sort_dic(parseInt(tid))
        for (const key of Object.keys(extend_dic)) {
            if (extend[key] === "0") {
                urlParams[extend_dic[key]] = ""
            } else {
                urlParams[extend_dic[key]] = extend[key]
            }
        }
        let reqUrl = this.siteUrl + '/vodshow/' + urlParams.join("-");
        await this.jadeLog.debug(`分类URL:${reqUrl}`)
        let $ = await this.getHtml(reqUrl)
        this.vodList = await this.parseVodShortListFromDocByCategory($)
    }

}

let spider = new HaoXiSpider()

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