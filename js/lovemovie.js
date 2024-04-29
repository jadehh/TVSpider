/*
* @File     : lovemovie.js
* @Author   : jade
* @Date     : 2024/4/29 09:36
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 爱情电影网
*/
import {Spider} from "./spider.js";
import {_, Crypto, load} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";

class LoveMovieSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://b.aqdyje.com"
        this.removeKey = "骑兵营"
    }

    getName() {
        return "💕┃爱情电影网┃💕"
    }

    getAppName() {
        return "爱情电影网"
    }

    getJSName() {
        return "lovemovie"
    }

    getType() {
        return 3
    }

    async init(cfg) {
        await super.init(cfg);
    }

    async getHtml(url = this.siteUrl, proxy = false, headers = this.getHeader()) {
        let buffer = await this.fetch(url, null, headers, false, false, 1, proxy)
        let html = Utils.decode(buffer, "gb2312")
        if (!_.isEmpty(html)) {
            return load(html)
        } else {
            await this.jadeLog.error(`html获取失败`, true)
        }
    }

    async getFilter($,navElements) {
        let extend_list = []
        let extend_dic = {"key":"class","name":"类型","value":[this.getFliterDic("全部","全部")]}
        for (const navElement of $(navElements).find("li")){
            let element = $(navElement).find("a")[0]
            let type_name = $(element).text()
            let type_id = element.attribs.href
            extend_dic["value"].push(this.getFliterDic(type_name,type_id))
        }
        if (extend_dic["value"].length > 1){
            extend_list.push(extend_dic)
        }
        return extend_list
    }

    async setClasses() {
        let $ = await this.getHtml()
        let navElements = $("[class=\"nav-item drop-down \"]")
        for (const navElement of navElements) {
            let elemenet = $(navElement).find("a")[0]
            let type_name = $(elemenet).text()
            let type_id = elemenet.attribs.href
            if (type_name !== this.removeKey) {
                this.classes.push(this.getTypeDic(type_name, type_id))
                this.filterObj[type_id] = await this.getFilter($,navElement)
            }
        }
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let html = $.html()
        let vodElements = $("[class=\"play-img\"]")
        for (const vodElement of vodElements){
            let vodShort = new VodShort()
            vodShort.vod_id = vodElement.attribs.href
            let imgElement = $(vodElement).find("img")[0]
            vodShort.vod_pic = imgElement.attribs.src
            vodShort.vod_name = imgElement.attribs.alt
            vodShort.vod_remarks = $($(vodElement).find("label")).text()
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        let html = $.html()
        let vodDetail = new VodDetail()
        let imgElement = $("[class=\"detail-pic fn-left\"]").find("img")[0]
        vodDetail.vod_pic = imgElement.attribs.src
        vodDetail.vod_name = imgElement.attribs.alt
        let vodInfoElement = $("[class=\"info fn-clear\"]")
        for (const vodDlElement of $(vodInfoElement).find("dl")){
            let text = $(vodDlElement).text()
            if (text.indexOf("主演") > -1){
                 vodDetail.vod_actor = text.replaceAll("主演：","").replaceAll("\n","")
            }
            if (text.indexOf("状态") > -1){
                vodDetail.vod_remarks = text.replaceAll("状态：","").replaceAll("\n","")
            }
            if (text.indexOf("类型") > -1){
                vodDetail.type_name = text.replaceAll("类型：","").replaceAll("\n","")
            }
            if (text.indexOf("地区") > -1){
                vodDetail.vod_area = text.replaceAll("地区：","").replaceAll("\n","")
            }
            if (text.indexOf("导演") > -1){
                vodDetail.vod_director = text.replaceAll("导演：","").replaceAll("\n","")
            }
            if (text.indexOf("年份") > -1){
                vodDetail.vod_year =text.replaceAll("年份：","").replaceAll("\n","")
            }
             if (text.indexOf("剧情") > -1){
                vodDetail.vod_content =text.replaceAll("剧情：","").replaceAll("\n","")
            }
        }
        let playList = {}

        let playListElements = $("[class=\"play-list\"]")
        let index = 1
        for (const playListElement of playListElements){
            let playName = `播放连接-${index}`
            let vodItems = []
            for (const playUrlElement of $(playListElement).find("a")){
                let playUrlName = playUrlElement.attribs.title
                let playUrl = playUrlElement.attribs.href
                vodItems.push(playUrlName + "$" + playUrl)
            }
            playList[playName] = vodItems.join("#")
            index = index + 1
        }
        vodDetail.vod_play_url = _.values(playList).join('$$$');
        vodDetail.vod_play_from = _.keys(playList).join('$$$');
        return vodDetail
    }


    async setHomeVod() {
        let $ = await this.getHtml()
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    async setDetail(id) {
        let $ = await this.getHtml(this.siteUrl + id)
        this.vodDetail = await this.parseVodDetailFromDoc($)
    }
    async setPlay(flag, id, flags) {
        let idSplitList = id.split("-")
        let flag_id = parseInt(idSplitList[1])
        let episode = parseInt(idSplitList[2].split(".")[0])
        let $ = await this.getHtml(this.siteUrl + id)
        let playJsUrl = Utils.getStrByRegex(/<script type="text\/javascript" src="(.*?)">/,$.html())
        let playJsContent = await this.fetch(this.siteUrl + playJsUrl,null,this.getHeader())
        let playUrlListStr = Utils.getStrByRegex(/var VideoListJson=(.*?),urlinfo=/,playJsContent)
        let playDic = eval(playUrlListStr)
        this.playUrl = playDic[flag_id][1][episode].split("$")[1]
    }

}

let spider = new LoveMovieSpider()

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

export {spider}