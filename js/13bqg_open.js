/*
* @File     : 13bqg_open.js.js
* @Author   : jade
* @Date     : 2024/1/30 15:38
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {_} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";

class BQQSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://4kysxz.top"
    }

    getAppName() {
        return "笔趣阁"
    }

    getName() {
        return "📚︎|笔趣阁|📚︎"
    }

    async init(cfg) {
        await super.init(cfg);
    }

}

let spider = new BQQSpider()

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



