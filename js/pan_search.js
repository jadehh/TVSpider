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
import {VodDetail, VodShort} from "../lib/vod.js";
import {detailContent, playContent} from "../lib/ali.js";
import {it} from "node:test";

const JadeLog = new JadeLogging(getAppName(), "DEBUG")
let homeSpiderResult = new HomeSpiderResult()
let CatOpenStatus = false
let URL = "https://www.pansearch.me/"


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

function getHeader() {
    return {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"}
}

function getSearchHeader() {
    let headers = getHeader();
    headers["x-nextjs-data"] = "1";
    headers['referer'] = URL
    return headers;
}

function getName() {
    return "🗂️┃阿里盘搜┃🗂️"
}

function getAppName() {
    return "阿里盘搜"
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
    let vodDetail = new VodDetail()
    let item = JSON.parse(id)
    let splitList = item["content"].split("\n");
    let $ = load(item["content"])
    let vod_name_elements = $(splitList[0]).slice(1, -1)
    for (const vod_name_element of vod_name_elements) {
        vodDetail.vod_name = vodDetail.vod_name + vod_name_element.children[0].data
    }
    vodDetail.vod_name = vodDetail.vod_name + $(splitList[0]).slice(-1)[0].data
    vodDetail.vod_id = $(item["content"])[5].attribs["href"]
    let aliVodDetail = await detailContent([vodDetail.vod_id])
    vodDetail.vod_play_url = aliVodDetail.vod_play_url
    vodDetail.vod_play_from = aliVodDetail.vod_play_from
    let date = new Date(item["time"])
    vodDetail.vod_remarks = "更新时间:" + date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8)
    let content_list = $(item["content"])[4].data.split("\n")
    for (const content of content_list) {
        if (content.indexOf("描述") > -1) {
            vodDetail.vod_content = content.replace("描述：", "")
        }
    }
    let type_list = $(item["content"]).slice(-1)[0].data.split("\n")
    for (const type of type_list) {
        if (type.indexOf("标签：") > -1) {
            vodDetail.type_name = type.replace("🏷 标签：", "")
        }
    }
    return JSON.stringify({"list": [vodDetail]})
}

async function play(flag, id, flags) {

    return await playContent(flag, id, flags);
}


async function search(wd, quick) {
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${URL}`)
    let vod_list = []
    let html = await fetch(URL, getHeader())
    if (!_.isEmpty(html)) {
        let $ = load(html)
        let buildId = JSON.parse($("script[id=__NEXT_DATA__]")[0].children[0].data)["buildId"]
        let url = URL + "_next/data/" + buildId + "/search.json?keyword=" + encodeURIComponent(wd) + "&pan=aliyundrive";
        let aliContent = await fetch(url, getSearchHeader())
        if (!_.isEmpty(aliContent)) {
            let items = JSON.parse(aliContent)["pageProps"]["data"]["data"]
            for (const item of items) {
                let vodShort = new VodShort()
                vodShort.vod_id = JSON.stringify(item)
                let splitList = item["content"].split("\n");
                let vod_name_elements = $(splitList[0]).slice(1, -1)
                for (const vod_name_element of vod_name_elements) {
                    vodShort.vod_name = vodShort.vod_name + vod_name_element.children[0].data
                }
                vodShort.vod_name = vodShort.vod_name + $(splitList[0]).slice(-1)[0].data
                let date = new Date(item["time"])
                vodShort.vod_remarks = "更新时间:" + date.toLocaleDateString().replace(/\//g, "-") + " " + date.toTimeString().substr(0, 8)
                vodShort.vod_pic = item["image"]
                vod_list.push(vodShort)
            }
            await JadeLog.info("搜索页面解析成功", true)
        } else {
            await JadeLog.error("搜索页面解析失败", true)
        }

    } else {
        await JadeLog.error("搜索页面解析失败", true)
    }
    await JadeLog.debug(`搜索页面内容为:${JSON.stringify({"list": vod_list})}`)
    return JSON.stringify({"list": vod_list})

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