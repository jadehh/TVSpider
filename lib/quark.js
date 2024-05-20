/**
 * File: h:\PycharmProjects\Github\TVSpider\lib\quark.js
 * Project: h:\PycharmProjects\Github\TVSpider
 * Created Date: Monday, May 20th 2024, 4:54:26 pm
 * Author: jade
 * -----
 * Last Modified: Mon May 20 2024
 * Modified By: jade
 * -----
 * Copyright (c) 2024 samples
 * ------------------------------------
 * Javascript will save your soul!
 */

import {JadeLogging} from "./log.js";
import {Quark} from "./quark_api.js"
const JadeLog = new JadeLogging("夸克云盘")
const quark = new Quark()
async function initQuark(cookie) {
    quark.initQuark(cookie)
    // await clearFile();
    await JadeLog.info("夸克云盘初始化完成", true)
}

async function quarkDetailContent(share_url_list, type_name = "电影") {
    try {
        let video_items = [], sub_items = []
        for (const share_url of share_url_list) {
            let videos = await quark.getFilesByShareUrl(share_url)
            video_items = [... video_items,... videos.video_items]
            sub_items = [... sub_items,... videos.sub_items]
        }
        if (video_items.length > 0) {
            await JadeLog.info(`获取播放链接成功,分享链接为:${share_url_list.join("\t")}`)
        } else {
            await JadeLog.error(`获取播放链接失败,检查分享链接为:${share_url_list.join("\t")}`)
        }
        return getVod(video_items, sub_items, type_name)
    } catch (e) {
        await JadeLog.error('获取夸克视频失败,失败原因为:' + e.message + ' 行数为:' + e.lineNumber);
    }
}

async function getVod(video_item_list, sub_item_list, type_name) {
    for (const video_item of video_item_list) {
        episode_list.push(video_item.getDisplayName(type_name) + "$" + video_item.getFileId() + "+" + video_item.shareId + "+" + video_item.shareToken + findSubs(video_item.getName(), sub_item_list));
    }
    for (let index = 0; index < play_foramt_list.length; index++) {
        episode_str_list.push(episode_list.join("#"));
    }
    return {
        vod_play_url: episode_str_list.join("$$$"), vod_play_from: play_foramt_list.map(item => item).join("$$$"),
    };
}

export {initQuark,quarkDetailContent}

