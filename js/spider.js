/*
* @File     : spider.js
* @Author   : jade
* @Date     : 2023/12/25 17:19
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {JadeLogging} from "../lib/log.js";
import * as Utils from "../lib/utils.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import {_, load, Uri} from "../lib/cat.js";

class Result {
    constructor() {
        this.class = []
        this.list = []
        this.filters = []
        this.header = {"User-Agent": Utils.CHROME};
        this.format = "";
        this.danmaku = "";
        this.url = "";
        this.subs = [];
        this.parse = 0
        this.jx = 0;
        this.page = 0
        this.pagecount = 0
        this.limit = 0;
        this.total = 0;
    }

    get() {
        return new Result()
    }

    home(classes, list, filters) {
        return JSON.stringify({
            "class": classes, "list": list, "filters": filters
        })
    }

    homeVod(vod_list) {
        return JSON.stringify({"page": this.page, "list": vod_list})
    }

    category(vod_list, page, count, limit, total) {
        return JSON.stringify({
            page: parseInt(page), pagecount: count, limit: limit, total: total, list: vod_list,
        });
    }

    search(vod_list) {
        return JSON.stringify({"list": vod_list})
    }

    detail(vod_detail) {
        return JSON.stringify({"list": [vod_detail]})
    }

    play(url) {
        return JSON.stringify({
            "url": url, "parse": this.parse, "header": this.header, "format": this.format, "subs": this.subs
        })
    }

    errorCategory(error_message) {
        let vodShort = new VodShort()
        vodShort.vod_name = "错误:打开无效"
        vodShort.vod_id = "error"
        vodShort.vod_pic = Utils.RESOURCEURL + "/resources/error.png"
        vodShort.vod_remarks = error_message
        return JSON.stringify({
            page: parseInt(0), pagecount: 0, limit: 0, total: 0, list: [vodShort],
        })
    }

    setClass(classes) {
        this.class = classes;
        return this;
    }

    setVod(list) {
        if (typeof list === "object" && Array.isArray(list)) {
            this.list = list;
        } else if (list !== undefined) {
            this.list = [list]
        }
        return this;
    }

    setFilters(filters) {
        this.filters = filters;
        return this;
    }

    setHeader(header) {
        this.header = header;
        return this;
    }

    setParse(parse) {
        this.parse = parse;
        return this;
    }

    setJx() {
        this.jx = 1;
        return this;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setDanmaku(danmaku) {
        this.danmaku = danmaku;
        return this;
    }

    setFormat(format) {
        this.format = format;
        return this;
    }

    setSubs(subs) {
        this.subs = subs;
        return this;
    }

    dash() {
        this.format = "application/dash+xml";
        return this;
    }

    m3u8() {
        this.format = "application/x-mpegURL";
        return this;
    }

    rtsp() {
        this.format = "application/x-rtsp";
        return this;
    }

    octet() {
        this.format = "application/octet-stream";
        return this;
    }


    setPage(page, count, limit, total) {
        this.page = page
        this.limit = limit
        this.total = total
        this.pagecount = count
        return this;
    }

    toString() {
        return JSON.stringify(this);
    }
}

class Spider {
    constructor() {
        this.siteKey = ""
        this.siteType = 0
        this.jadeLog = new JadeLogging(this.getAppName(), "DEBUG")
        this.classes = []
        this.filterObj = {}
        this.result = new Result()
        this.catOpenStatus = false
        this.reconnectTimes = 0
        this.maxReconnectTimes = 5
        this.siteUrl = ""
        this.vodList = []
        this.homeVodList = []
        this.count = 0
        this.limit = 0
        this.total = 0
        this.page = 0
        this.vodDetail = new VodDetail()
        this.playUrl = ""
        this.header = {}
    }

    async reconnnect(reqUrl, params, headers, redirect_url, return_cookie, buffer) {
        await this.jadeLog.error("请求失败,请检查url:" + reqUrl + ",两秒后重试")
        Utils.sleep(2)
        if (this.reconnectTimes < this.maxReconnectTimes) {
            this.reconnectTimes = this.reconnectTimes + 1
            return await this.fetch(reqUrl, params, headers, redirect_url, return_cookie, buffer)
        } else {
            await this.jadeLog.error("请求失败,重连失败")
            return null
        }
    }

    getClassIdList() {
        let class_id_list = []
        for (const class_dic of this.classes) {
            class_id_list.push(class_dic["type_id"])
        }
        return class_id_list
    }

    getTypeDic(type_name, type_id) {
        return {"type_name": type_name, "type_id": type_id}
    }

    async getHtml(url = this.siteUrl, headers = this.getHeader()) {
        let html = await this.fetch(url, null, headers)
        if (!_.isEmpty(html)) {
            return load(html)
        } else {
            await this.jadeLog.error(`html获取失败`, true)
        }
    }

    getClassNameList() {
        let class_name_list = []
        for (const class_dic of this.classes) {
            class_name_list.push(class_dic["type_name"])
        }
        return class_name_list
    }

    async postReconnect(reqUrl, params, headers) {
        await this.jadeLog.error("请求失败,请检查url:" + reqUrl + ",两秒后重试")
        Utils.sleep(2)
        if (this.reconnectTimes < this.maxReconnectTimes) {
            this.reconnectTimes = this.reconnectTimes + 1
            return await this.post(reqUrl, params, headers)
        } else {
            await this.jadeLog.error("请求失败,重连失败")
            return null
        }
    }

    getHeader() {
        return {"User-Agent": Utils.CHROME, "Referer": this.siteUrl + "/"};
    }

    async getResponse(reqUrl, params, headers, redirect_url, return_cookie, buffer, response) {
        {
            if (response.headers["location"] !== undefined) {
                if (redirect_url) {
                    await this.jadeLog.debug(`返回重定向连接:${response.headers["location"]}`)
                    return response.headers["location"]
                } else {
                    return this.fetch(response.headers["location"], params, headers, redirect_url, return_cookie, buffer)
                }
            } else if (response.content.length > 0) {
                this.reconnectTimes = 0
                return response.content
            } else if (!_.isEmpty(response.content)) {
                if (return_cookie) {
                    return {"cookie": response.headers["set-cookie"], "content": response.content}
                } else {
                    this.reconnectTimes = 0
                    return response.content
                }
            } else if (buffer === 1) {
                this.reconnectTimes = 0
                return response.content
            } else {
                await this.jadeLog.error(`请求失败,请求url为:${reqUrl},回复内容为:${JSON.stringify(response)}`)
                return await this.reconnnect(reqUrl, params, headers, redirect_url, return_cookie, buffer)
            }
        }
    }


    async fetch(reqUrl, params, headers, redirect_url = false, return_cookie = false, buffer = 0) {
        let data = Utils.objectToStr(params)
        let url = reqUrl
        if (!_.isEmpty(data)) {
            url = reqUrl + "?" + data
        }
        let uri = new Uri(url);
        let response;
        if (redirect_url) {
            response = await req(uri.toString(), {
                method: "get", headers: headers, buffer: buffer, data: null, redirect: 2
            })
        } else {
            response = await req(uri.toString(), {method: "get", headers: headers, buffer: buffer, data: null});
        }
        if (this.catOpenStatus) {
            if (response.code === 200 || response.code === 302 || response.code === 301) {
                return await this.getResponse(reqUrl, params, headers, redirect_url, return_cookie, buffer, response)
            } else {
                await this.jadeLog.error(`请求失败,失败原因为:状态码出错,请求url为:${uri},回复内容为:${JSON.stringify(response)}`)
                return await this.reconnnect(reqUrl, params, headers, redirect_url, return_cookie, buffer)
            }
        } else {
            if (response.code === undefined || response.code === 200) {
                return await this.getResponse(reqUrl, params, headers, redirect_url, return_cookie, buffer, response)
            } else {
                await this.jadeLog.error(`请求失败,失败原因为:状态码存在,请求url为:${uri},回复内容为:${JSON.stringify(response)}`)
                return await this.reconnnect(reqUrl, params, headers, redirect_url, return_cookie, buffer)
            }
        }

    }

    async redirect(response) {

    }


    async post(reqUrl, params, headers) {
        let uri = new Uri(reqUrl);
        let response = await req(uri.toString(), {
            method: "post", headers: headers, data: params, postType: "form"
        });
        if (response.code === 200 || response.code === undefined || response.code === 302) {
            // 重定向
            if (response.headers["location"] !== undefined) {
                return await this.redirect(response)
            } else if (!_.isEmpty(response.content)) {
                this.reconnectTimes = 0
                return response.content
            } else {
                return await this.postReconnect(reqUrl, params, headers)
            }
        } else {
            await this.jadeLog.error(`请求失败,请求url为:${reqUrl},回复内容为${JSON.stringify(response)}`)
            return await this.postReconnect(reqUrl, params, headers)

        }
    }


    getName() {
        return `🍥┃基础┃🍥`
    }

    getAppName() {
        return `基础`
    }

    async parseVodShortListFromDoc($) {

    }

    async parseVodShortListFromJson(obj) {

    }

    parseVodShortFromElement($, element) {

    }

    async parseVodShortListFromDocByCategory($) {

    }

    async getFilter($) {

    }

    async setClasses() {

    }

    async setFilterObj() {

    }

    async parseVodShortListFromDocBySearch($) {
        return []
    }

    async parseVodDetailFromDoc($) {

    }

    async parseVodDetailfromJson(obj) {

    }


    async parseVodPlayFromUrl(flag, play_url) {

    }

    async parseVodPlayFromDoc(flag, $) {

    }

    async SpiderInit(cfg) {
        try {
            this.siteKey = cfg["skey"]
            this.siteType = parseInt(cfg["stype"].toString())
            let extObj = null;
            if (typeof cfg.ext === "string") {
                await this.jadeLog.info(`读取配置文件,ext为:${cfg.ext}`)
                extObj = JSON.parse(cfg.ext)

            } else if (typeof cfg.ext === "object") {
                await this.jadeLog.info(`读取配置文件,所有参数为:${JSON.stringify(cfg)}`)
                await this.jadeLog.info(`读取配置文件,ext为:${JSON.stringify(cfg.ext)}`)
                extObj = cfg.ext
            } else {
                await this.jadeLog.error(`不支持的数据类型,数据类型为${typeof cfg.ext}`)
            }
            let boxType = extObj["box"]
            extObj["CatOpenStatus"] = boxType === "CatOpen";
            return extObj
        } catch (e) {
            await this.jadeLog.error("初始化失败,失败原因为:" + e.message)
            return {"token": null, "CatOpenStatus": false, "code": 0}
        }

    }

    async init(cfg) {
        this.cfgObj = await this.SpiderInit(cfg)
        await this.jadeLog.debug(`初始化参数为:${JSON.stringify(cfg)}`)
        this.catOpenStatus = this.cfgObj.CatOpenStatus
        try {
            if (await this.loadFilterAndClasses()) {
                await this.jadeLog.debug(`读取缓存列表和二级菜单成功`)
            } else {
                await this.jadeLog.warning(`读取缓存列表和二级菜单失败`)
                await this.writeFilterAndClasses()
            }
        } catch (e) {
            await local.set(this.siteKey, "classes", JSON.stringify([]));
            await local.set(this.siteKey, "filterObj", JSON.stringify({}));
            await this.jadeLog.error("读取缓存失败,失败原因为:" + e)
        }
        this.jsBase = await js2Proxy(true, this.siteType, this.siteKey, 'img/', {});
        this.douBanjsBase = await js2Proxy(true, this.siteType, this.siteKey, 'douban/', {});
    }

    async loadFilterAndClasses() {
        // 强制清空
        // await local.set(this.siteKey, "classes", JSON.stringify([]));
        // await local.set(this.siteKey, "filterObj", JSON.stringify({}));
        this.classes = await this.getClassesCache()
        this.filterObj = await this.getFiletObjCache()
        if (this.classes.length > 0) {
            return true
        } else {
            await local.set(this.siteKey, "classes", JSON.stringify([]));
            await local.set(this.siteKey, "filterObj", JSON.stringify({}));
            return false
        }
    }

    async writeFilterAndClasses() {
        if (this.catOpenStatus) {
            this.classes.push({"type_name": "最近更新", "type_id": "最近更新"})
        }
        await this.setClasses()
        await this.setFilterObj()
        await local.set(this.siteKey, "classes", JSON.stringify(this.classes));
        await local.set(this.siteKey, "filterObj", JSON.stringify(this.filterObj));
    }

    async getClassesCache() {
        let cacheClasses = await local.get(this.siteKey, "classes")
        if (!_.isEmpty(cacheClasses)) {
            return JSON.parse(cacheClasses)
        } else {
            return this.classes
        }
    }

    async getFiletObjCache() {
        let cacheFilterObj = await local.get(this.siteKey, "filterObj")
        if (!_.isEmpty(cacheFilterObj)) {
            return JSON.parse(cacheFilterObj)
        } else {
            return this.filterObj
        }
    }


    async setHome(filter) {
    }

    async home(filter) {
        this.vodList = []
        await this.jadeLog.info("正在解析首页类别", true)
        await this.setHome(filter)
        await this.jadeLog.debug(`首页类别内容为:${this.result.home(this.classes, [], this.filterObj)}`)
        await this.jadeLog.info("首页类别解析完成", true)
        return this.result.home(this.classes, [], this.filterObj)
    }

    async setHomeVod() {

    }

    async homeVod() {
        await this.jadeLog.info("正在解析首页内容", true)
        await this.setHomeVod()
        await this.jadeLog.debug(`首页内容为:${this.result.homeVod(this.homeVodList)}`)
        await this.jadeLog.info("首页内容解析完成", true)
        return this.result.homeVod(this.homeVodList)
    }

    async setCategory(tid, pg, filter, extend) {

    }

    async category(tid, pg, filter, extend) {
        this.page = parseInt(pg)
        await this.jadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)}`)
        if (tid === "最近更新") {
            this.page = 0
            return await this.homeVod()
        } else {
            this.vodList = []
            await this.setCategory(tid, pg, filter, extend)
            await this.jadeLog.debug(`分类页面内容为:${this.result.category(this.vodList, this.page, this.count, this.limit, this.total)}`)
            await this.jadeLog.info("分类页面解析完成", true)
            return this.result.category(this.vodList, this.page, this.count, this.limit, this.total)
        }

    }

    async setDetail(id) {

    }

    async detail(id) {
        this.vodDetail = new VodDetail();
        await this.jadeLog.info(`正在获取详情页面,id为:${id}`)
        await this.setDetail(id)
        await this.jadeLog.debug(`详情页面内容为:${this.result.detail(this.vodDetail)}`)
        await this.jadeLog.info("详情页面解析完成", true)
        this.vodDetail.vod_id = id
        return this.result.detail(this.vodDetail)
    }

    async setPlay(flag, id, flags) {
        this.playUrl = id
    }

    async play(flag, id, flags) {
        await this.jadeLog.info("正在解析播放页面", true)
        await this.setPlay(flag, id, flags)
        await this.jadeLog.debug(`播放页面内容为:${this.result.play(this.playUrl)}`)
        await this.jadeLog.info("播放页面解析完成", true)
        return this.result.setHeader(this.header).play(this.playUrl)
    }

    async setSearch(wd, quick) {

    }

    async search(wd, quick) {
        this.vodList = []
        await this.jadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick}`)
        await this.setSearch(wd, quick)
        if (this.vodList.length === 0) {
            if (wd.indexOf(" ") > -1) {
                await this.jadeLog.debug(`搜索关键词为:${wd},其中有空格,去除空格在搜索一次`)
                await this.search(wd.replaceAll(" ", "").replaceAll("﻿", ""), quick)
            }
        }
        await this.jadeLog.debug(`搜索页面内容为:${this.result.search(this.vodList)}`)
        await this.jadeLog.info("搜索页面解析完成", true)
        return this.result.search(this.vodList)
    }

    async proxy(segments, headers) {
        await this.jadeLog.debug(`正在设置反向代理 segments = ${segments.join(",")},headers = ${JSON.stringify(headers)}`)
        let what = segments[0];
        let url = Utils.base64Decode(segments[1]);
        await this.jadeLog.debug(`反向代理参数为:${url}`)
        if (what === 'img') {
            let resp;
            if (!_.isEmpty(headers)) {
                resp = await req(url, {
                    buffer: 2, headers: headers
                });
            } else {
                resp = await req(url, {
                    buffer: 2, headers: {
                        Referer: url, 'User-Agent': Utils.CHROME,
                    },
                });
            }
            return JSON.stringify({
                code: resp.code, buffer: 2, content: resp.content, headers: resp.headers,
            });
        } else if (what === "douban") {
            let vod_list = await this.doubanSearch(url)
            if (vod_list !== null) {
                let vod_pic = vod_list[0].vod_pic
                let resp;
                if (!_.isEmpty(headers)) {
                    resp = await req(vod_pic, {
                        buffer: 2, headers: headers
                    });
                } else {
                    resp = await req(vod_pic, {
                        buffer: 2, headers: {
                            Referer: vod_pic, 'User-Agent': Utils.CHROME,
                        },
                    });
                }
                return JSON.stringify({
                    code: resp.code, buffer: 2, content: resp.content, headers: resp.headers,
                });
            }
        }
        return JSON.stringify({
            code: 500, content: '',
        });
    }


    getSearchHeader() {
        const UserAgents = ["api-client/1 com.douban.frodo/7.22.0.beta9(231) Android/23 product/Mate 40 vendor/HUAWEI model/Mate 40 brand/HUAWEI  rom/android  network/wifi  platform/AndroidPad", "api-client/1 com.douban.frodo/7.18.0(230) Android/22 product/MI 9 vendor/Xiaomi model/MI 9 brand/Android  rom/miui6  network/wifi  platform/mobile nd/1", "api-client/1 com.douban.frodo/7.1.0(205) Android/29 product/perseus vendor/Xiaomi model/Mi MIX 3  rom/miui6  network/wifi  platform/mobile nd/1", "api-client/1 com.douban.frodo/7.3.0(207) Android/22 product/MI 9 vendor/Xiaomi model/MI 9 brand/Android  rom/miui6  network/wifi platform/mobile nd/1"]
        let randomNumber = Math.floor(Math.random() * UserAgents.length); // 生成一个介于0到9之间的随机整数
        return {
            'User-Agent': UserAgents[randomNumber]

        }
    }

    async parseDoubanVodShortListFromJson(obj) {
        let vod_list = []
        for (const item of obj) {
            let vod_short = new VodShort()
            vod_short.vod_id = "msearch:" + item["id"]
            if (item["title"] === undefined) {
                vod_short.vod_name = item["target"]["title"]
            } else {
                vod_short.vod_name = item["title"]
            }
            if (item["pic"] === undefined) {
                vod_short.vod_pic = item["target"]["cover_url"]
            } else {
                vod_short.vod_pic = item["pic"]["normal"]
            }
            if (item["rating"] === undefined) {
                vod_short.vod_remarks = "评分:" + item["target"]["rating"]["value"].toString()
            } else {
                vod_short.vod_remarks = "评分:" + item["rating"]["value"].toString()
            }
            vod_list.push(vod_short);
        }
        return vod_list
    }

    sign(url, ts, method = 'GET') {
        let _api_secret_key = "bf7dddc7c9cfe6f7"
        let url_path = "%2F" + url.split("/").slice(3).join("%2F")
        let raw_sign = [method.toLocaleUpperCase(), url_path, ts.toString()].join("&")
        return CryptoJS.HmacSHA1(raw_sign, _api_secret_key).toString(CryptoJS.enc.Base64)
    }

    async doubanSearch(wd) {
        let _api_url = "https://frodo.douban.com/api/v2"
        let _api_key = "0dad551ec0f84ed02907ff5c42e8ec70"
        let url = _api_url + "/search/movie"
        let date = new Date()
        let ts = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString()
        let params = {
            '_sig': this.sign(url, ts),
            '_ts': ts,
            'apiKey': _api_key,
            'count': 20,
            'os_rom': 'android',
            'q': encodeURIComponent(wd),
            'start': 0
        }
        let content = await this.fetch(url, params, this.getSearchHeader())
        if (!_.isEmpty(content)) {
            let content_json = JSON.parse(content)
            await this.jadeLog.debug(`豆瓣搜索结果:${content}`)
            return await this.parseDoubanVodShortListFromJson(content_json["items"])
        }
        return null

    }
}


export {Spider}