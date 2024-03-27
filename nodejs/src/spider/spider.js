/*
* @File     : spider.js
* @Author   : jade
* @Date     : 2024/3/22 15:17
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import "../util/global.js"
import {VodDetail, VodShort} from "../../../lib/vod.js";
import * as Utils from "../../../lib/utils.js";
import {_, load, Uri} from "../../../lib/cat.js";
import {DanmuSpider} from "../../../lib/danmuSpider.js";
import {hlsCache, tsCache} from "../../../lib/ffm3u8_open.js";
import * as HLS from "../../../lib/hls.js";
import {JadeLogging} from "../util/log.js"
import {Result} from "../../../js/spider.js";
import CryptoJS from "crypto-js";


class Spider {
    constructor() {
        this.siteKey = ""
        this.siteType = 0
        this.jadeLog = new JadeLogging(this.getAppName(), "DEBUG")
        this.classes = []
        this.filterObj = {}
        this.result = new Result()
        this.catOpenStatus = true
        this.danmuStaus = false
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
        this.episodeObj = {}
        this.danmuUrl = ""

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
                if (return_cookie) {
                    return {"cookie": response.headers["set-cookie"], "content": response.content}
                } else {
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
        if (response.code === 200 || response.code === 302 || response.code === 301 || return_cookie) {
            return await this.getResponse(reqUrl, params, headers, redirect_url, return_cookie, buffer, response)
        } else {
            await this.jadeLog.error(`请求失败,失败原因为:状态码出错,请求url为:${uri},回复内容为:${JSON.stringify(response)}`)
            return await this.reconnnect(reqUrl, params, headers, redirect_url, return_cookie, buffer)
        }
    }

    async redirect(response) {

    }


    async post(reqUrl, params, headers, postType = "form") {
        let uri = new Uri(reqUrl);
        let response = await req(uri.toString(), {
            method: "post", headers: headers, data: params, postType: postType
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
        return `?┃基础┃?`
    }

    getAppName() {
        return `基础`
    }

    getJSName() {
        return "base"
    }

    getType() {
        return 3
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


    async init(inReq, _outResp) {
        await this.jadeLog.info("初始化", true)
        try {
            this.danmuSpider = new DanmuSpider()
            this.siteKey = this.getJSName()
            this.siteType = this.getType()
            this.cfgObj = inReq.server.config[this.siteKey]
            this.deviceKey = inReq.server.prefix + '/device';
            await this.jadeLog.debug(`deviceKey:${this.deviceKey}`)
            this.db = inReq.server.db
            this.catOpenStatus = true
            this.danmuStaus = false
            try {
                if (await this.loadFilterAndClasses()) {
                    await this.jadeLog.debug(`读取缓存列表和二级菜单成功`)
                } else {
                    await this.jadeLog.warning(`读取缓存列表和二级菜单失败`)
                    await this.writeFilterAndClasses()
                }
            } catch (e) {
                await this.db.push(this.deviceKey + "classes", {})
                await this.db.push(this.deviceKey + "filterObj", {})
                await this.jadeLog.error("读取缓存失败,失败原因为:" + e, false)
            }
        } catch (e) {
            await this.jadeLog.error(`初始化失败,失败原因为:${e}`)
        }
        await this.jadeLog.info("初始化完成", true)

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
            await this.db.push(this.deviceKey + "classes", {})
            await this.db.push(this.deviceKey + "filterObj", {})
            return false
        }
    }

    async writeFilterAndClasses() {
        if (this.catOpenStatus) {
            this.classes.push({"type_name": "最近更新", "type_id": "最近更新"})
        }
        await this.setClasses()
        await this.setFilterObj()
        await this.db.push(this.deviceKey + "classes", this.classes);
        await this.db.push(this.deviceKey + "filterObj", this.filterObj);
    }

    async getClassesCache() {
        let cacheClasses = await this.db.getObjectDefault(this.deviceKey + "classes", {});
        if (!_.isEmpty(cacheClasses)) {
            return cacheClasses
        } else {
            return this.classes
        }
    }

    async getFiletObjCache() {
        let cacheFilterObj = await this.db.getObjectDefault(this.deviceKey + "filterObj", {});
        if (!_.isEmpty(cacheFilterObj)) {
            return cacheFilterObj
        } else {
            return this.filterObj
        }
    }


    async setHome(filter) {
    }

    async home(inReq, _outResp) {
        this.vodList = []
        await this.jadeLog.info("正在解析首页类别", true)
        await this.setHome()
        await this.jadeLog.debug(`首页类别内容为:${this.result.home(this.classes, [], this.filterObj)}`)
        await this.jadeLog.info("首页类别解析完成", true)
        return this.result.home(this.classes, [], this.filterObj)
    }

    async setHomeVod() {

    }

    async homeVod() {
        await this.jadeLog.info("正在解析首页内容", true)
        try {
            await this.setHomeVod()
            await this.jadeLog.debug(`首页内容为:${this.result.homeVod(this.homeVodList)}`)
            await this.jadeLog.info("首页内容解析完成", true)
            return this.result.homeVod(this.homeVodList)
        } catch (e) {
            await this.jadeLog.error(`首页内容解析失败,失败原因为:${e}`)
        }
    }

    async setCategory(tid, pg, filter, extend) {

    }

    async category(inReq, _outResp) {
        const tid = inReq.body.id;
        const pg = inReq.body.page;
        const filter = true
        const extend = inReq.body.filters
        this.page = parseInt(pg)
        await this.jadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},extend = ${JSON.stringify(extend)}`)
        if (tid === "最近更新") {
            this.page = 0
            return await this.homeVod()
        } else {
            try {
                this.vodList = []
                await this.setCategory(tid, pg, filter, extend)
                await this.jadeLog.debug(`分类页面内容为:${this.result.category(this.vodList, this.page, this.count, this.limit, this.total)}`)
                await this.jadeLog.info("分类页面解析完成", true)
                return this.result.category(this.vodList, this.page, this.count, this.limit, this.total)
            } catch (e) {
                await this.jadeLog.error(`分类页解析失败,失败原因为:${e}`)
            }

        }

    }

    async setDetail(id) {

    }


    setEpisodeCache() {
        // 记录每个播放链接的集数
        let episodeObj = {
            "vodDetail": this.vodDetail.to_dict(),
        }
        let vod_url_channels_list = this.vodDetail.vod_play_url.split("$$$")
        for (const vodItemsStr of vod_url_channels_list) {
            let vodItems = vodItemsStr.split("#")
            for (const vodItem of vodItems) {
                let episodeName = vodItem.split("$")[0].split(" ")[0]
                let episodeUrl = vodItem.split("$")[1]
                let matchers = episodeName.match(/\d+/g)
                if (matchers !== null && matchers.length > 0) {
                    episodeName = matchers[0]
                }
                episodeObj[episodeUrl] = {"episodeName": episodeName, "episodeId": episodeName}
            }
        }
        return episodeObj
    }

    async detail(inReq, _outResp) {
        const ids = !Array.isArray(inReq.body.id) ? [inReq.body.id] : inReq.body.id;
        const id = ids[0]
        this.vodDetail = new VodDetail();
        await this.jadeLog.info(`正在获取详情页面,id为:${id}`)
        try {
            await this.setDetail(id)
            await this.jadeLog.debug(`详情页面内容为:${this.result.detail(this.vodDetail)}`)
            await this.jadeLog.info("详情页面解析完成", true)
            this.vodDetail.vod_id = id
            this.episodeObj = this.setEpisodeCache()
            return this.result.detail(this.vodDetail)
        } catch (e) {
            await this.jadeLog.error("详情界面获取失败,失败原因为:" + e)
        }

    }

    async setPlay(flag, id, flags) {
        this.playUrl = id
    }

    async setDanmu(id) {
        await this.jadeLog.debug(`${JSON.stringify(this.episodeObj)}`)
        let episodeId = this.episodeObj[id]
        let vodDetail = JSON.parse(this.episodeObj["vodDetail"])
        delete vodDetail.vod_content;
        delete vodDetail.vod_play_from;
        delete vodDetail.vod_play_url;
        delete vodDetail.vod_pic;
        await this.jadeLog.debug(`正在加载弹幕,视频详情为:${JSON.stringify(vodDetail)},集数:${JSON.stringify(this.episodeObj[id])}`)
        //区分电影还是电视剧
        return await this.danmuSpider.getDammu(vodDetail, episodeId)
    }

    async play(inReq, _outResp) {
        const flag = inReq.body.flag;
        const id = inReq.body.id;
        const flags = [];
        await this.jadeLog.info(`正在解析播放页面,flag:${flag},id:${id},flags:${flags}`, true)
        try {
            let return_result;
            await this.setPlay(flag, id, flags)
            if (this.danmuStaus && !this.catOpenStatus) {
                if (!_.isEmpty(this.danmuUrl)) {
                    await this.jadeLog.debug("播放详情页面有弹幕,所以不需要再查找弹幕")
                    return_result = this.result.danmu(this.danmuUrl).play(this.playUrl)
                } else {
                    let danmuUrl;
                    try {
                        danmuUrl = await this.setDanmu(id)
                    } catch (e) {
                        await this.jadeLog.error(`弹幕加载失败,失败原因为:${e}`)
                    }
                    return_result = this.result.danmu(danmuUrl).play(this.playUrl)
                }

            } else {
                await this.jadeLog.debug("不需要加载弹幕", true)
                return_result = this.result.play(this.playUrl)

            }
            await this.jadeLog.info("播放页面解析完成", true)
            await this.jadeLog.debug(`播放页面内容为:${return_result}`)
            return return_result;

        } catch (e) {
            await this.jadeLog.error("解析播放页面出错,失败原因为:" + e)
        }

    }

    async setSearch(wd, quick) {

    }

    async search(inReq, _outResp) {
        const pg = inReq.body.page;
        const wd = inReq.body.wd;
        let quick = true
        this.vodList = []
        await this.jadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick}`)
        await this.setSearch(wd, quick)
        if (this.vodList.length === 0) {
            if (wd.indexOf(" ") > -1) {
                await this.jadeLog.debug(`搜索关键词为:${wd},其中有空格,去除空格在搜索一次`)
                await this.search(wd.replaceAll(" ", "").replaceAll("?", ""), quick)
            }
        }
        await this.jadeLog.debug(`搜索页面内容为:${this.result.search(this.vodList)}`)
        await this.jadeLog.info("搜索页面解析完成", true)
        return this.result.search(this.vodList)
    }


    async getImg(url, headers) {
        let resp;
        if (_.isEmpty(headers)) {
            headers = {Referer: url, 'User-Agent': Utils.CHROME}
        }
        resp = await req(url, {buffer: 2, headers: headers});
        try {
            Utils.base64Decode(resp.content)
            if (this.reconnectTimes < this.maxReconnectTimes) {
                Utils.sleep(2)
                this.reconnectTimes = this.reconnectTimes + 1
                return await this.getImg(url, headers)
            } else {
                await this.jadeLog.error(`图片代理获取失败,重试失败`, true)
                this.reconnectTimes = 0
                return resp
            }
        } catch (e) {
            this.reconnectTimes = 0
            return resp
        }
    }

    async setProxy(segments, headers) {
    }

    async proxy(inReq, outResp) {
        const what = inReq.params.what;
        const purl = decodeURIComponent(inReq.params.ids);
        await this.setProxy([what, purl], null)
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
        try {
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

        } catch (e) {
            await this.jadeLog.error("反向代理出错,失败原因为:" + e)
        }
    }

}


export {
    Spider
}