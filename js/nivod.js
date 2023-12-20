/*
* @File     : nivod.js
* @Author   : jade
* @Date     : 2023/12/19 14:23
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {JadeLogging} from "../lib/log.js";
import {getChannelCache, getHeader, createSign, desDecrypt, ChannelResponse} from "../lib/nivid_object.js"
import {_, Uri} from "../lib/cat.js";
import {User} from "../lib/ali_object.js";
import {HomeSpiderResult} from "../lib/spider_object.js";

let ApiUrl = "https://api.nivodz.com"
let Remove18ChannelCode = 0
const JadeLog = new JadeLogging(getAppName())
let channelResponse = new ChannelResponse()
let homeSpiderResult = new HomeSpiderResult()

async function request(reqUrl) {
    let header = getHeader()
    let uri = new Uri(reqUrl);
    let response = await req(uri.toString(), {
        headers: header,
        method: "post",
        data: {},
        postType: "form"
    });
    if (response.code !== 200) {
        await JadeLog.error(`请求失败,请求url为:${uri},回复内容为${response.content}`)
        return null
    } else {
        return desDecrypt(response.content)
    }

}

function getAppName() {
    return "泥视频"
}

async function init(cfg) {
    Remove18ChannelCode = 1
    // 读取缓存
    let channelCacheStr = await getChannelCache()
    if (!_.isEmpty(channelCacheStr)) {
        try {
            channelResponse.fromJsonString(channelCacheStr,Remove18ChannelCode)
            await JadeLog.info("读取用户缓存成功", true);
        } catch (e) {
            await channelResponse.clearCache()
            await JadeLog.error("读取通道缓存失败,失败原因为:" + e);
        }
    } else {
        await JadeLog.error("读取通道缓存失败", true);
    }
}

async function home(filter) {
    await JadeLog.info("正在解析首页")
    if (channelResponse.channelList.length > 0) {
        await JadeLog.info("有缓存无需解析,首页解析内容为:" + channelResponse.toSpilder())
        return channelResponse.toSpilder()
    } else {
        let url = ApiUrl + "/show/channel/list/WEB/3.2" + await createSign()
        let content = await request(url)
        if (content !== null) {
            channelResponse.fromJsonString(content,Remove18ChannelCode)
            await channelResponse.save()
            let filterUrl = ApiUrl + "/show/filter/condition/WEB/3.2" + await createSign()
            let filterContent = await request(filterUrl)
            channelResponse.setChannelFilters(filterContent)
            await channelResponse.save()
            channelResponse.toSpilder()
            await JadeLog.info("首页解析完成,首页解析内容为:" + channelResponse.toSpilder())
            return channelResponse.toSpilder()
        } else {
            await JadeLog.error("首页解析失败")
            await channelResponse.clearCache()
            return homeSpiderResult.setHomeSpiderResult([]).toString()

        }
    }

}
async function homeVod(){

}

async function category(){

}

async function detail(){}

async function play(){}
async function search(){}
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