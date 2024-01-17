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
import {_, Uri} from "../lib/cat.js";

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

    async reconnnect(reqUrl, params, headers) {
        await this.jadeLog.error("请求失败,请检查url:" + reqUrl + ",两秒后重试")
        Utils.sleep(2)
        if (this.reconnectTimes < this.maxReconnectTimes) {
            this.reconnectTimes = this.reconnectTimes + 1
            return await this.fetch(reqUrl, params, headers)
        } else {
            await this.jadeLog.error("请求失败,重连失败")
            return null
        }
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


    async fetch(reqUrl, params, headers) {
        let data = Utils.objectToStr(params)
        let url = reqUrl
        if (!_.isEmpty(data)) {
            url = reqUrl + "?" + data
        }
        let uri = new Uri(url);
        let response = await req(uri.toString(), {
            method: "get", headers: headers, data: null,
        });
        if (response.code === 200 || response.code === undefined || response.code === 302 || response.code === 301) {
            if (response.headers["location"] !== undefined) {
                return this.fetch(response.headers["location"], params, headers)
            } else if (!_.isEmpty(response.content)) {
                this.reconnectTimes = 0
                return response.content
            } else {
                return await this.reconnnect(reqUrl, params, headers)
            }
        } else {
            await this.jadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
            return await this.reconnnect(reqUrl, params, headers)

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

    async getFilter($) {

    }

    async setClasses() {

    }

    async setFilterObj() {

    }

    async parseVodShortListFromDocBySearch($) {

    }

    async parseVodDetailFromDoc($) {

    }

    async parseVodDetailromJson(obj) {

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
        await this.jadeLog.debug(`搜索页面内容为:${this.result.search(this.vodList)}`)
        await this.jadeLog.info("搜索页面解析完成", true)
        return this.result.search(this.vodList)
    }
}


export {Spider}