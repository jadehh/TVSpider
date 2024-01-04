/*
* @File     : spider.js
* @Author   : jade
* @Date     : 2023/12/25 17:19
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {JadeLogging} from "../lib/log.js";
import {Result, SpiderInit} from "../lib/spider_object.js";
import {} from "../lib/crypto-js.js"
import * as Utils from "../lib/utils.js";
import {VodDetail} from "../lib/vod.js";
import {_, Uri} from "../lib/cat.js";


class Spider {
    constructor() {
        this.jadeLog = new JadeLogging(this.getAppName(), "DEBUG")
        this.classes = []
        this.filterObj = {}
        this.result = new Result()
        this.catOpenStatus = false
        this.reconnectTimes = 0
        this.maxReconnectTimes = 5
        this.siteUrl = ""
        this.vodList = []
        this.count = 0
        this.limit = 0
        this.total = 0
        this.page = 0
        this.vodDetail = new VodDetail()
        this.playUrl = ""
    }

    async reconnnect(fetch, reqUrl, params, headers) {
        await this.jadeLog.error("请求失败,请检查url:" + reqUrl + ",两秒后重试")
        Utils.sleep(2)
        if (this.reconnectTimes < this.maxReconnectTimes) {
            this.reconnectTimes = this.reconnectTimes + 1
            return await fetch(reqUrl, params, headers)
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
                return await this.reconnnect(this.fetch, reqUrl, params, headers)
            }
        } else {
            await this.jadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
            return await this.reconnnect(this.fetch, reqUrl, params, headers)

        }
    }

    async post(url, params, headers) {

    }


    getName() {
        return `🍥┃基础┃🍥`
    }

    getAppName() {
        return `基础`
    }
    parseVodShortListFromDoc($){

    }
    parseVodDetailFromDoc($){

    }

    async init(cfg) {
        console.debug(this)
        let obj = await SpiderInit(cfg)
        this.catOpenStatus = obj.CatOpenStatus
        // 读取缓存
    }
    async setHome(filter) {
    }
    async home(filter) {
        this.vodList = []
        await this.jadeLog.info("正在解析首页类别", true)
        await this.setHome(filter)
        await this.jadeLog.debug(`首页类别内容为:${this.result.home(this.classes, this.vodList, this.filterObj)}`)
        await this.jadeLog.info("首页类别解析完成", true)
        return this.result.home(this.classes, this.vodList, this.filterObj)
    }
    async setHomeVod() {

    }
    async homeVod() {
        if (!this.catOpenStatus) {
            this.vodList = []
            await this.jadeLog.info("正在解析首页内容", true)
            await this.setHomeVod()
            await this.jadeLog.debug(`首页内容为:${this.result.homeVod(this.vodList)}`)
            await this.jadeLog.info("首页内容解析完成", true)
            return this.result.homeVod(this.vodList)
        } else {
            await this.jadeLog.info("CatVodOpen无需解析首页", true)

        }
    }
    async setCategory(tid, pg, filter, extend) {

    }
    async category(tid, pg, filter, extend) {
        this.vodList = []
        await this.jadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)}`)
        await this.setCategory(tid, pg, filter, extend)
        await this.jadeLog.debug(`分类页面内容为:${this.result.category(this.vodList, this.page, this.count, this.limit, this.total)}`)
        await this.jadeLog.info("分类页面解析完成", true)
        return this.result.category(this.vodList, this.page, this.count, this.limit, this.total)
    }
    async setDetail(id) {

    }
    async detail(id) {
        await this.jadeLog.info(`正在获取详情页面,id为:${id}`)
        await this.setDetail(id)
        await this.jadeLog.debug(`详情页面内容为:${this.result.detail(this.vodDetail)}`)
        await this.jadeLog.info("详情页面解析完成", true)
        return this.result.detail(this.vodDetail)
    }
    async setPlay(flag, id, flags) {

    }
    async play(flag, id, flags) {
        await this.jadeLog.info("正在解析播放页面", true)
        await this.setPlay(flag, id, flags)
        await this.jadeLog.debug(`播放页面内容为:${this.result.play(this.playUrl)}`)
        await this.jadeLog.info("播放页面解析完成", true)
        return this.result.play(this.playUrl)
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