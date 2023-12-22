/*
* @File     : nivod.js
* @Author   : jade
* @Date     : 2023/12/19 14:23
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {JadeLogging} from "../lib/log.js";
import {getChannelCache, getHeader, createSign, desDecrypt, ChannelResponse, getVod} from "../lib/nivid_object.js"
import {_, Uri} from "../lib/cat.js";
import {HomeSpiderResult} from "../lib/spider_object.js";
import {VodDetail, VodShort} from "../lib/vod.js";

let ApiUrl = "https://api.nivodz.com"
let Remove18ChannelCode = 0
const JadeLog = new JadeLogging(getAppName())
let channelResponse = new ChannelResponse()
let homeSpiderResult = new HomeSpiderResult()
let CatOpenStatus = false

async function request(reqUrl, params) {
    let header = getHeader()
    let uri = new Uri(reqUrl);
    let response = await req(uri.toString(), {
        method: "post",
        headers: header,
        data: params,
        postType: "form"
    });
    if (response.code === 200 || response.code === undefined) {
        if (!_.isEmpty(response.content)) {
            return desDecrypt(response.content)
        } else {
            await JadeLog.error(`请求失败,请求url为:${uri},回复内容为空`)
            return null
        }
    } else {
        await JadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
        return null
    }

}

function getName() {
    return "👑‍┃泥视频┃👑"
}

function getAppName() {
    return "泥视频"
}

async function init(cfg) {
    try {
        let extObj = null;
        if (typeof cfg.ext === "string") {
            await JadeLog.info(`读取配置文件,ext为:${cfg.ext}`)
            extObj = JSON.parse(cfg.ext)
        } else if (typeof cfg.ext === "object") {
            await JadeLog.info(`读取配置文件,ext为:${JSON.stringify(cfg.ext)}`)
            extObj = cfg.ext
        } else {
            await JadeLog.error(`不支持的数据类型,数据类型为${typeof cfg.ext}`)
        }
        Remove18ChannelCode = parseInt(extObj["code"])
        let boxType = extObj["box"]
        if (boxType === "CatOpen") {
            CatOpenStatus = true
        }
    } catch (e) {
        await JadeLog.error("初始化失败,失败原因为:" + e.message)
    }
    // 读取缓存
    let channelCacheStr = await getChannelCache()
    if (!_.isEmpty(channelCacheStr)) {
        try {
            channelResponse.fromJsonString(channelCacheStr, Remove18ChannelCode)
            await JadeLog.info("读取缓存成功", true);
        } catch (e) {
            await channelResponse.clearCache()
            await JadeLog.error("读取缓存失败,失败原因为:" + e);
        }
    } else {
        await JadeLog.error("读取缓存失败", true);
    }
}


async function home(filter) {
    await JadeLog.info("正在解析首页", true)
    let vod_list = []
    if (channelResponse.channelList.length > 0) {
        await JadeLog.info("有缓存无需解析", true)
        if (!CatOpenStatus) {
            vod_list = await homeContent()
        } else {
            await JadeLog.debug("CatOpen无需解析首页内容")
        }
        await JadeLog.debug(`首页解析内容为:${channelResponse.toSpilder(vod_list)}`)
        return channelResponse.toSpilder(vod_list)
    } else {
        let url = ApiUrl + "/show/channel/list/WEB/3.2" + await createSign()
        let content = await request(url)
        if (content !== null) {
            channelResponse.fromJsonString(content, Remove18ChannelCode)
            await channelResponse.save()
            let filterUrl = ApiUrl + "/show/filter/condition/WEB/3.2" + await createSign()
            let filterContent = await request(filterUrl)
            if (filterContent !== null) {
                channelResponse.setChannelFilters(filterContent)
                await channelResponse.save()
            }
            channelResponse.toSpilder()
            if (!CatOpenStatus) {
                vod_list = await homeContent()
            } else {
                await JadeLog.debug("CatOpen无需解析首页内容")
            }
            await JadeLog.info("首页解析成功", true)
            await JadeLog.debug(`首页解析内容为:${channelResponse.toSpilder(vod_list)}`)
            return channelResponse.toSpilder(vod_list)
        } else {
            await JadeLog.error("首页解析失败", true)
            await channelResponse.clearCache()
            await JadeLog.debug(`首页解析内容为:${homeSpiderResult.setHomeSpiderResult([]).toString()}`)
            return homeSpiderResult.setHomeSpiderResult([]).toString()

        }
    }

}

function getVodRemarks(hot, playResolutions) {
    let vod_remarks
    if (CatOpenStatus) {
        vod_remarks = `清晰度:${playResolutions[0]}`
    } else {
        vod_remarks = `清晰度:${playResolutions[0]},热度:${(Math.floor(parseInt(hot) / 1000)).toString()}k`
    }
    return vod_remarks
}

async function homeContent() {
    await JadeLog.info("正在解析首页列表", true)
    // let params = {
    //     "start": "0",
    //     "more": "1"
    // }
    // let homeUrl = ApiUrl + "/index/desktop/WEB/3.4" + await createSign(params)
    // let content = await request(homeUrl, params)
    let url = ApiUrl + "/index/mobile/WAP/3.0" + await createSign()
    let content = await request(url)
    let vod_list = []
    if (content !== null) {
        let content_json = JSON.parse(content)
        let cate_list = content_json.list
        for (const cate_dic of cate_list) {
            for (const row of cate_dic.rows) {
                for (const cells of row.cells) {
                    let vodShort = new VodShort()
                    vodShort.vod_id = cells.show["showIdCode"]
                    vodShort.vod_pic = cells.img
                    vodShort.vod_name = cells.title
                    vodShort.vod_remarks = getVodRemarks(cells.show["hot"], cells.show["playResolutions"])
                    vod_list.push(vodShort)
                }
            }
        }
        await JadeLog.info("解析首页列表成功", true)
        return vod_list
    } else {
        await JadeLog.error("首页解析失败", true)
        return vod_list
    }
}

async function homeVod() {

}

function getExtendDic(extend, params) {
    if (extend["5"] === undefined) {
        delete params.year_range
    } else {
        if (extend["5"] === "0") {
            delete params.year_range
        } else {
            params.year_range = extend["5"]
        }
    }
    if (extend["1"] !== undefined) {
        params.sort_by = extend["1"]
    }
    if (extend["2"] !== undefined) {
        params.show_type_id = extend["2"]
    }
    if (extend["3"] !== undefined) {
        params.region_id = extend["3"]
    }
    if (extend["4"] !== undefined) {
        params.lang_id = extend["4"]
    }
    return params
}

async function category(tid, pg, filter, extend) {
    await JadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)}`)
    let page = parseInt(pg)
    let params = {
        "sort_by": "0",
        "channel_id": tid.toString(),
        "show_type_id": "0",
        "region_id": "0",
        "lang_id": "0",
        "year_range": "2023",
        "start": ((parseInt(pg) - 1) * 20).toString()
    }
    params = getExtendDic(extend, params)
    let url = ApiUrl + "/show/filter/WEB/3.2" + await createSign(params)
    let content = await request(url, params)
    let vod_list = []
    if (content != null) {
        let content_json = JSON.parse(content)
        for (const vod_dic of content_json["list"]) {
            let vodShort = new VodShort()
            vodShort.vod_id = vod_dic["showIdCode"]
            vodShort.vod_name = vod_dic["showTitle"]
            vodShort.vod_pic = vod_dic["showImg"]
            vodShort.vod_remarks = getVodRemarks(vod_dic["hot"], vod_dic["playResolutions"])
            vod_list.push(vodShort)
        }
        await JadeLog.debug(`分类页解析内容为:${JSON.stringify({"list": vod_list})}`)
        await JadeLog.info("分类页解析成功", true)
    } else {
        page = page - 1
        await JadeLog.debug(`分类页解析内容为:${JSON.stringify({"list": vod_list})}`)
        await JadeLog.info("分类页解析失败", true)
    }
    return JSON.stringify({
        page: page,
        list: vod_list,
    })
}

function getListFromObj(dic_list, key) {
    let objList = []
    for (const dic of dic_list) {
        objList.push(dic[key])
    }
    return objList
}

function parseDetailByObj(vod_dic) {
    let vodDetail = new VodDetail()
    vodDetail.vod_id = vod_dic["showIdCode"]
    vodDetail.vod_name = vod_dic["showTitle"]
    vodDetail.vod_remarks = getVodRemarks(vod_dic["hot"], vod_dic["playResolutions"])
    vodDetail.vod_pic = vod_dic["showImg"]
    vodDetail.vod_director = vod_dic["director"]
    vodDetail.vod_actor = vod_dic["actors"]
    vodDetail.vod_year = vod_dic["postYear"]
    vodDetail.vod_content = vod_dic["showDesc"]
    vodDetail.type_name = vod_dic["showTypeName"]
    vodDetail.vod_area = vod_dic["regionName"]
    return vodDetail
}

async function detail(id) {
    let params = {
        "show_id_code": id.toString()
    }
    let vodDetail = new VodDetail()
    let url = ApiUrl + "/show/detail/WEB/3.2" + await createSign(params)
    await JadeLog.info(`正在解析详情页面,id = ${id},url:${url}`)
    let content = await request(url, params)
    if (content != null) {
        let content_json = JSON.parse(content)
        let vod_dic = content_json["entity"]
        vodDetail = parseDetailByObj(vod_dic)
        let niBaVodDetail = getVod(vod_dic["plays"], ["原画"], id.toString())
        vodDetail.vod_play_from = niBaVodDetail.vod_play_from
        vodDetail.vod_play_url = niBaVodDetail.vod_play_url
        await JadeLog.debug(`详情页面解析内容为:${JSON.stringify({"list": [vodDetail]})}`)
        await JadeLog.info("详情页面解析成功", true)
    } else {
        await JadeLog.debug(`详情页面解析内容为:${JSON.stringify({"list": [vodDetail]})}`)
        await JadeLog.info("详情页面解析失败", true)
    }
    return JSON.stringify({
        list: [vodDetail],
    })
}

async function play(flag, id, flags) {
    let playId = id.split("@")[0]
    let showId = id.split("@")[1]
    let params = {
        "show_id_code": showId,
        "play_id_code": playId
    }
    let url = ApiUrl + "/show/play/info/WEB/3.2" + await createSign(params)
    await JadeLog.info(`正在解析播放页面,播放类型为 = ${flag},播放文件Id为:${id},播放所有类型为:${flags},url=${url}`)
    let content = await request(url, params)
    let play_url = ""
    if (content != null) {
        let content_json = JSON.parse(content)
        play_url = content_json["entity"]["playUrl"]
        await JadeLog.info("播放页面解析成功", true)
    } else {
        await JadeLog.info("播放页面解析失败", true)
    }
    return JSON.stringify({
        parse: 0,
        url: play_url,
        header: getHeader(),
        format: "application/octet-stream",
    });
}

async function search(wd, quick) {
    let params = {"cat_id": "1", "keyword": wd, "keyword_type": "0", "start": "0"}
    let url = ApiUrl + "/show/search/WEB/3.2" + await createSign(params)
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${url}`)
    let content = await request(url, params)
    let vod_list = []
    if (content != null) {
        let content_json = JSON.parse(content)
        for (const vod_dic of content_json["list"]) {
            let vod_detail = parseDetailByObj(vod_dic)
            vod_list.push(vod_detail)
        }
        await JadeLog.info("搜索页面解析成功", true)
    } else {
        await JadeLog.info("搜索页面解析失败", true)
    }
    return JSON.stringify({
        list: vod_list,
    });
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