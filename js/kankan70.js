/*
* @File     : kankan70.js
* @Author   : jade
* @Date     : 2023/12/29 15:33
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
let CatOpenStatus = false
let ReconnectTimes = 0
let MaxReconnect = 5
const siteUrl = "http://cqdb6.com";

function getHeader() {
    return {"User-Agent": Utils.CHROME, "Referer": siteUrl + "/"};
}

function get_qp_name44(qp_type) {
    if (qp_type === 'zd') return '最大';
    if (qp_type === 'yj') return '永久';
    if (qp_type === 'hn') return '牛牛';
    if (qp_type === 'gs') return '光波';
    if (qp_type === 'sn') return '新朗';
    if (qp_type === 'wl') return '涡轮';
    if (qp_type === 'lz') return '良子';
    if (qp_type === 'fs') return 'F速';
    if (qp_type === 'ff') return '飞飞';
    if (qp_type === 'bd') return '百度';
    if (qp_type === 'uk') return '酷U';
    if (qp_type === 'wj') return '无天';
    if (qp_type === 'bj') return '八戒';
    if (qp_type === 'tk') return '天空';
    if (qp_type === 'ss') return '速速';
    if (qp_type === 'kb') return '酷播';
    if (qp_type === 'sd') return '闪电';
    if (qp_type === 'xk') return '看看';
    if (qp_type === 'tp') return '淘淘';
    if (qp_type === 'jy') return '精英';

    return qp_type;
}


async function reconnnect(fetch, reqUrl, headers) {
    await JadeLog.error("请求失败,请检查url:" + reqUrl + ",两秒后重试")
    Utils.sleep(2)
    if (ReconnectTimes < MaxReconnect) {
        ReconnectTimes = ReconnectTimes + 1
        return await fetch(reqUrl, headers)
    } else {
        await JadeLog.error("请求失败,重连失败")
        return null
    }
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
            return await reconnnect(fetch, reqUrl, headers)
        }
    } else {
        await JadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
        return await reconnnect(fetch, reqUrl, headers)

    }
}

function getName() {
    return "📺┃70看看┃📺"
}

function getAppName() {
    return "70看看"
}

async function init(cfg) {
    let obj = await SpiderInit(cfg)
    CatOpenStatus = obj.CatOpenStatus
    // 读取缓存
}

function parseVodShortListFromDoc($) {
    let vod_list = []
    let vod_elements = $("a.li-hv")
    for (const vod_element of vod_elements) {
        let vodShort = new VodShort()
        vodShort.vod_id = "/" + vod_element.attribs["href"]
        vodShort.vod_name = vod_element.attribs["title"]
        vodShort.vod_pic = $(vod_element).find("img")[0].attribs["data-original"]
        let remarkEle = $(vod_element).find("p.bz")[0]
        if (remarkEle.length > 0) {
            vodShort.vod_remarks = remarkEle.children[0].data
        }
        vod_list.push(vodShort)
    }
    return vod_list
}


function parseVodDetailFromDoc($) {
    let vodDetail = new VodDetail()
    let infoElement = $("[class=info]")
    let dtElement = $(infoElement).find("dt.name")[0]
    vodDetail.vod_name = dtElement.children[0].data
    vodDetail.vod_remarks = dtElement.children[1].children[0].data
    let ddString = $(infoElement).find("dd").text()
    vodDetail.vod_area = Utils.getStrByRegex(/地区：(.*?) /, ddString)
    vodDetail.vod_year = Utils.getStrByRegex(/年代：(.*?)\n/, ddString)
    vodDetail.type_name = Utils.getStrByRegex(/类型：(.*?)\n/, ddString)
    vodDetail.vod_content = $(infoElement).find("[class=des2]").text().replaceAll("\n", "").replaceAll("剧情：", "")
    vodDetail.vod_pic = $("img.lazy")[0].attribs["data-original"]

    return vodDetail
}

async function home(filter) {
    await JadeLog.info("正在解析首页类别", true)
    let html = await fetch(siteUrl, getHeader())
    let $ = load(html)
    let class_elemets = $("[class=index-list-l]")
    let Classes = []
    let vod_list = []
    for (const class_element of class_elemets) {
        let type_elements = $($(class_element).find("[class=\"h1 clearfix\"]")).find("a")
        let type_id = type_elements[0].attribs["href"]
        if (!_.isEmpty(type_id)) {
            let type_name = $(type_elements[1]).find("span")[0].children[0].data
            Classes.push({"type_name": type_name, "type_id": type_id})
        }
    }
    if (!CatOpenStatus) {
        vod_list = parseVodShortListFromDoc($)
    }
    await JadeLog.debug(`首页类别内容为:${result.home(Classes, vod_list)}`)
    await JadeLog.info("首页类别解析完成", true)
    return result.home(Classes, vod_list)
}


async function homeVod() {
    let vod_list = []
    return JSON.stringify({"list": vod_list})
}


async function category(tid, pg, filter, extend) {
    let url = ""
    await JadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)},url = ${url}`)
    let vod_list = []
    let page = parseInt(pg)
    let count = 0,limit = 0,total = 0

    return result.category(vod_list,page,count,limit,total)
}


function paraseUrlObject(js_str) {
    let content_list = js_str.split(";")
    let urlObject = {}
    let next_index = 0;
    let js_name = ""
    for (let i = 0; i < content_list.length; i++) {
        let content = content_list[i]
        if (i === 0) {
            next_index = parseInt(content.split("=").slice(-1)[0])
            js_name = content.split("=")[0].split(" ")[1]
            urlObject[js_name] = {"play_id": "", "list": [], "pl_dy": ""}
        } else {
            if (i % (next_index + 5) === 3) {
                urlObject[js_name]["play_id"] = content.split("=")[1]
            } else if (i % (next_index + 5) === 2) {
                urlObject[js_name]["pl_dy"] = content.split("=")[1]
            } else if (i % (next_index + 5) === 1) {
            } else if (i % (next_index + 5) === 0) {
                next_index = parseInt(content.split("=").slice(-1)[0])
                js_name = content.split("=")[0].split(" ")[1]
                if (js_name !== undefined) {
                    urlObject[js_name] = {"play_id": "", "list": [], "pl_dy": ""}
                }
            } else if (i % (next_index + 5) === next_index + 4) {
            } else {
                let play_url = content.split("=\"")[1].split(",")[0]
                urlObject[js_name]["list"].push(play_url)
            }
        }
    }
    let play_url_list = [], play_format_list = [];
    for (const key of Object.keys(urlObject)) {
        if (key.indexOf("_") > -1) {
            let play_format_name = get_qp_name44(key.split("_")[1])
            play_format_list.push(play_format_name)
            let vodItems = []
            let index = 0
            for (const play_url of urlObject[key]["list"]) {
                index = index + 1
                vodItems.push("第" + index.toString() + "集" + "$" + play_url)
            }
            play_url_list.push(vodItems.join("#"))
        }
    }
    return {"play_format": play_format_list.join("$$$"), "play_url": play_url_list.join("$$$")}
}

async function detail(id) {
    let detailUrl = siteUrl + id
    let html = await fetch(detailUrl, getHeader())
    let vod_detail = new VodDetail();
    vod_detail.vod_id = id
    if (html !== null) {
        let $ = load(html)
        vod_detail = parseVodDetailFromDoc($)
        vod_detail.vod_id = id
        let mather = /<script type="text\/javascript" src="http:\/\/test.gqyy8.com:8077\/ne2(.*?)"><\/script>/g.exec(html)
        let js_url = "http://test.gqyy8.com:8077/ne2" + mather[1]
        let js_str = await fetch(js_url)
        if (js_str !== null) {
            let playObject = paraseUrlObject(js_str)
            vod_detail.vod_play_url = playObject["play_url"]
            vod_detail.vod_play_from = playObject["play_format"]
        }
    }
    return result.detail(vod_detail)
}

async function play(flag, id, flags) {
    return result.play(id)
}


function paraseVodShortFromList(objectList) {
    let vod_list = []
    for (const object of objectList) {
        let vodShort = new VodShort()
        vodShort.vod_id = object["url"]
        vodShort.vod_pic = object["thumb"]
        vodShort.vod_remarks = object["time"]
        vodShort.vod_name = object["title"]
        vod_list.push(vodShort)
    }
    return vod_list

}

async function search(wd, quick) {
    let url = siteUrl + "/search.php"
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${url}`)
    let html = await fetch(url, getHeader())
    let vod_list = []
    if (html !== null) {
        let data = Utils.objectToStr({
            "top": 10,
            "q": wd,
        })
        let api_url = Utils.getStrByRegex(/var my_search='(.*?)';/, html) + "?" + data
        await JadeLog.debug(`搜索API为:${api_url}`)
        let res = await fetch(api_url)
        let res_json = JSON.parse(res)
        vod_list = paraseVodShortFromList(res_json)
    }else{
        await  JadeLog.error("搜索失败")
    }
    await JadeLog.debug(`搜索页面解析完成,搜索结果为:${result.search(vod_list)}`)
    return result.search(vod_list)
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