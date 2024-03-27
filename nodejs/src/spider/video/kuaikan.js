/*
* @File     : kuaikan.js
* @Author   : jade
* @Date     : 2024-03-27 17:25:00
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {Spider} from "../spider.js";
import {spider} from "../../../../js/kuaikan.js";

class kuaikanSpider extends Spider {
    constructor() {
        super();
    }

    getName() {
        return spider.getName()
    }

    getAppName() {
        return spider.getAppName()
    }

    getJSName() {
        return spider.getJSName()
    }

    async init(inReq, _outResp) {
        await spider.spiderInit()
        if (this.getAppName().indexOf("阿里") > -1) {
            await spider.initAli(inReq.server.config["alitoken"],inReq.server.db)
        }
        await super.init(inReq, _outResp)
    }

    async setClasses() {
        await spider.setClasses()
        this.classes = spider.classes
    }

    async setFilterObj() {
        await spider.setFilterObj()
        this.filterObj = spider.filterObj
    }


    async setHomeVod() {
        await spider.setHomeVod()
        this.homeVodList = spider.homeVodList
    }

    async setCategory(tid, pg, filter, extend) {
        await spider.setCategory(tid, pg, filter, extend)
        this.vodList = spider.vodList
    }

    async setDetail(id) {
        await spider.setDetail(id)
        this.vodDetail = spider.vodDetail
    }

    async setPlay(flag, id, flags) {
        await spider.setPlay(flag, id, flags)
        this.playUrl = spider.playUrl
        this.result = spider.result
    }

    async setSearch(wd, quick) {
        await spider.setSearch(wd, quick)
        this.vodList = spider.vodList
    }

}

let baseSpider = new kuaikanSpider()

async function init(inReq, _outResp) {
    return await baseSpider.init(inReq, _outResp)
}

async function home(inReq, _outResp) {
    return await baseSpider.home(inReq, _outResp)
}

async function homeVod(inReq, _outResp) {
    return await baseSpider.homeVod(inReq, _outResp)
}

async function category(inReq, _outResp) {
    return await baseSpider.category(inReq, _outResp)
}

async function detail(inReq, _outResp) {
    return await baseSpider.detail(inReq, _outResp)
}

async function play(inReq, _outResp) {
    return await baseSpider.play(inReq, _outResp)
}

async function search(inReq, _outResp) {
    return await baseSpider.search(inReq, _outResp)
}

export default {
    meta: {
        key: spider.getJSName(), name: spider.getName(), type: spider.getType(),
    }, api: async (fastify) => {
        fastify.post('/init', init);
        fastify.post('/home', home);
        fastify.post('/category', category);
        fastify.post('/detail', detail);
        fastify.post('/play', play);
        fastify.post('/search', search);
    }, spider: {
        init: init, home: home, homeVod: homeVod, category: category, detail: detail, play: play, search: search
    }
};