/*
* @File     : hscangku.js
* @Author   : jade
* @Date     : 2024/01/03 19:19
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {JadeLogging} from "../lib/log.js";
import {Result, SpiderInit} from "../lib/spider_object.js";
import {} from "../lib/crypto-js.js"
import * as Utils from "../lib/utils.js";
import {_, load, Uri} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";

const JadeLog = new JadeLogging(getAppName(), "DEBUG")
let result = new Result()
let classes = [
    {
        "type_name": "国产视频",
        "type_id": "?type=gc"
    },
    {
        "type_name": "国产新片",
        "type_id": "?type=ycgc"
    },
    {
        "type_name": "无码中文字幕",
        "type_id": "?type=wz"
    },
    {
        "type_name": "有码中文字幕",
        "type_id": "?type=yz"
    },
    {
        "type_name": "日本无码",
        "type_id": "?type=rw"
    }
]
let CatOpenStatus = false
let ReconnectTimes = 0
let MaxReconnect = 5
const siteUrl = "https://hsck12.shop/";

function getName() {
    return "┃黄色仓库┃"
}

function getAppName() {
    return "黄色仓库"
}

async function reconnnect(fetch, reqUrl, headers, params) {
    await JadeLog.error("请求失败,请检查url:" + reqUrl + ",两秒后重试")
    Utils.sleep(2)
    if (ReconnectTimes < MaxReconnect) {
        ReconnectTimes = ReconnectTimes + 1
        return await fetch(reqUrl, headers, params)
    } else {
        await JadeLog.error("请求失败,重连失败")
        return null
    }
}

async function fetch(reqUrl, headers, params = null) {
    let data = Utils.objectToStr(params)
    if (!_.isEmpty(data)) {
        reqUrl = reqUrl + "?" + data
    }
    let uri = new Uri(reqUrl);
    let response = await req(uri.toString(), {
        method: "get",
        headers: headers,
        data: null
    });
    if (response.code === 200 || response.code === undefined) {
        if (!_.isEmpty(response.content)) {
            return response.content
        } else {
            return await reconnnect(fetch, reqUrl, headers, params)
        }
    } else {
        await JadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
        return await reconnnect(fetch, reqUrl, headers)

    }
}

function getHeader() {
    return {"User-Agent": Utils.CHROME};
}

async function init(cfg) {
    let obj = await SpiderInit(cfg)
    CatOpenStatus = obj.CatOpenStatus
    // 读取缓存
}


function parseVodShortListFromDoc($) {
    let vod_list = []
    let vodElements = $("[class=\"stui-vodlist clearfix\"]").find("li")
    for (const vod_element of vodElements) {
        let vodShort = new VodShort()
        let vodElement = $(vod_element).find("a")[0]
        vodShort.vod_id = vodElement.attribs["href"]
        vodShort.vod_name = vodElement.attribs["title"]
        vodShort.vod_pic = vodElement.attribs["data-original"]
        vod_list.push(vodShort)
    }

    return vod_list
}
function  parseVodDetailFromDoc($){
    let vodDetail = new VodDetail()
    let element = $($("[class=\"stui-pannel__head clearfix\"]")[1]).find("h3")
    let stui_pannel_bd_element = $("div.stui-pannel-bd > div")
    let video_element = stui_pannel_bd_element.find("video")[0]
    vodDetail.vod_name = element.text()
    vodDetail.vod_pic = video_element.attribs["poster"]
    vodDetail.vod_play_from = "黄色仓库"
    vodDetail.vod_play_url = $(video_element).find("source")[0].attribs["src"]
    return vodDetail
}

async function home(filter) {
    await JadeLog.info("正在解析首页类别", true)
    await JadeLog.debug(`首页类别内容为:${result.home(classes, [], {})}`)
    await JadeLog.info("首页类别解析完成", true)
    return result.home(classes, [], {})
}

async function homeVod() {
    let vod_list = []
    if (!CatOpenStatus) {
        await JadeLog.info("正在解析首页内容")
    }
    await JadeLog.debug(`首页内容为:${JSON.stringify({"list": vod_list})}`)
    return JSON.stringify({"list": vod_list})
}


async function category(tid, pg, filter, extend) {
    let url = siteUrl + tid + "&p=" + pg.toString()
    await JadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)},url = ${url}`)
    let vod_list = []
    let html = await fetch(url, getHeader())
    let page = parseInt(pg)
    let count = 0, total = 0, limit = 40;
    if (html !== null) {
        let $ = load(html)
        vod_list = parseVodShortListFromDoc($)
        total = parseInt($("[class=\"active\"]").find("span").text())
    }
    await JadeLog.debug(`分类结果为:${result.category(vod_list, page, count, limit, total)}`)
    return result.category(vod_list, page, count, limit, total)
}


async function detail(id) {
    await JadeLog.info(`正在获取详情界面,id为:${id}`)
    let url = siteUrl + id
    let html = await fetch(url, getHeader())
    let vodDetail = new VodDetail()
    if (html !== null) {
        let $ = load(html)
        vodDetail = parseVodDetailFromDoc($)
    }
    vodDetail.vod_id = id
    return result.detail(vodDetail)
}

async function play(flag, id, flags) {
    return  result.play(id)
}


async function search(wd, quick) {
    let url = ""
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${url}`)
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