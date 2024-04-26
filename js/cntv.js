/*
* @File     : cntv.js
* @Author   : jade
* @Date     : 2024/4/25 10:26
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {Spider} from "./spider.js";
import {_} from "../lib/cat.js";
import * as Utils from "../lib/utils.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import * as util from "util";

class CNTVSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://tv.cctv.com/m/index.shtml"
        this.apiUrl = "https://api.app.cctv.com"

    }

    getName() {
        return "🤵‍♂️┃中央影视┃🤵‍♂️"
    }

    getAppName() {
        return "中央影视"
    }

    getJSName() {
        return "cntv"
    }

    getType() {
        return 3
    }


    async getFilterByLive(dataList) {
        let extend_list = []
        let extend_dic = {"key": "live", "name": "直播", "value": []}
        for (const data of dataList) {
            if (data["appBarTitle"] !== "最近常看") {
                extend_dic["value"].push({"n": data["appBarTitle"], "v": data["pageId"]})
            }
        }
        extend_list.push(extend_dic)
        return extend_list
    }


    async getFilterByTv(dataList) {
        let extend_list = []
        for (const data of dataList) {
            let extend_dic = {"key": data["classname"], "name": data["title"], "value": []}
            for (const extendData of data["items"]) {
                extend_dic["value"].push({"n": extendData["title"], "v": extendData["brief"]})
            }
            extend_list.push(extend_dic)
        }
        return extend_list
    }

    async setClasses() {
        let liveTypeId = "cctvlive"
        let liveApi = this.apiUrl + `/api/navigation/iphone/AppStore/7.9.4/${liveTypeId}`
        let liveJson = JSON.parse(await this.fetch(liveApi, null, this.getHeader()))
        let extend_list = await this.getFilterByLive(liveJson["data"]["templates"])
        let defaultLiveId = extend_list[0]["value"][0]["v"]
        this.classes.push(this.getTypeDic("直播", defaultLiveId))
        this.filterObj[defaultLiveId] = extend_list
        let tvApi = "https://cbox.cctv.com/cboxpcvip/online2022/yxg/data1.jsonp?=pk"
        let tvContent = await this.fetch(tvApi, null, this.getHeader())
        let tvJSon = JSON.parse(tvContent.replaceAll("pk(", "").replaceAll(")", ""))
        for (const data of tvJSon["data"]) {
            let typeName = data["title"]
            this.classes.push(this.getTypeDic(typeName, typeName))
            this.filterObj[typeName] = await this.getFilterByTv(data["templates"])

        }
    }

    parseVodShortByJson(items) {
        let vod_list = []
        for (const item of items) {
            let vodShort = new VodShort()
            vodShort.vod_pic = item["img1"]
            if (_.isEmpty(vodShort.vod_pic)) {
                vodShort.vod_pic = item["epgHorizontalPic"]
                vodShort.vod_id = "live-" + item["epgChnlChar"] + "-" + vodShort.vod_pic
            } else {
                vodShort.vod_id = "play-" + item["playid"] + "-" + vodShort.vod_pic
                vodShort.vod_pic = item["img1"]
            }
            vodShort.vod_name = item["title"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    parseVodShortByTvJson(items) {
        let vod_list = []
        for (const item of items) {
            let vodShort = new VodShort()
            vodShort.vod_id = "play-" + item["id"]
            vodShort.vod_name = item["title"]
            vodShort.vod_pic = item["image"]
            vodShort.vod_remarks = item["sc"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodShortListFromJson(objList) {
        let vod_list = []
        let top_status = false
        for (const data of objList) {
            if (data["title"] === "今日热点") {
                top_status = true
            } else if (!_.isEmpty(data["title"])) {
                if (top_status) {
                    break
                }
            }
            if (top_status) {
                vod_list = [...vod_list, ...this.parseVodShortByJson(data["items"])]
            }
        }
        return vod_list
    }

    async getLiveUrl(channel_id, obj) {
        let liveApiUrl = `https://vdn.live.cntv.cn/api2/live.do?channel=pa://cctv_p2p_hd${channel_id}`
        let liveResponse = await req(liveApiUrl, {"headers": this.getHeader()})
        let liveJson = JSON.parse(liveResponse["content"])
        let playList = {}
        playList["直播"] = ["点击播放$" + liveJson["hls_url"]["hls1"]]
        await this.jadeLog.info(`liveJson:${JSON.stringify(liveJson)}`)
        let vod_items = []
        for (const data of obj["program"]) {
            let episodeName = data["showTime"] + "-" + data["t"]
            let episodeUrl = liveJson["hls_url"]["hls1"] + `?begintimeabs=${data["st"] * 1000}&endtimeabs=${data["et"] * 1000}`
            vod_items.push(episodeName + "$" + episodeUrl)
        }
        playList["点播"] = vod_items.join("#")
        return playList
    }

    async getVideoUrl(guid) {
        return {"中央影视": ['点击播放' + '$' + 'https://hls.cntv.myhwcdn.cn/asp/hls/2000/0303000a/3/default/' + guid + '/2000.m3u8'].join("#")}
    }

    async parseVodDetailfromJson(id, obj, pic) {
        let vodDetail = new VodDetail()
        let $;
        let guid;
        if (obj["url"] !== undefined) {
            vodDetail.vod_name = obj["title"]
            vodDetail.vod_pic = obj["img"]
            vodDetail.type_name = obj["tags"]
            vodDetail.vod_year = obj["time"]
            vodDetail.vod_content = obj["vset_brief"]
            vodDetail.vod_director = obj["vset_title"]
            if (!_.isEmpty(obj["url"])) {
                $ = await this.getHtml(obj["url"])
            }else{
            }

        } else {
            if (_.isEmpty(obj["lvUrl"])) {
                vodDetail.vod_name = obj["channelName"]
                vodDetail.vod_pic = pic
            } else {
                $ = await this.getHtml(obj["lvUrl"])
                vodDetail.vod_name = $('[property$=title]')[0].attribs.content
                vodDetail.vod_content = $('[property$=description]')[0].attribs.content
                let pic = $('[property$=image]')[0].attribs.content
                if (!pic.startsWith("http")) {
                    pic = "https:" + pic
                }
                vodDetail.vod_pic = pic
            }

        }
        if (!_.isEmpty($)) {
            guid = Utils.getStrByRegex(/var guid = "(.*?)"/, $.html())
        }
        let playlist
        if (_.isEmpty(guid) && obj["url"] === undefined) {
            playlist = await this.getLiveUrl(id, obj)
        } else if (obj["url"] === ""){
            let x = 0
        }
        else {
            playlist = await this.getVideoUrl(guid)
        }
        vodDetail.vod_play_url = _.values(playlist).join('$$$');
        vodDetail.vod_play_from = _.keys(playlist).join('$$$');
        return vodDetail
    }

    async setHomeVod() {
        let resJson = JSON.parse(await this.fetch(this.apiUrl + "/api/page/iphone/HandheldApplicationSink/7.0.0/158", null, this.getHeader()))
        this.homeVodList = await this.parseVodShortListFromJson(resJson["data"]["templates"])
    }

    async setCategory(tid, pg, filter, extend) {
        if (Utils.isNumeric(tid)) {
            tid = extend["live"] ?? tid
            let url = this.apiUrl + `/api/page/iphone/HandheldApplicationSink/7.0.0/${tid}`
            let response = JSON.parse(await this.fetch(url, null, this.getHeader()))
            this.vodList = this.parseVodShortByJson(response["data"]["templates"][0]["items"])
        } else {
            let letter = extend["zimu"] ?? ""
            let area = extend["diqu"] ?? ""
            let type = extend["leixing"] ?? ""
            let year = extend["nianfen"] ?? ""
            const limit = 12
            let url = "https://api.cntv.cn" + `/newVideoset/getCboxVideoAlbumList`
            let params = {
                "channelid": "",
                "sc": type,
                "fc": tid,
                "p": pg,
                "n": limit,
                "fl": letter,
                "area": area,
                "year": year,
                "serviceId": "cbox"
            }
            let resJson = JSON.parse(await this.fetch(url, params, this.getHeader()))
            this.vodList = this.parseVodShortByTvJson(resJson["data"]["list"])
        }

    }

    async setDetail(id) {
        //区分直播还是点播
        let aList = id.split("-")
        let playType = aList[0]
        let pic = aList[2]
        id = aList[1]
        if (playType === "play") {
            let resJson = JSON.parse(await this.fetch(`https://api.cntv.cn/video/videoinfoByGuid?serviceId=cbox&guid=${id}`, null, this.getHeader()))
            this.vodDetail = await this.parseVodDetailfromJson(id, resJson, pic)
        } else {
            let content = (await this.fetch(`https://api.cntv.cn/epg/epginfo3?serviceId=shiyi&c=${id}&cb=LiveTileShow.prototype.getEpg`, null, this.getHeader())).replaceAll("LiveTileShow.prototype.getEpg(", "").replaceAll(");", "")
            this.vodDetail = await this.parseVodDetailfromJson(id, JSON.parse(content)[id], pic)

        }

    }

    async setSearch(wd, quick, pg) {
        const limit = 12;
        const param = {
            keyword: wd, page: pg, limit: limit,
        };
        const resJson = JSON.parse(await this.postData(this.siteUrl + '/v2/home/search', param));
        this.vodList = await this.parseVodShortListFromJson(resJson["data"]["list"])
        const page = parseInt(pg);
        let pageCount = page;
        if (this.vodList.length === limit) {
            pageCount = page + 1;
        }
        this.result.setPage(page, pageCount, limit, pageCount)
    }
}

let spider = new CNTVSpider()

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
        init: init, home: home, homeVod: homeVod, category: category, detail: detail, play: play, search: search,
    };
}

export {spider, CNTVSpider}