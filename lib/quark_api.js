/**
 * File: /workspaces/TVSpider/lib/quark_api.js
 * Project: /workspaces/TVSpider
 * Created Date: Monday, May 20th 2024, 6:38:12 am
 * Author: jade
 * -----
 * Last Modified: Mon May 20 2024
 * Modified By: jade
 * -----
 * Copyright (c) 2024 samples
 * ------------------------------------
 * Javascript will save your soul!
 */
import {_,Crypto} from "../lib/cat.js";
import * as Utils from "../lib/utils.js"

class Quark{
    constructor(){
        this.apiUrl = "https://drive.quark.cn/1/clouddrive/"
        this.cookie = ""
        this.ckey = ""
        this.shareTokenCache = {}
        this.pr = "pr=ucpro&fr=pc"
        this.subtitleExts = ['.srt', '.ass', '.scc', '.stl', '.ttml'];
        this.saveFileIdCaches = {}
        this.saveDirId = null
    }
    async initQuark(cookie) {
        this.ckey = Crypto.enc.Hex.stringify(Crypto.MD5(cookie)).toString();
        let localCfg = await local.get("quark", "cookie");
        if (!_.isEmpty(localCfg)){
            this.cookie = JSON.parse(localCfg)[this.ckey]
        }else{
            this.cookie = cookie
        }
    }

    getHeaders(){
        return {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch',
             'Referer': 'https://pan.quark.cn',
            "Content-Type":"application/json",
            'Cookie':this.cookie,
        };
        
    }

    async api(url,data,retry,method){
        const leftRetry = retry || 3;
        let resp = await req(this.apiUrl + url,{
            method:method || "post",
            data:data,
            headers:this.getHeaders()
        })
        if (resp.headers['set-cookie']) {
            const puus = resp.headers['set-cookie'].join(';;;').match(/__puus=([^;]+)/);
            if (puus) {
                if (cookie.match(/__puus=([^;]+)/)[1] != puus[1]) {
                    cookie = cookie.replace(/__puus=[^;]+/, `__puus=${puus[1]}`);
                    let cookieDic = {}
                    cookieDic[this.ckey] = cookie
                    await local.set("quark",cookie, JSON.stringify(cookieDic));
                }
            }
        }
        if (resp.status === 429 && leftRetry > 0) {
            Utils.sleep(1)
            return await this.api(url, data, leftRetry - 1);
        }
        return JSON.parse(resp.content) || {};
    }

    getShareData(url) {
        let regex = /https:\/\/pan\.quark\.cn\/s\/([^\\|#/]+)/;
        let matches = regex.exec(url);
        if (matches) {
            return {
                shareId: matches[1],
                folderId: '0',
            };
        }
        return null;
    }
    async  getShareToken(shareData) {
        if (!this.shareTokenCache[shareData.shareId]) {
            delete this.shareTokenCache[shareData.shareId];
            const shareToken = await this.api(`share/sharepage/token?${this.pr}`, {
                pwd_id: shareData.shareId,
                passcode: shareData.sharePwd || '',
            });
            if (shareToken.data && shareToken.data.stoken) {
                this.shareTokenCache[shareData.shareId] = shareToken.data;
            }
        }
    }
    async listFile (shareData,videos,subtitles,shareId, folderId, page) {
        const prePage = 200;
        page = page || 1;
        const listData = await this.api(`share/sharepage/detail?${this.pr}&pwd_id=${shareId}&stoken=${encodeURIComponent(this.shareTokenCache[shareId].stoken)}&pdir_fid=${folderId}&force=0&_page=${page}&_size=${prePage}&_sort=file_type:asc,file_name:asc`, null,null, 'get');
        if (!listData.data) return [];
        const items = listData.data.list;
        if (!items) return [];
        const subDir = [];
        for (const item of items) {
            if (item.dir === true) {
                subDir.push(item);
            } else if (item.file === true && item.obj_category === 'video') {
                if (item.size < 1024 * 1024 * 5) continue;
                item.stoken = this.shareTokenCache[shareData.shareId].stoken;
                videos.push(item);
            } else if (item.type === 'file' && this.subtitleExts.some((x) => item.file_name.endsWith(x))) {
                subtitles.push(item);
            }
        }
        if (page < Math.ceil(listData.metadata._total / prePage)) {
            const nextItems = await this.listFile(shareData,videos,subtitles,shareId, folderId, page + 1);
            for (const item of nextItems) {
                items.push(item);
            }
        }
        for (const dir of subDir) {
            const subItems = await this.listFile(shareData,videos,subtitles,shareId, dir.fid);
            for (const item of subItems) {
                items.push(item);
            }
        }
        return items;
    };

    async getFilesByShareUrl(shareInfo){
        const shareData = typeof shareInfo === 'string' ? this.getShareData(shareInfo) : shareInfo;
        if (!shareData) return [];
        await this.getShareToken(shareData);
        if (!this.shareTokenCache[shareData.shareId]) return [];
        const videos = [];
        const subtitles = [];
        await this.listFile(shareData,videos,subtitles,shareData.shareId, shareData.folderId);
        if (subtitles.length > 0) {
            videos.forEach((item) => {
                var matchSubtitle = findBestLCS(item, subtitles);
                if (matchSubtitle.bestMatch) {
                    item.subtitle = matchSubtitle.bestMatch.target;
                }
            });
        }
    
        return videos;
    }

    clean(){
        const saves = Object.keys(this.saveFileIdCaches);
        for (const save of saves) {
            delete this.saveFileIdCaches[save];
        }
    }

    async save(shareId, stoken, fileId, fileToken, clean) {
        if (clean) {
            this.clean()
        }
        if (!this.saveDirId) return null;
        if (!stoken) {
            await this.getShareToken({
                shareId: shareId,
            });
            if (!this.shareTokenCache[shareId]) return null;
        }
        const saveResult = await this.api(`share/sharepage/save?${pr}`, {
            fid_list: [fileId],
            fid_token_list: [fileToken],
            to_pdir_fid: this.saveDirId,
            pwd_id: shareId,
            stoken: stoken || shareTokenCache[shareId].stoken,
            pdir_fid: '0',
            scene: 'link',
        });
        if (saveResult.data && saveResult.data.task_id) {
            let retry = 0;
            // wait task finish
            while (true) {
                const taskResult = await this.api(`task?${pr}&task_id=${saveResult.data.task_id}&retry_index=${retry}`, {}, {}, 'get');
                if (taskResult.data && taskResult.data.save_as && taskResult.data.save_as.save_as_top_fids && taskResult.data.save_as.save_as_top_fids.length > 0) {
                    return taskResult.data.save_as.save_as_top_fids[0];
                }
                retry++;
                if (retry > 5) break;
                await delay(1000);
            }
        }
        return false;
    }

    
    async  getLiveTranscoding(shareId, stoken, fileId, fileToken) {
        if (!saveFileIdCaches[fileId]) {
            const saveFileId = await this.save(shareId, stoken, fileId, fileToken, true);
            if (!saveFileId) return null;
            saveFileIdCaches[fileId] = saveFileId;
        }
        const transcoding = await api(`file/v2/play?${pr}`, {
            fid: saveFileIdCaches[fileId],
            resolutions: 'normal,low,high,super,2k,4k',
            supports: 'fmp4',
        });
        if (transcoding.data && transcoding.data.video_list) {
            return transcoding.data.video_list;
        }
        return null;
    }

}
export {Quark}