/*
* @File     : pan_search.js
* @Author   : jade
* @Date     : 2023/12/25 17:18
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {JadeLogging} from "../lib/log.js";
import {HomeSpiderResult, SpiderInit} from "../lib/spider_object.js";
import {} from "../lib/crypto-js.js"
import {_, load, Uri} from "../lib/cat.js";

const JadeLog = new JadeLogging(getAppName(), "DEBUG")
let homeSpiderResult = new HomeSpiderResult()
let CatOpenStatus = false
let URL = "https://www.pansearch.me/"


async function fetch(reqUrl,headers) {
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

function getHeader() {
    return {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"}
}

function getSearchHeader() {
    let headers = getHeader();
    headers.put("x-nextjs-data", "1");
    headers.put("referer", URL);
    return headers;
}

function getName() {
    return `🗂️┃盘搜┃🗂️`
}

function getAppName() {
    return `盘搜`
}

async function init(cfg) {
    CatOpenStatus = await SpiderInit(cfg)
    // 读取缓存
}


async function home(filter) {
    return homeSpiderResult.setHomeSpiderResult([], [], []).toString()
}


async function homeVod() {
    let vod_list = []
    return JSON.stringify({"list": vod_list})
}


async function category(tid, pg, filter, extend) {
    let vod_list = []
    return JSON.stringify({"list": vod_list})
}


async function detail(id) {
    return JSON.stringify({})
}

async function play(flag, id, flags) {

    return JSON.stringify({});
}


async function search(wd, quick) {
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${URL}`)
    let html = await fetch(URL,getHeader())
    let $ = load(html)
    let data = $.select("script[id=__NEXT_DATA__]")

    await JadeLog.info("Done")

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