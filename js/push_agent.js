/*
* @File     : push_agent.js
* @Author   : jade
* @Date     : 2024/3/6 9:30
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {Spider} from "./spider.js";
import {VodDetail} from "../lib/vod.js";

class PushSpider extends Spider {
    constructor() {
        super();
    }

    getName() {
        return "|推送|"
    }

    getAppName() {
        return "推送"
    }

    async init(cfg) {
        await this.jadeLog.debug(`初始化参数为:${JSON.parse(cfg)}`)
        await super.init(cfg)
    }

    async parseVodDetailfromJson(id) {
        let vodDetail = new VodDetail()
        vodDetail.vod_pic = "https://pic.rmb.bdstatic.com/bjh/1d0b02d0f57f0a42201f92caba5107ed.jpeg"
        vodDetail.vod_play_from = '推送';
        vodDetail.vod_play_url = '测试$' + id;
        return vodDetail
    }

    async setDetail(id) {
      this.vodDetail = await this.parseVodDetailfromJson(id)
    }
}

let spider = new PushSpider()

async function check(args) {
    await spider.jadeLog.debug(`剪切板输入内容为:${args}`)
    return true;
}

async function init(cfg) {
    await spider.init(cfg)
}

async function detail(id) {
    return await spider.detail(id)
}

async function play(flag, id, flags) {
    return await spider.play(flag, id, flags)
}

export function __jsEvalReturn() {
    return {
        support: check, init: init, detail: detail, play: play,
    };
}