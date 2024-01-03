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
import {_, Uri} from "../lib/cat.js";
const JadeLog = new JadeLogging(getAppName(), "DEBUG")
let result = new Result()
let classes = [
    {
        "type_name": "日韩AV",
        "type_id": "/vodtype/1.html"
    },
    {
        "type_name": "国产系列",
        "type_id": "/vodtype/2.html"
    },
    {
        "type_name": "欧美",
        "type_id": "/vodtype/3.html"
    },
    {
        "type_name": "成人动漫",
        "type_id": "/vodtype/4.html"
    }
]
let CatOpenStatus = false
let ReconnectTimes = 0
let MaxReconnect = 5
const siteUrl = "http://www.243333.xyz";
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
        data: null,
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


async function home(filter) {
    await JadeLog.info("正在解析首页类别", true)
    await JadeLog.debug(`首页类别内容为:${result.home(classes,[],{})}`)
    await JadeLog.info("首页类别解析完成", true)
    return result.home(classes,[],{})
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
    let url = siteUrl + tid
    await JadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)},url = ${url}`)
    let html = await fetch(url,getHeader())
    await JadeLog.info(html)
}


async function detail(id) {
    return JSON.stringify({})
}

async function play(flag, id, flags) {

    return JSON.stringify({});
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