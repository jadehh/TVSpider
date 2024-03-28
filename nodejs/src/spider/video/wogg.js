/*
* @File     : wogg.js
* @Author   : jade
* @Date     : 2024-03-28 16:40:51
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {Spider} from "../spider.js";
import {spider} from "../../../../js/wogg.js";

class woggSpider extends Spider {
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
        dataBase = inReq.server.db
        await spider.spiderInit(inReq)
        if (this.getAppName().indexOf("阿里") > -1) {
            await spider.initAli(inReq.server.config["alitoken"])
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

    async setProxy(segments, headers) {
        return await spider.proxy(segments, headers);
    }

}

let baseSpider = new woggSpider()

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
async function proxy(inReq, outResp){
    return await baseSpider.proxy(inReq,outResp)
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
        fastify.get('/proxy/:what/:ids/:end', proxy);
    }, spider: {
        init: init, home: home, homeVod: homeVod, category: category, detail: detail, play: play, search: search
    }
};