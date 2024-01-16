/*
 * @Author: samples jadehh@live.com
 * @Date: 2023-12-14 11:03:04
 * @LastEditors: samples jadehh@live.com
 * @LastEditTime: 2023-12-14 11:03:04
 * @FilePath: js/aiyingshi.js
 * @Description: 爱影视爬虫类
 */
import {_, load} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";

let patternAli = /(https:\/\/www\.aliyundrive\.com\/s\/[^"]+|https:\/\/www\.alipan\.com\/s\/[^"]+)/

class AiYingShiSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = 'https://aiyingshis.com';
    }

    getName() {
        return "🚀‍┃爱影视┃🚀"
    }

    getAppName() {
        return "爱影视"
    }

    async parseVodShortListFromDoc($) {
        let items = $('.module-item');
        let vod_list = [];
        for (const item of items) {
            let vodShort = new VodShort()
            let oneA = $(item).find('.module-item-cover .module-item-pic a').first();
            vodShort.vod_id = oneA.attr('href');
            vodShort.vod_name = oneA.attr('title');
            vodShort.vod_pic = $(item).find('.module-item-cover .module-item-pic img').first().attr('data-src');
            if (vodShort.vod_pic.indexOf("img.php?url=") > 0) {
                vodShort.vod_pic = vodShort.vod_pic.split("img.php?url=")[1]
            }
            vodShort.vod_remarks = $(item).find('.module-item-text').first().text();
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail()
        vodDetail.vod_name = $('.page-title')[0].children[0].data
        vodDetail.vod_pic = $($("[class=\"video-cover\"]")).find(".lazyload")[0].attribs["data-src"]
        let video_info_list = $($(".video-info-aux")).text().replaceAll("\t","").split("\n")
        let type_list = []
        for (const video_info of video_info_list){
            if (!_.isEmpty(video_info.replaceAll(" ","").replaceAll("/",""))){
                type_list.push(video_info.replaceAll(" ","").replaceAll("/",""))
            }
        }
        vodDetail.type_name = type_list.slice(0,2).join("*")
        let video_items = $("[class=\"video-info-items\"]")
        vodDetail.vod_director = $(video_items[0]).find("a")[0].children[0].data
        let vidoe_info_actor_list = $(video_items[1]).find("a")
        let actor_list = []
        for (const vidoe_info_actor of vidoe_info_actor_list) {
            actor_list.push(vidoe_info_actor.children[0].data)
        }
        vodDetail.vod_actor = actor_list.join(" * ")
        vodDetail.vod_year = type_list[2]
        vodDetail.vod_remarks = $($(video_items[3]).find(".video-info-item")).text()
        vodDetail.vod_content = $($(video_items[5]).find(".video-info-item")).text()
        vodDetail.vod_area = type_list[3]
        vodDetail.vod_content = vodDetail.vod_content.replace("[收起部分]", "").replace("[展开全部]", "").replaceAll("\t","").replaceAll("\n","")

        let playElements = $($("[class=\"module-tab-content\"]")[0]).find("span")
        let urlElements = $("[class=\"module-list module-player-list tab-list sort-list \"]")
        let form_list = []
        for (const playerElement of playElements){
            form_list.push($(playerElement).text())
        }
        let play_url_list = []
        for (const urlElement of urlElements){
            let playUrlElements = $($(urlElement).find("[class=\"sort-item\"]")).find("a")
            let vodItems = []
            for (const playUrlElement of playUrlElements){
                let name = $(playUrlElement).text()
                let url = playUrlElement.attribs["href"]
                let play_url = name + "$" + url
                vodItems.push(play_url)
            }
            play_url_list.push(vodItems.join("#"))
        }
        vodDetail.vod_play_from = form_list.join('$$$');
        vodDetail.vod_play_url = _.values(play_url_list).join('$$$');
        return vodDetail
    }

    async parseVodShortListFromDocBySearch($) {
        let items = $('.module-search-item');
        let vod_list = [];
        for (const item of items) {
            let vodShort = new VodShort()
            vodShort.vod_id = $(item).find(".video-serial")[0].attribs.href;
            vodShort.vod_name = $(item).find(".video-serial")[0].attribs.title;
            vodShort.vod_pic = $(item).find(".module-item-pic > img")[0].attribs['data-src'];
            vodShort.vod_remarks = '';
            vod_list.push(vodShort);
        }
        return vod_list
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

    async setClasses() {
        let con = await this.fetch(this.siteUrl, null, this.getHeader());
        if (!_.isEmpty(con)) {
            const $ = load(con);
            let elements = $($("[class=\"nav-menu-items\"]")[0]).find("li")
            for (const element of elements.slice(0,6)) {
                let type_name = $($(element).find("span")).text()
                if (type_name !== "首页"){
                    let type_id =  $(element).find("a")[0].attribs["href"].split("/").slice(-1)[0].split(".")[0]
                    let type_dic = {"type_id": type_id, "type_name": type_name}
                    this.classes.push(type_dic)
                }
            }
        }
    }

    async getFilter($) {
        let elements = $("[class=\"scroll-content\"]").slice(1)
        let extend_list = []
        for (let i = 0; i < elements.length; i++) {
            let extend_dic = {"key": (i + 1).toString(), "name": "", "value": []}
            if (i < elements.length - 1) {
                extend_dic["name"] = $($(elements[i]).find("a")[0]).text()
                extend_dic["value"].push({"n": "全部", "v": "0"})
                for (const ele of $(elements[i]).find("a").slice(1)) {
                    extend_dic["value"].push({"n": $(ele).text(), "v": $(ele).text()})
                }
                extend_list.push(extend_dic)
            } else {
                extend_dic["name"] = $($(elements[i]).find("a")[0]).text()
                extend_dic["value"] = [{"n": "全部", "v": "0"}, {
                    "n": $($(elements[i]).find("a")[1]).text(),
                    "v": "hits"
                }, {"n": $($(elements[i]).find("a")[2]).text(), "v": "score"}]

                extend_list.push(extend_dic)
            }

        }
        return extend_list
    }

    async setFilterObj() {
        for (const type_dic of this.classes) {
            let type_id = type_dic["type_id"]
            if (type_id !== "/" && type_id !== "最近更新") {
                let url = this.siteUrl + `/vodshow/id/${type_id}.html`
                let html = await this.fetch(url, null, this.getHeader())
                if (html != null) {
                    let $ = load(html)
                    this.filterObj[type_id] = await this.getFilter($)
                }
            }
        }
    }

    async setHome(filter) {
    }

    async setHomeVod() {
        let con = await this.fetch(this.siteUrl, null, this.getHeader());
        if (!_.isEmpty(con)) {
            const $ = load(con);
            this.homeVodList = await this.parseVodShortListFromDoc($)
        }
    }

    async setCategory(tid, pg, filter, extend) {
        let urlParams = [tid.toString(), "", "", "", "", "", "", "", pg.toString(), "", "", ""]
        let extend_dic = this.get_extend_sort_dic(parseInt(tid))
        for (const key of Object.keys(extend_dic)) {
            if (extend[key] === "0") {
                urlParams[extend_dic[key]] = ""
            } else {
                urlParams[extend_dic[key]] = extend[key]
            }
        }
        let reqUrl = this.siteUrl + '/index.php/vodshow/' + urlParams.join("-") + '.html';
        await this.jadeLog.debug(`类别详情URL:${reqUrl}`)
        let html = await this.fetch(reqUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDoc($)
            let total = Utils.getStrByRegex(/\$\("\.mac_total"\)\.text\('(\d+)'\)/, html)
            this.limit = 72;
            if (total.length > 0) {
                this.total = parseInt(total)
            }
            if (this.total <= this.limit) {
                this.count = 1
            } else {
                this.count = Math.ceil(this.total / this.limit)
            }
        }
    }

    async setDetail(id) {
        let detailUrl = this.siteUrl + id;
        let html = await this.fetch(detailUrl, null, this.getHeader());
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodDetail = await this.parseVodDetailFromDoc($)
        }
    }


    async setPlay(flag, id, flags) {
        let html = await this.fetch(this.siteUrl + id,null,this.getHeader())
        if (!_.isEmpty(html)){
            let player_str = Utils.getStrByRegex(/<script type="text\/javascript">var player_aaaa=(.*?)<\/script>/,html)
            let play_dic = JSON.parse(player_str)
            this.playUrl = play_dic["url"]
        }

    }

    async setSearch(wd, quick) {
        let searchUrl = this.siteUrl + '/index.php/vodsearch/-------------.html?wd=' + wd;
        let html = await this.fetch(searchUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDocBySearch($)
        }
    }

}

let spider = new AiYingShiSpider()

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

