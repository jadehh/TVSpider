/*
* @File     : danmuSpider.js
* @Author   : jade
* @Date     : 2024/3/13 13:39
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {_, load, Uri} from "./cat.js";
import * as Utils from "./utils.js";
import {JadeLogging} from "./log.js";

class DammuSpider {
    constructor() {
        this.siteUrl = "https://v.qq.com"
        this.reconnectTimes = 0
        this.maxReconnectTimes = 5
        this.jadeLog = new JadeLogging(this.getAppName(), "DEBUG")
    }
    getAppName(){
        return "弹幕"
    }
    getHeader() {
        return {"User-Agent": Utils.CHROME, "Referer": this.siteUrl + "/"};
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


    async getHtml(url = this.siteUrl, headers = this.getHeader()) {
        let html = await this.fetch(url, null, headers)
        if (!_.isEmpty(html)) {
            return load(html)
        } else {
            await this.jadeLog.error(`html获取失败`, true)
        }
    }
    async parseVodShortListFromDoc($) {

    }
    async search(wd) {

    }
    async getDammu(voddetail, episodeId) {

    }
}

export {DammuSpider}