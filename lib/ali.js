/*
 * @Author: samples jadehh@live.com
 * @Date: 2023-12-14 11:03:04
 * @LastEditors: samples jadehh@live.com
 * @LastEditTime: 2023-12-14 11:03:04
 * @FilePath: lib/ali.js
 * @Description: 阿里云盘Spider公共
 */
import {getVod, initSome,clearFile,playerContent, playerContentByFlag, setShareId, setToken} from './ali_api.js';
import {JadeLogging} from "./log.js";

const JadeLog = new JadeLogging("阿里云盘")


async function initAli(cfg) {
    let token = cfg["ext"];
    await initSome();
    await setToken(token);
    await clearFile();
    await JadeLog.info("阿里云盘初始化完成", true)
}



function getShareId(share_url) {
    let patternAli = /https:\/\/www\.alipan\.com\/s\/([^\\/]+)(\/folder\/([^\\/]+))?|https:\/\/www\.aliyundrive\.com\/s\/([^\\/]+)(\/folder\/([^\\/]+))?/
    let matches = patternAli.exec(share_url)
    const filteredArr = matches.filter(item => item !== undefined);
    if (filteredArr.length > 1) {
        return filteredArr[1]
    } else {
        return ""
    }
}

async function detailContent(share_url) {
    try {
        let share_id = getShareId(share_url)
        await setShareId(share_id)
        return await getVod(share_url, "")
    } catch (e) {
        await JadeLog.error('获取阿里视频失败,失败原因为:' + e.message + ' 行数为:' + e.lineNumber);
    }
}

async function playContent(flag, id, flags) {
    if (flags.length > 0) {
        await JadeLog.info(`准备播放,播放类型为:${flag},播放文件Id为:${id},播放所有类型为:${flags.join("")}`)
    } else {
        await JadeLog.info(`准备播放,播放类型为:${flag},播放文件Id为:${id},播放所有类型为:${flags.join("")}`)
    }
    let file_id_list = id.split("+")
    return flag === "原画" ? await playerContent(file_id_list) : await playerContentByFlag(file_id_list, flag);
}

export {
    initAli,
    detailContent,
    playContent
};