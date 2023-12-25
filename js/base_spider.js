/*
* @File     : base_spider.js
* @Author   : jade
* @Date     : 2023/12/25 17:19
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
/*
* @File     : nivod.js
* @Author   : jade
* @Date     : 2023/12/19 14:23
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {JadeLogging} from "../lib/log.js";
import {HomeSpiderResult, SpiderInit} from "../lib/spider_object.js";
import {} from "../lib/crypto-js.js"
const JadeLog = new JadeLogging(getAppName(), "DEBUG")
let homeSpiderResult = new HomeSpiderResult()
let CatOpenStatus = false


function getName() {
    return `🍥┃基础┃🍥`
}

function getAppName() {
    return `基础`
}

async function init(cfg) {
    CatOpenStatus = await SpiderInit(cfg)
    // 读取缓存
}


async function home(filter) {
    await JadeLog.info("正在解析首页类别", true)
    await JadeLog.debug(`首页类别内容为:${homeSpiderResult.setHomeSpiderResult(Classes, [], Filters).toString()}`)
    await JadeLog.info("首页类别解析完成", true)
    return homeSpiderResult.setHomeSpiderResult(Classes, [], Filters).toString()
}






async function homeVod() {
    let vod_list = []
    if (!CatOpenStatus) {
        await JadeLog.info("正在解析首页内容")
    }
    await JadeLog.debug(`首页内容为:${JSON.stringify({"list": vod_list})}`)
    return JSON.stringify({"list": vod_list})
}


async function category(tid, pg, filter, extend) {
    let url = ""
    await JadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)},url = ${url}`)
}


async function detail(id) {
    return JSON.stringify({})
}

async function play(flag, id, flags) {

    return JSON.stringify({});
}


async function search(wd, quick) {
    let url = ""
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${url}`)
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