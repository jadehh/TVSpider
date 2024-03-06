/*
* @File     : push_agent.js
* @Author   : jade
* @Date     : 2024/3/6 9:30
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {Spider} from "./spider.js";
class PushAgent extends Spider {
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
        // cfg["skey"] 必须为push_agent 才能再界面上显示点击按钮
        await this.jadeLog.debug(`初始化参数为:${JSON.parse(cfg)}`)
        await super.init(cfg)
    }
    async setDetail(pushStr) {
    }



}
let spider = new PushAgent()
async function check(args) {
    /**
     * @params 字符串 -> 剪贴板|内容
     * @return 布尔 -> 该是否支持通过CatVod播放
    */
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
        support: check,
        init: init,
        detail: detail,
        play: play,
    };
}