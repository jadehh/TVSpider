/*
* @File     : bilibili.js
* @Author   : jade
* @Date     : 2024/4/3 9:27
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 哔哩哔哩
*/
import {Spider} from "./spider.js";
import * as Utils from "../lib/utils.js";
import {Crypto, _, load} from "../lib/cat.js";
class BilibiliSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.bilibili.com"
        this.cookie = ""
    }
    getHeader() {
        const headers = super.getHeader();
        if (!_.isEmpty(this.cookie)) {
           headers["cookie"] = this.cookie;
        }
        return headers;
    }


    initCookie(cookie){
        this.cookie = cookie
    }

    async spiderInit() {
        let login = await this.checkLogion()
        if (login){
            await this.jadeLog.info("哔哩哔哩登录成功",true)
        }else{
            await this.jadeLog.error("哔哩哔哩登录失败",true)
        }
    }

    async init(cfg) {
        await this.initCookie(cfg["ext"]["cookie"])
        await this.spiderInit()
        await super.init(cfg);
    }

    getName() {
        return "🏰┃哔哩哔哩┃🏰"
    }

    getAppName() {
        return "哔哩哔哩"
    }

    getJSName() {
        return "bilibili"
    }

    getType() {
        return 3
    }

    async setClasses() {


    }

    async checkLogion(){
        let result = JSON.parse(await this.fetch('https://api.bilibili.com/x/web-interface/nav',null, this.getHeader()));
        return result["data"]["isLogin"]
    }

}

let spider = new BilibiliSpider()

async function init(cfg) {
    await spider.init(cfg)
}

async function home(filter) {
    return await spider.home(filter)
}

async function homeVod() {
    return await spider.homeVod()
}

async function category(tid, pg, filter, extend) {
    return await spider.category(tid, pg, filter, extend)
}

async function detail(id) {
    return await spider.detail(id)
}

async function play(flag, id, flags) {
    return await spider.play(flag, id, flags)
}

async function search(wd, quick) {
    return await spider.search(wd, quick)
}

async function proxy(segments, headers) {
    return await spider.proxy(segments, headers)
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
        proxy: proxy
    };
}

export {spider}