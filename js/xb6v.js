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
import {VodDetail, VodShort} from "../lib/vod.js";
import {objectToStr} from "../lib/utils.js";

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

async function postJson(url, params, headers) {
    let uri = new Uri(url);
    let response = await req(uri.toString(), {
        method: "post",
        headers: headers,
        data: params,
        postType: "form"
    });

    if (response.code === 200 || response.code === undefined) {
        if (!_.isEmpty(response.content)) {
            return response.content
        } else {
            await JadeLog.error(`请求失败,请求url为:${url},回复内容为空`)
            return null
        }
    } else if (response.code === 302) {
        await JadeLog.debug(`重定向回复值为:${response.content}`)
        let matcher = /<a HREF=(.*?)>/.exec(response.content)
        if (matcher.length > 1) {
            let new_url = siteUrl + "/e/search/" + matcher[1].replaceAll("\\","").replaceAll("\"","")
            await JadeLog.info(`重定向url为:${new_url}`)
            return await fetch(new_url, getHeader())
        }

    } else {
        await JadeLog.error(`请求失败,请求url为:${url},回复内容为${JSON.stringify(response)}`)
        return null
    }
}


async function fetch(reqUrl, headers, method = "get") {
    let uri = new Uri(reqUrl);
    let response = await req(uri.toString(), {
        method: method,
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
        vodShort.vod_remarks = doc(item).find("[rel=\"category tag\"]").text().replaceAll("\n", "").replaceAll(" ", "");
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
        let href_elements = $(".pagination > a")
        if (href_elements.length > 0) {
            let href = href_elements.slice(-1)[0].attribs["href"];
            let patternPageCount = /index_(.*?).html/
            let matches = patternPageCount.exec(href)
            count = parseInt(matches[1])
            let items = $("#post_container .post_hover");
            total = page === count ? (page - 1) * limit + items.length : count * limit;
        }

        vod_list = parseVodListFromDoc($)
    }
    return result.category(vod_list, page, count, limit, total)
}

function getStrByRegex(pattern, str) {
    let matcher = pattern.exec(str);
    if (matcher !== null) {
        if (matcher.length >= 1) {
            if (matcher.length >= 1) return matcher[1]
        }
    }
    return "";
}

function getActorOrDirector(pattern, str) {
    return getStrByRegex(pattern, str)
        .replace(/<br>/g, "")
        .replace(/&nbsp;./g, "")
        .replace(/&amp;/g, "")
        .replace(/middot;/g, "・")
        .replace(/　　　　　/g, ",")
        .replace(/　　　　 　/g, ",")
        .replace(/　/g, "");
}

function getDescription(pattern, str) {
    return getStrByRegex(pattern, str)
        .replace(/<\/?[^>]+>/g, "")
        .replace(/\n/g, "")
        .replace(/&amp;/g, "")
        .replace(/middot;/g, "・")
        .replace(/ldquo;/g, "【")
        .replace(/rdquo;/g, "】")
        .replace(/　/g, "");
}


async function detail(id) {
    await JadeLog.info(`正在获取详情界面,id为:${id}`)
    let detailUrl = siteUrl + id;
    let html = await fetch(detailUrl, getDetailHeader())
    let vodDetail = new VodDetail()
    vodDetail.vod_id = id
    if (!_.isEmpty(html)) {
        let $ = load(html);
        let sourceList = $("#post_content");
        let play_form_list = []
        let play_url_list = []

        if (!CatOpenStatus) {
            let i = 0
            let circuitName = "磁力线路";
            for (const source of sourceList) {
                let aList = $(source).find("table a")
                let vodItems = []
                for (const a of aList) {
                    let episodeUrl = a.attribs["href"]
                    let episodeName = a.children[0].data
                    if (!episodeUrl.toLowerCase().startsWith("magnet")) continue;
                    vodItems.push(episodeName + "$" + episodeUrl);
                }
                if (vodItems.length > 0) {
                    i++;
                    play_form_list.push(circuitName + i)
                    play_url_list.push(vodItems.join("#"))
                }
            }
        }
        let playSourceList = $($(".mainleft")).find("[class=\"widget box row\"]")
        for (const source of playSourceList) {
            let play_format = $(source).find("h3").text()
            let vodItems = []
            if (!_.isEmpty(play_format)) {
                let urlSourceList = $(source).find("a")
                for (const url_source of urlSourceList) {
                    vodItems.push(url_source.attribs["title"] + "$" + url_source.attribs["href"])
                }
                play_form_list.push(play_format)
                play_url_list.push(vodItems.join("#"))
            }
        }


        let partHTML = $(".context").html();
        vodDetail.vod_name = $(".article_container > h1").text();
        vodDetail.vod_pic = $("#post_content img").attr("src");
        vodDetail.type_name = getStrByRegex(/◎类　　别　(.*?)<br>/, partHTML);
        if (_.isEmpty(vodDetail.type_name)) vodDetail.type_name = $("[rel=\"category tag\"]").text();
        vodDetail.vod_year = getStrByRegex(/◎年　　代　(.*?)<br>/, partHTML);
        if (_.isEmpty(vodDetail.vod_year)) vodDetail.vod_year = getStrByRegex(/首播:(.*?)<br>"/, partHTML);
        vodDetail.vod_area = getStrByRegex(/◎产　　地　(.*?)<br>/, partHTML);
        if (_.isEmpty(vodDetail.vod_year)) vodDetail.vod_area = getStrByRegex(/地区:(.*?)<br>"/, partHTML);
        vodDetail.vod_remarks = getStrByRegex(/◎上映日期　(.*?)<br>/, partHTML);
        vodDetail.vod_actor = getActorOrDirector(/◎演　　员　(.*?)<\/p>/, partHTML);
        if (_.isEmpty(vodDetail.vod_actor)) vodDetail.vod_actor = getActorOrDirector(/◎主　　演　(.*?)<\/p>/, partHTML);
        if (_.isEmpty(vodDetail.vod_actor)) vodDetail.vod_actor = getActorOrDirector(/主演:(.*?)<br>/, partHTML);
        vodDetail.vod_director = getActorOrDirector(/◎导　　演　(.*?)<br>/, partHTML);
        if (_.isEmpty(vodDetail.vod_director)) vodDetail.vod_director = getActorOrDirector(/导演:(.*?)<br>/, partHTML);
        vodDetail.vod_content = getDescription(/◎简　　介(.*?)<hr>/gi, partHTML);
        if (_.isEmpty(vodDetail.vod_content)) vodDetail.vod_content = getDescription(/简介(.*?)<\/p>/gi, partHTML);
        if (_.isEmpty(vodDetail.vod_content)) vodDetail.vod_content = getDescription(/◎简　　介(.*?)<br>/gi, partHTML);

        vodDetail.vod_play_from = play_form_list.join("$$$")
        vodDetail.vod_play_url = play_url_list.join("$$$")
    } else {
    }
    await JadeLog.info(`详情界面内容为:${result.detail(vodDetail)}`)
    return result.detail(vodDetail)
}

async function play(flag, id, flags) {
    if (id.toLowerCase().startsWith("magnet")) {
        await JadeLog.debug(`磁力连接,直接播放,${result.play(id)}`)
        return result.play(id)
    } else {
        let playUrl = siteUrl + id
        let html = await fetch(playUrl, getHeader())
        let $ = load(html)
        let video_url = ""
        switch (flag) {
            case "播放地址（无插件 极速播放）":
            case "播放地址三":
                video_url = $($(".video")).find("iframe")[0].attribs["src"] + "/index.m3u8"
                break
            case "播放地址（无需安装插件）":
                let matchers2 = /url: '(.*?)',/gs.exec(html)
                if (matchers2.length > 1) {
                    video_url = matchers2[1]
                }
                break
            case "播放地址四":
                let matchers4 = /source: "(.*?)",/gs.exec(html)
                if (matchers4.length > 1) {
                    video_url = matchers4[1]
                }
                break
            default:
                await JadeLog.warning(`暂不支持当前格式,当前格式为:${flag}`)
                break
        }

        return result.play(video_url)
    }

}


async function search(wd, quick) {
    let searchUrl = siteUrl + "/e/search/index.php";
    let vod_list = []
    let params = {
        "show": "title",
        "tempid": "1",
        "tbname": "article",
        "mid": "1",
        "dopost": "search",
        "keyboard": wd,

    }
    let headers = {
        "User-Agent": Utils.CHROME,
        "Origin": siteUrl,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${searchUrl}`)
    let html = await postJson(searchUrl, params, headers)
    if (!_.isEmpty(html)) {
        let $ = load(html)
        vod_list = parseVodListFromDoc($)
        if (vod_list.length > 0) {
            await JadeLog.info(`搜索页面完成`, true)
        } else {
            await JadeLog.warning(`搜索页面完成,没有搜索到`, true)
        }
    }
    await JadeLog.debug(result.search(vod_list))
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