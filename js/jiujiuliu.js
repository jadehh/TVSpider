/*
* @File     : jiujiuliu.js
* @Author   : jade
* @Date     : 2024/1/4 14:15
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 996影视
*/

import {Spider} from "./spider.js";

class JiuJiuLiuSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.cs1369.com"
    }

    getAppName() {
        return "🍥┃九九六影视┃🍥"
    }

    getName() {
        return "九九六影视"
    }

    async home(filter) {
        return super.home(filter);
    }

    async homeVod() {
        return super.homeVod();
    }

    async category(tid, pg, filter, extend) {
        return super.category(tid, pg, filter, extend);
    }

    async detail(id) {
        return super.detail(id);
    }

    async search(wd, quick) {
        return super.search(wd, quick);
    }

}

export function __jsEvalReturn() {

    return new JiuJiuLiuSpider();
}