/*
* @File     : xb6v.js
* @Author   : jade
* @Date     : 2023/12/26 10:13
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {JadeLogging} from "../lib/log.js";
import {Result, SpiderInit} from "../lib/spider_object.js";
import * as Utils from "../lib/utils.js";
import {_, load, Uri} from "../lib/cat.js";
import {VodShort} from "../lib/vod.js";

const JadeLog = new JadeLogging(getAppName(), "DEBUG")
let CatOpenStatus = false
const siteUrl = "http://www.xb6v.com";
let result = new Result()

function getName() {
    return "🧲|磁力新6V|🧲"
}

function getAppName() {
    return "磁力新6V"
}

async function fetch(reqUrl, headers) {
    let uri = new Uri(reqUrl);
    let response = await req(uri.toString(), {
        method: "get",
        headers: headers,
        data: null,
    });
    if (response.code === 200 || response.code === undefined) {
        if (!_.isEmpty(response.content)) {
            return response.content
        } else {
            await JadeLog.error(`请求失败,请求url为:${uri},回复内容为空`)
            return null
        }
    } else {
        await JadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
        return null
    }
}

async function init(cfg) {
    let obj = await SpiderInit(cfg)
    CatOpenStatus = obj.CatOpenStatus
}

function getHeader() {
    return {"User-Agent": Utils.CHROME, "Referer": siteUrl + "/"};
}

function getDetailHeader() {
    return {"User-Agent": Utils.CHROME};
}

function parseVodListFromDoc(doc) {
    let items = doc("#post_container .post_hover");
    let vod_list = []
    for (const item of items) {
        let element = doc(item).find("[class=zoom]")[0];
        let vodShort = new VodShort()
        vodShort.vod_id = element.attribs["href"];
        vodShort.vod_name = element.attribs["title"].replaceAll(/<\\?[^>]+>/g, "");
        vodShort.vod_pic = doc(element).find("img")[0].attribs["src"];
        vodShort.vod_remarks = doc(item).find("p")[0].children[0].data.replaceAll("\n", "").replaceAll(" ", "");
        vod_list.push(vodShort)
    }
    return vod_list;
}

async function home(filter) {
    let Classes = []
    let Filters = {}
    await JadeLog.info("正在解析首页类别", true)
    let html = await fetch(siteUrl, getHeader());
    let vod_list = []
    if (!_.isEmpty(html)) {
        let $ = load(html);
        let elements = $('#menus > li > a');
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            if (i < 2 || i === elements.length - 1) continue;
            let typeName = element.children[0].data;
            let typeId = element.attribs["href"];
            Classes.push({"type_name": typeName, "type_id": typeId})
            if (typeName === "电视剧") {
                let values = [{"n": "不限", "v": ""}]
                for (const a of $(element.next).find("a")) {
                    values.push({"n": a.children[0].data, "v": a.attribs["href"].replaceAll(typeId, "")})
                }
                Filters[typeId] = [
                    {
                        "key": "cateId",
                        "name": "类型",
                        "value": values
                    }
                ]
            }

        }
        await JadeLog.info("首页类别解析成功", true)
        if (CatOpenStatus) {
            await JadeLog.debug(`首页类别内容为:${result.home(Classes, vod_list, Filters)}`)
            return result.home(Classes, vod_list, Filters)
        } else {
            vod_list = parseVodListFromDoc($)
            await JadeLog.debug(`首页类别内容为:${result.home(Classes, vod_list, Filters)}`)
            return result.home(Classes, vod_list, Filters)
        }
    } else {
        await JadeLog.info("首页类别解析失败", true)
    }
    await JadeLog.debug(`首页类别内容为:${result.home(Classes, vod_list, Filters)}`);
    return result.home(Classes, vod_list, Filters)
}


async function homeVod() {
    let vod_list = []
    if (!CatOpenStatus) {
        await JadeLog.info("正在解析首页内容")
    }
    await JadeLog.debug(`首页内容为:${JSON.stringify({"list": vod_list})}`)
    return result.homeVod(vod_list)
}


async function category(tid, pg, filter, extend) {
    let cateId = extend["cateId"] ?? "";
    let cateUrl = siteUrl + tid + cateId;
    let page = parseInt(pg)
    let count = 0
    let limit = 18;
    let total = 0;
    let vod_list = [];
    if (page !== 1) {
        cateUrl += "index_" + pg + ".html";
    }
    await JadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)},url = ${cateUrl}`)
    let html = await fetch(cateUrl, getHeader());
    if (!_.isEmpty(html)) {
        let $ = load(html)
        let href = $(".pagination > a").slice(-1)[0].attribs["href"];
        let patternPageCount = /index_(.*?).html/
        let matches = patternPageCount.exec(href)
        count = parseInt(matches[1])
        let items = $("#post_container .post_hover");
        total = page === count ? (page - 1) * limit + items.length : count * limit;
        vod_list = parseVodListFromDoc($)
    }
    return result.category(vod_list, page, count, limit, total)
}


async function detail(id) {
    return JSON.stringify({})
}

async function play(flag, id, flags) {

    return JSON.stringify({});
}


async function search(wd, quick) {
    let searchUrl = siteUrl + "/e/search/index.php";
    let params = {
        "show": "title",
        "tempid": "1",
        "tbname": "article",
        "mid": "1",
        "dopost": "search",
        "submit": "",
        "keyboard": encodeURIComponent(wd),

    }
    let headers = {
        "User-Agent": Utils.CHROME,
        "Origin": siteUrl,
        "Referer": siteUrl + "/"
    }
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${searchUrl}`)
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
    };
}