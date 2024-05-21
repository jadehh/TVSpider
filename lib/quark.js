/**
 * File: h:\PycharmProjects\Github\TVSpider\lib\quark.js
 * Project: h:\PycharmProjects\Github\TVSpider
 * Created Date: Monday, May 20th 2024, 4:54:26 pm
 * Author: jade
 * -----
 * Last Modified: Tue May 21 2024
 * Modified By: jade
 * -----
 * Copyright (c) 2024 samples
 * ------------------------------------
 * Javascript will save your soul!
 */

import {JadeLogging} from "./log.js";
import {Quark} from "./quark_api.js"
const quarkName = "夸克云盘"
const JadeLog = new JadeLogging(quarkName)
const quarkPlayFormatList = ["原画"]
const quark = new Quark()
async function initQuark(cookie) {
    quark.initQuark(cookie)
    await JadeLog.info("夸克云盘初始化完成", true)
}
async function detailContentQuark(share_url_list, type_name = "电影") {
    try {
        let video_items = [], sub_items = []
        for (let i=0;i<share_url_list.length;i++){
            let share_url = share_url_list[i]
            await quark.getFilesByShareUrl(i+1,share_url,video_items,sub_items)
        }
        if (video_items.length > 0) {
            await JadeLog.info(`获取播放链接成功,分享链接为:${share_url_list.join("\t")}`)
        } else {
            await JadeLog.error(`获取播放链接失败,检查分享链接为:${share_url_list.join("\t")}`)
        }
        return {"video_items":video_items,"sub_items":sub_items}
    } catch (e) {
        await JadeLog.error('获取夸克视频失败,失败原因为:' + e.message + ' 行数为:' + e.lineNumber);
    }
}

async function playContentQuark(flag, id, flags){
    let id_list = id.split("++")
    let shareId = id_list[2],stoken = id_list[3], fileId = id_list[0], fileToken = id_list[1]
    let playUrl = await quark.getDownload(shareId, stoken, fileId, fileToken,true)
    let x = 0
}

export {initQuark,detailContentQuark,playContentQuark,quarkPlayFormatList,quarkName}

