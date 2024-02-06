/*
* @File     : feifan.js
* @Author   : jade
* @Date     : 2024/02/06 14:58
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : 非凡资源
*/
import {_} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";

class FeiFanSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "http://cj.ffzyapi.com"
        this.remove18 = true
        this.type_id_18 = 34
    }

    getAppName() {
        return "非凡资源"
    }

    getName() {
        return "🥗|非凡资源|🥗"
    }


    async parseVodShortListFromJson(obj, isSearch = false) {
        let vod_list = []
        let vodShort;
        for (const vod_data of obj["list"]) {
            if (!isSearch) {
                vodShort = this.parseVodDetail(vod_data)
            } else {
                vodShort = new VodShort();
                vodShort.vod_pic = this.detailProxy + Utils.base64Encode(vod_data["vod_id"])
                vodShort.vod_id = vod_data["vod_id"]
                vodShort.vod_name = vod_data["vod_name"]
                vodShort.vod_remarks = vod_data["vod_remarks"]
            }
            if (this.remove18 && vod_data["type_id"] !== this.type_id_18) {
                vod_list.push(vodShort)
            }
            if (!this.remove18 && vod_data["type_id"] === this.type_id_18) {
                vod_list.push(vodShort)
            }

        }
        return vod_list
    }

    parseVodDetail(vod_data) {
        let vodDetail = new VodDetail()
        vodDetail.vod_id = vod_data["vod_id"]
        vodDetail.vod_name = vod_data["vod_name"]
        vodDetail.vod_pic = vod_data["vod_pic"]
        vodDetail.vod_remarks = vod_data["vod_remarks"]
        vodDetail.vod_area = vod_data["vod_area"]
        vodDetail.vod_year = vod_data["vod_year"]
        vodDetail.vod_actor = vod_data["vod_actor"]
        vodDetail.vod_director = vod_data["vod_director"]
        vodDetail.vod_content = vod_data["vod_content"]
        vodDetail.vod_play_from = vod_data["vod_play_from"]
        vodDetail.vod_play_url = vod_data["vod_play_url"]
        vodDetail.type_name = vod_data["type_name"]
        return vodDetail
    }

    async parseVodDetailfromJson(obj) {
        let vodDetail;
        let vod_data_list = obj["list"]
        if (vod_data_list.length > 0) {
            let vod_data = vod_data_list[0]
            vodDetail = this.parseVodDetail(vod_data)
        }
        return vodDetail
    }

    async setClasses() {
        let content = await this.fetch(this.siteUrl + "/api.php/provide/vod/from", {"ac": "list"}, this.getHeader())
        let content_json = JSON.parse(content)
        for (const class_dic of content_json["class"]) {
            if (class_dic["type_pid"] === 0) {
                this.classes.push(this.getTypeDic(class_dic["type_name"], class_dic["type_id"]))
            }
        }
    }

    async setFilterObj() {
        let content = await this.fetch(this.siteUrl + "/api.php/provide/vod/from", {"ac": "list"}, this.getHeader())
        let content_json = JSON.parse(content)
        for (const root_class_dic of this.classes) {
            let type_id = root_class_dic["type_id"].toString()
            if (type_id !== "最近更新") {
                let extend_dic = {"key": "1", "name": "分类", "value": [{"n": "全部", "v": type_id}]}
                for (const class_dic of content_json["class"]) {
                    let type_name = class_dic["type_name"]
                    if (type_name === this.type_name_18) {
                        this.type_id_18 = class_dic["type_id"].toString()
                    }
                    if (this.remove18) {
                        if (class_dic["type_pid"] === root_class_dic["type_id"] && type_name !== this.type_name_18) {
                            extend_dic["value"].push({"n": type_name, "v": class_dic["type_id"].toString()})
                        }
                    } else {
                        if (class_dic["type_pid"] === root_class_dic["type_id"] && type_name === this.type_name_18) {
                            extend_dic["value"].push({"n": type_name, "v": class_dic["type_id"].toString()})
                        }
                    }

                }
                if (!this.remove18) {
                    this.classes = [this.getTypeDic(this.type_name_18, this.type_id_18)]
                } else {
                    this.filterObj[type_id] = [extend_dic]
                }
            }
        }
    }

    async setHomeVod() {
        let content = await this.fetch(this.siteUrl + "/index.php/ajax/data", {
            "mid": "1", "pg": "1", "limit": 20
        }, this.getHeader())
        this.homeVodList = await this.parseVodShortListFromJson(JSON.parse(content))
    }

    async setDetail(id) {
        let content = await this.fetch(this.siteUrl + "/api.php/provide/vod", {
            "ac": "detail", "ids": id
        }, this.getHeader())
        this.vodDetail = await this.parseVodDetailfromJson(JSON.parse(content))
    }

    async setCategory(tid, pg, filter, extend) {
        tid = extend["1"] ?? tid
        let url = this.siteUrl + `/index.php/ajax/data?mid=1&tid=${tid}&page=${pg}&limit=20`
        let content = await this.fetch(url, null, this.getHeader())
        this.vodList = await this.parseVodShortListFromJson(JSON.parse(content))
    }

    async setSearch(wd, quick) {
        let content = await this.fetch(this.siteUrl + "/api.php/provide/vod/", {"wd": wd}, this.getHeader())
        this.vodList = await this.parseVodShortListFromJson(JSON.parse(content), true)
    }

    async proxy(segments, headers) {
        await this.jadeLog.debug(`正在设置反向代理 segments = ${segments.join(",")},headers = ${JSON.stringify(headers)}`)
        let what = segments[0];
        let url = Utils.base64Decode(segments[1]);
        await this.jadeLog.debug(`反向代理参数为:${url}`)
        if (what === 'detail') {
            let content = await this.fetch(this.siteUrl + "/api.php/provide/vod", {
                "ac": "detail", "ids": url
            }, this.getHeader())
            let vod_detail = await this.parseVodDetailfromJson(JSON.parse(content))
            let pic_content = await this.fetch(vod_detail.vod_pic, null, this.getHeader(), false, false, 2)
            if (!_.isEmpty(pic_content)) {
                return JSON.stringify({
                    code: 200, buffer: 2, content: pic_content, headers: {},
                });
            } else {
                return JSON.stringify({
                    code: 500, buffer: 2, content: "", headers: {},
                });
            }
        }
    }


}

let spider = new FeiFanSpider()

async function init(cfg) {
    await spider.init(cfg)
}

async function home(filter) {
    return await spider.home(filter)
}

async function homeVod() {
    return await spider.homeVod()
}

async function category(tid, pg, filter, extend) {
    return await spider.category(tid, pg, filter, extend)
}

async function detail(id) {
    return await spider.detail(id)
}

async function play(flag, id, flags) {
    return await spider.play(flag, id, flags)
}

async function search(wd, quick) {
    return await spider.search(wd, quick)
}

async function proxy(segments, headers) {
    return await spider.proxy(segments, headers)
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
        proxy: proxy
    };
}