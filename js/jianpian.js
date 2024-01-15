/*
* @File     : jianpian.js
* @Author   : jade
* @Date     : 2024/1/15 10:32
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {Spider} from "./spider.js";
import {load, _} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";


class JianPianSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "http://api2.rinhome.com"
    }

    getName() {
        return "🌼|荐片|🌼"
    }

    getAppName() {
        return "|荐片|"
    }

    getHeader() {
        return {"User-Agent": "jianpian-android/360", "JPAUTH": "y261ow7kF2dtzlxh1GS9EB8nbTxNmaK/QQIAjctlKiEv"}
    }

    async init(cfg) {
        await super.init(cfg);
    }

    async parseVodShortListFromJson(data_list) {
        let vod_list = [];
        for (const data of data_list) {
            let vodShort = new VodShort();
            vodShort.vod_id = data["id"]
            if (data["path"] !== undefined) {
                vodShort.vod_pic = data["path"]
            } else {
                vodShort.vod_pic = data["thumbnail"]
            }
            vodShort.vod_name = data["title"]
            if (this.catOpenStatus) {
                vodShort.vod_remarks = `评分:${data["score"]}`
            } else {
                if (data["playlist"] !== undefined) {
                    vodShort.vod_remarks = `评分:${data["score"]}` + data["playlist"]["title"]
                } else {
                    vodShort.vod_remarks = `评分:${data["score"]}`
                }
            }
            vod_list.push(vodShort)
        }
        return vod_list
    }


    objToList(list, key, split_value = "*") {
        let value_list = []
        for (const dic of list) {
            value_list.push(dic[key])
        }
        return value_list.join(split_value)
    }

    async parseVodDetailromJson(obj) {
        let vodDetail = new VodDetail();
        vodDetail.vod_id = obj["id"]
        vodDetail.vod_year = obj["year"]["title"]
        vodDetail.vod_pic = obj["thumbnail"]
        vodDetail.type_name = this.objToList(obj["types"], "name")
        vodDetail.vod_name = obj["title"]
        vodDetail.vod_content = obj["description"]
        vodDetail.vod_area = obj["area"]["title"]
        vodDetail.vod_director = this.objToList(obj["directors"], "name")
        vodDetail.vod_actor = this.objToList(obj["actors"], "name")
        vodDetail.vod_remarks = "评分:" + obj["score"]
        let playKeyList = [
            {"btbo_downlist": "btbo"},
            {"xunlei_downlist": "迅雷",},
            {"m3u8_downlist": "m3u8"},
            {"new_ftp_list": "new_ftp"},
            {"new_m3u8_list": "new_m3u8"}
        ]
        let playlist = {}
        for (const dic of playKeyList) {
            let key = Object.keys(dic)[0]
            let value = Object.values(dic)[0]
            if (obj[key].length > 0) {
                let url_str_list = []
                for (const  dic of obj[key]){
                   url_str_list.push( dic["title"] + "$" + dic["url"])
                }
                playlist[value] = url_str_list.join("#")
            }
        }
        vodDetail.vod_play_url = _.values(playlist).join('$$$');
        vodDetail.vod_play_from = _.keys(playlist).join('$$$');
        return vodDetail
    }


    async setClasses() {
        let type_name_list = ["全部", "电影", "电视剧", "动漫", "综艺"]
        let type_id_list = ["0", "1", "2", "3", "4"]
        for (let i = 0; i < type_name_list.length; i++) {
            let type_name = type_name_list[i]
            let type_id = type_id_list[i]
            this.classes.push({"type_name": type_name, "type_id": type_id})
        }
    }

    async setFilterObj() {
        this.filterObj = {
            "0": [{
                "key": "year",
                "name": "年代",
                "value": [{"n": "全部", "v": "0"}, {"n": "2023", "v": "153"}, {"n": "2022", "v": "101"}, {
                    "n": "2021",
                    "v": "118"
                }, {"n": "2020", "v": "16"}, {"n": "2019", "v": "7"}, {"n": "2018", "v": "2"}, {
                    "n": "2017",
                    "v": "3"
                }, {"n": "2016", "v": "22"}]
            }, {
                "key": "sort",
                "name": "排序",
                "value": [{"n": "更新", "v": "update"}, {"n": "热门", "v": "hot"}, {"n": "评分", "v": "rating"}]
            }],
            "1": [{
                "key": "cateId",
                "name": "分类",
                "value": [{"n": "全部", "v": "1"}, {"n": "首推", "v": "5"}, {"n": "动作", "v": "6"}, {
                    "n": "喜剧",
                    "v": "7"
                }, {"n": "战争", "v": "8"}, {"n": "恐怖", "v": "9"}, {"n": "剧情", "v": "10"}, {
                    "n": "爱情",
                    "v": "11"
                }, {"n": "科幻", "v": "12"}, {"n": "动画", "v": "13"}]
            }, {
                "key": "year",
                "name": "年代",
                "value": [{"n": "全部", "v": "0"}, {"n": "2023", "v": "153"}, {"n": "2022", "v": "101"}, {
                    "n": "2021",
                    "v": "118"
                }, {"n": "2020", "v": "16"}, {"n": "2019", "v": "7"}, {"n": "2018", "v": "2"}, {
                    "n": "2017",
                    "v": "3"
                }, {"n": "2016", "v": "22"}]
            }, {
                "key": "sort",
                "name": "排序",
                "value": [{"n": "热门", "v": "hot"}, {"n": "评分", "v": "rating"}, {"n": "更新", "v": "update"}]
            }],
            "2": [{
                "key": "cateId",
                "name": "分类",
                "value": [{"n": "全部", "v": "2"}, {"n": "首推", "v": "14"}, {"n": "国产", "v": "15"}, {
                    "n": "港台",
                    "v": "16"
                }, {"n": "日韩", "v": "17"}, {"n": "海外", "v": "18"}]
            }, {
                "key": "year",
                "name": "年代",
                "value": [{"n": "全部", "v": "0"}, {"n": "2023", "v": "153"}, {"n": "2022", "v": "101"}, {
                    "n": "2021",
                    "v": "118"
                }, {"n": "2020", "v": "16"}, {"n": "2019", "v": "7"}, {"n": "2018", "v": "2"}, {
                    "n": "2017",
                    "v": "3"
                }, {"n": "2016", "v": "22"}]
            }, {
                "key": "sort",
                "name": "排序",
                "value": [{"n": "热门", "v": "hot"}, {"n": "评分", "v": "rating"}, {"n": "更新", "v": "update"}]
            }],
            "3": [{
                "key": "cateId",
                "name": "分类",
                "value": [{"n": "全部", "v": "3"}, {"n": "首推", "v": "19"}, {"n": "海外", "v": "20"}, {
                    "n": "日本",
                    "v": "21"
                }, {"n": "国产", "v": "22"}]
            }, {
                "key": "year",
                "name": "年代",
                "value": [{"n": "全部", "v": "0"}, {"n": "2023", "v": "153"}, {"n": "2022", "v": "101"}, {
                    "n": "2021",
                    "v": "118"
                }, {"n": "2020", "v": "16"}, {"n": "2019", "v": "7"}, {"n": "2018", "v": "2"}, {
                    "n": "2017",
                    "v": "3"
                }, {"n": "2016", "v": "22"}]
            }, {
                "key": "sort",
                "name": "排序",
                "value": [{"n": "热门", "v": "hot"}, {"n": "评分", "v": "rating"}, {"n": "更新", "v": "update"}]
            }],
            "4": [{
                "key": "cateId",
                "name": "分类",
                "value": [{"n": "全部", "v": "4"}, {"n": "首推", "v": "23"}, {"n": "国产", "v": "24"}, {
                    "n": "海外",
                    "v": "25"
                }, {"n": "港台", "v": "26"}]
            }, {
                "key": "year",
                "name": "年代",
                "value": [{"n": "全部", "v": "0"}, {"n": "2023", "v": "153"}, {"n": "2022", "v": "101"}, {
                    "n": "2021",
                    "v": "118"
                }, {"n": "2020", "v": "16"}, {"n": "2019", "v": "7"}, {"n": "2018", "v": "2"}, {
                    "n": "2017",
                    "v": "3"
                }, {"n": "2016", "v": "22"}]
            }, {
                "key": "sort",
                "name": "排序",
                "value": [{"n": "热门", "v": "hot"}, {"n": "评分", "v": "rating"}, {"n": "更新", "v": "update"}]
            }]
        }
    }

    async setHome(filter) {
        await this.setClasses()
        await this.setFilterObj()
        let content = await this.fetch(this.siteUrl + "/api/tag/hand?code=unknown601193cf375db73d&channel=wandoujia", null, this.getHeader())
        if (!_.isEmpty(content)) {
            let content_json = JSON.parse(content)
            let data_list = content_json["data"][0]["video"]
            this.homeVodList = await this.parseVodShortListFromJson(data_list)
        }
    }


    async setCategory(tid, pg, filter, extend) {
        let cateId = extend["cateId"] ?? tid
        let area = extend["area"] ?? "0";
        let year = extend["year"] ?? "0";
        let by = extend["by"] ?? "hot";
        this.limit = 24
        let categoryUrl = this.siteUrl + `/api/crumb/list?area=${area}&category_id=${cateId}&page=${pg}&type=0&limit=24&sort=${by}&year=${year}`
        await this.jadeLog.debug(`分类URL:${categoryUrl}`)
        let content = await this.fetch(categoryUrl, null, this.getHeader())
        if (!_.isEmpty(content)) {
            let content_json = JSON.parse(content)
            let data = content_json["data"]
            this.vodList = await this.parseVodShortListFromJson(data)
        }
    }

    async setDetail(id) {
        let url = this.siteUrl + "/api/node/detail?channel=wandoujia&token=&id=" + id;
        let content = await this.fetch(url, null, this.getHeader())
        if (!_.isEmpty(content)) {
            let content_json = JSON.parse(content);
            let data_list = content_json["data"]
            this.vodDetail = await this.parseVodDetailromJson(data_list)
        }
    }


    async setSearch(wd, quick) {
        let url = this.siteUrl + "/api/video/search?page=1" + "&key=" + wd;
        const content = await this.fetch(url, null, this.getHeader());
        if (!_.isEmpty(content)) {
            let content_json = JSON.parse(content)
            let data_list = content_json["data"]
            this.vodList = await this.parseVodShortListFromJson(data_list)
        }
    }

    async setPlay(flag, id, flags) {
        this.playUrl = id
    }


}


let spider = new JianPianSpider()

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
