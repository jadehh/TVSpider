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
                    vodShort.vod_remarks = `热度:${(Math.floor(parseInt(cells.show["hot"]) / 1000)).toString()}k,清晰度:${cells.show["playResolutions"][0]}`
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
            vodShort.vod_remarks = `热度:${(Math.floor(parseInt(vod_dic["hot"]) / 1000)).toString()}k,清晰度:${vod_dic["playResolutions"][0]}`
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

function getListFromObj(dic_list,key){
    let objList = []
    for (const dic of dic_list){
        objList.push(dic[key])
    }
    return objList
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
        vodDetail.vod_id = vod_dic["showIdCode"]
        vodDetail.vod_name = vod_dic["showTitle"]
        vodDetail.vod_remarks = `热度:${(Math.floor(parseInt(vod_dic["hot"]) / 1000)).toString()}k,清晰度:${vod_dic["playResolutions"][0]}`
        vodDetail.vod_pic = vod_dic["showImg"]
        vodDetail.vod_director = vod_dic["director"]
        vodDetail.vod_actor = vod_dic["actors"]
        vodDetail.vod_year = vod_dic["postYear"]
        vodDetail.vod_content = vod_dic["showDesc"]
        let niBaVodDetail = getVod(vod_dic["plays"], vod_dic["playResolutions"])
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
    let play_url = "https://cn-beijing-data.aliyundrive.net/xkltJ3jk%2F3046489330%2F65805f42787d0cafb3474d8b8f5895c309e6f866%2F65805f42b8a596ba93ec4a958b33caba2db7a26e?callback=eyJjYWxsYmFja1VybCI6Imh0dHA6Ly9iajI5LmFwaS1ocC5hbGl5dW5wZHMuY29tL3YyL2ZpbGUvZG93bmxvYWRfY2FsbGJhY2siLCJjYWxsYmFja0JvZHkiOiJodHRwSGVhZGVyLnJhbmdlPSR7aHR0cEhlYWRlci5yYW5nZX1cdTAwMjZidWNrZXQ9JHtidWNrZXR9XHUwMDI2b2JqZWN0PSR7b2JqZWN0fVx1MDAyNmRvbWFpbl9pZD0ke3g6ZG9tYWluX2lkfVx1MDAyNnVzZXJfaWQ9JHt4OnVzZXJfaWR9XHUwMDI2ZHJpdmVfaWQ9JHt4OmRyaXZlX2lkfVx1MDAyNmZpbGVfaWQ9JHt4OmZpbGVfaWR9IiwiY2FsbGJhY2tCb2R5VHlwZSI6ImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCIsImNhbGxiYWNrU3RhZ2UiOiJiZWZvcmUtZXhlY3V0ZSIsImNhbGxiYWNrRmFpbHVyZUFjdGlvbiI6Imlnbm9yZSJ9&callback-var=eyJ4OmRvbWFpbl9pZCI6ImJqMjkiLCJ4OnVzZXJfaWQiOiI4YjcxOWM3MjZlZDg0MzU4YmNhOGRiMTZjZjJlMWRkOCIsIng6ZHJpdmVfaWQiOiIxMTY4NDA0IiwieDpmaWxlX2lkIjoiNjU4NTFkZGVhNWVlMjUzNTUwZTk0NDljYjBmZjdhNThkNWRmZjcwMCJ9&di=bj29&dr=1168404&f=65851ddea5ee253550e9449cb0ff7a58d5dff700&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%274k-120FPS.mp4&security-token=CAIS%2BgF1q6Ft5B2yfSjIr5fDfsDsoIdZ8oWnR3bwsUYSaNVCgaGcqDz2IHFPeHJrBeAYt%2FoxmW1X5vwSlq5rR4QAXlDfNTLCCEf2qFHPWZHInuDox55m4cTXNAr%2BIhr%2F29CoEIedZdjBe%2FCrRknZnytou9XTfimjWFrXWv%2Fgy%2BQQDLItUxK%2FcCBNCfpPOwJms7V6D3bKMuu3OROY6Qi5TmgQ41Uh1jgjtPzkkpfFtkGF1GeXkLFF%2B97DRbG%2FdNRpMZtFVNO44fd7bKKp0lQLukMWr%2Fwq3PIdp2ma447NWQlLnzyCMvvJ9OVDFyN0aKEnH7J%2Bq%2FzxhTPrMnpkSlacGoABUmUCHPYTQY%2FCdMNI6IiO3BY2wN%2BOb02x9UGr%2F7wptVQlJMuLoH6d56j2P1HAX9A4ne90NhCHQhILDCmEV%2FYFM%2FKJ8h2jTPtYw8QNW8WT%2FeNYGrV9XGpuS4xqT6SRbn3Qn3ib3SY6VJ%2BMLccDkIRH5SD3uWS4VhvgNYg%2Fv1kY508gAA%3D%3D&u=8b719c726ed84358bca8db16cf2e1dd8&x-oss-access-key-id=STS.NTv5zXMXxEGLEPAUFGdZnnd7J&x-oss-expires=1703223651&x-oss-signature=7z%2Bbh3BKsZS2ShHG4K5HUHPmXvdJqVPCq5j%2BV3Nwp3Y%3D&x-oss-signature-version=OSS2"
    await JadeLog.info(`正在解析播放页面,flag = ${flag},id:${id},flags = ${flags}`)
    return JSON.stringify({
        parse: 0,
        url: play_url,
        header: getHeader(),
        format: "application/octet-stream",
    });
}

async function search() {
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