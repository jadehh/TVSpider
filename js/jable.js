/*
* @File     : jable.js
* @Author   : jade
* @Date     : 2024/3/4 9:44
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {_, load} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";

class JableTVSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://jable.tv"

    }

    getAppName() {
        return "Jable"
    }

    getName() {
        return "🐈|Jable|🐈"
    }

    getHeader() {
        // let header = super.getHeader()
        let header = {}
        header["User-Agent"] = "PostmanRuntime/7.36.3"
        header["Host"] = "jable.tv"
        // header["Postman-Token"] = "33290483-3c8d-413f-a160-0d3aea9e6f95"
        return header
    }

    async setClasses() {
        let $ = await this.getHtml(this.siteUrl)
        let navElements = $("[class=\"title-box\"]")
        let defaultTypeIdElements = $("div.row")
        for (const navElement of $(defaultTypeIdElements[0]).find("a")) {
            let type_name = $(navElement).text()
            let type_id = navElement.attribs.href
            if (type_id.indexOf(this.siteUrl) > -1) {
                this.classes.push(this.getTypeDic(type_name, type_id))
            }
        }
        navElements = navElements.slice(1, 8)
        defaultTypeIdElements = defaultTypeIdElements.slice(1, 8)
        for (let i = 0; i < navElements.length; i++) {
            let typeName = $(navElements[i]).text().replaceAll("\n", "")
            let typeId = $(defaultTypeIdElements[i]).find("a")[0].attribs["href"]
            this.classes.push(this.getTypeDic(typeName, typeId));
        }
        let x = 0
    }

    async getFilter($, index, type_id) {
        let extend_list = []
        let extend_dic = {"name": "类别", "value": []}
        let defaultTypeIdElements = $("div.row").slice(0, 8)[index]
        let type_seletc_list = ["div.img-box > a","[class=\"horizontal-img-box ml-3 mb-3\"] > a","","sort"]
        let type_id_select_list = ["div.absolute-center > h4","div.detail>h6"]
        if (index < 4) {
            let default$ = await this.getHtml(type_id)
            for (const element of default$(type_seletc_list[index])) {
                let typeId = element.attribs["href"]
                let typeName = $($(element).find(type_id_select_list[index])).text();
                extend_dic["value"].push({"n": typeName, "v": typeId})
            }
            if (extend_dic.value.length > 0){
                extend_list.push(extend_dic)
            }
        } else {
            let filterElements = $(defaultTypeIdElements).find("a")
            for (const filterElement of filterElements) {
                let filter_type_id = filterElement.attribs.href
                if (filter_type_id.indexOf(this.siteUrl) > -1) {
                    extend_dic["value"].push({"n": $(filterElement).text(), "v": filter_type_id})
                }
            }
            extend_list.push(extend_dic)
        }
        extend_list =  [
  {
    "key": "1",
    "name": "全部剧情",
    "value": [
      {
        "n": "全部",
        "v": "0"
      },
      {
        "n": "喜剧",
        "v": "喜剧"
      },
      {
        "n": "爱情",
        "v": "爱情"
      },
      {
        "n": "恐怖",
        "v": "恐怖"
      },
      {
        "n": "动作",
        "v": "动作"
      },
      {
        "n": "科幻",
        "v": "科幻"
      },
      {
        "n": "剧情",
        "v": "剧情"
      },
      {
        "n": "战争",
        "v": "战争"
      },
      {
        "n": "警匪",
        "v": "警匪"
      },
      {
        "n": "犯罪",
        "v": "犯罪"
      },
      {
        "n": "古装",
        "v": "古装"
      },
      {
        "n": "奇幻",
        "v": "奇幻"
      },
      {
        "n": "武侠",
        "v": "武侠"
      },
      {
        "n": "冒险",
        "v": "冒险"
      },
      {
        "n": "枪战",
        "v": "枪战"
      },
      {
        "n": "恐怖",
        "v": "恐怖"
      },
      {
        "n": "悬疑",
        "v": "悬疑"
      },
      {
        "n": "惊悚",
        "v": "惊悚"
      },
      {
        "n": "经典",
        "v": "经典"
      },
      {
        "n": "青春",
        "v": "青春"
      },
      {
        "n": "文艺",
        "v": "文艺"
      },
      {
        "n": "微电影",
        "v": "微电影"
      },
      {
        "n": "历史",
        "v": "历史"
      }
    ]
  },
  {
    "key": "2",
    "name": "全部地区",
    "value": [
      {
        "n": "全部",
        "v": "0"
      },
      {
        "n": "大陆",
        "v": "大陆"
      },
      {
        "n": "香港",
        "v": "香港"
      },
      {
        "n": "台湾",
        "v": "台湾"
      },
      {
        "n": "美国",
        "v": "美国"
      },
      {
        "n": "法国",
        "v": "法国"
      },
      {
        "n": "英国",
        "v": "英国"
      },
      {
        "n": "日本",
        "v": "日本"
      },
      {
        "n": "韩国",
        "v": "韩国"
      },
      {
        "n": "德国",
        "v": "德国"
      },
      {
        "n": "泰国",
        "v": "泰国"
      },
      {
        "n": "印度",
        "v": "印度"
      },
      {
        "n": "意大利",
        "v": "意大利"
      },
      {
        "n": "西班牙",
        "v": "西班牙"
      },
      {
        "n": "加拿大",
        "v": "加拿大"
      },
      {
        "n": "其他",
        "v": "其他"
      }
    ]
  },
  {
    "key": "3",
    "name": "全部语言",
    "value": [
      {
        "n": "全部",
        "v": "0"
      },
      {
        "n": "国语",
        "v": "国语"
      },
      {
        "n": "英语",
        "v": "英语"
      },
      {
        "n": "粤语",
        "v": "粤语"
      },
      {
        "n": "闽南语",
        "v": "闽南语"
      },
      {
        "n": "韩语",
        "v": "韩语"
      },
      {
        "n": "日语",
        "v": "日语"
      },
      {
        "n": "法语",
        "v": "法语"
      },
      {
        "n": "德语",
        "v": "德语"
      },
      {
        "n": "其它",
        "v": "其它"
      }
    ]
  },
  {
    "key": "4",
    "name": "全部时间",
    "value": [
      {
        "n": "全部",
        "v": "0"
      },
      {
        "n": "2024",
        "v": "2024"
      },
      {
        "n": "2023",
        "v": "2023"
      },
      {
        "n": "2022",
        "v": "2022"
      },
      {
        "n": "2021",
        "v": "2021"
      },
      {
        "n": "2020",
        "v": "2020"
      },
      {
        "n": "2019",
        "v": "2019"
      },
      {
        "n": "2018",
        "v": "2018"
      },
      {
        "n": "2017",
        "v": "2017"
      },
      {
        "n": "2016",
        "v": "2016"
      },
      {
        "n": "2015",
        "v": "2015"
      },
      {
        "n": "2014",
        "v": "2014"
      },
      {
        "n": "2013",
        "v": "2013"
      },
      {
        "n": "2012",
        "v": "2012"
      },
      {
        "n": "2011",
        "v": "2011"
      },
      {
        "n": "2010",
        "v": "2010"
      }
    ]
  },
  {
    "key": "5",
    "name": "字母查找",
    "value": [
      {
        "n": "全部",
        "v": "0"
      },
      {
        "n": "A",
        "v": "A"
      },
      {
        "n": "B",
        "v": "B"
      },
      {
        "n": "C",
        "v": "C"
      },
      {
        "n": "D",
        "v": "D"
      },
      {
        "n": "E",
        "v": "E"
      },
      {
        "n": "F",
        "v": "F"
      },
      {
        "n": "G",
        "v": "G"
      },
      {
        "n": "H",
        "v": "H"
      },
      {
        "n": "I",
        "v": "I"
      },
      {
        "n": "J",
        "v": "J"
      },
      {
        "n": "K",
        "v": "K"
      },
      {
        "n": "L",
        "v": "L"
      },
      {
        "n": "M",
        "v": "M"
      },
      {
        "n": "N",
        "v": "N"
      },
      {
        "n": "O",
        "v": "O"
      },
      {
        "n": "P",
        "v": "P"
      },
      {
        "n": "Q",
        "v": "Q"
      },
      {
        "n": "R",
        "v": "R"
      },
      {
        "n": "S",
        "v": "S"
      },
      {
        "n": "T",
        "v": "T"
      },
      {
        "n": "U",
        "v": "U"
      },
      {
        "n": "V",
        "v": "V"
      },
      {
        "n": "W",
        "v": "W"
      },
      {
        "n": "X",
        "v": "X"
      },
      {
        "n": "Y",
        "v": "Y"
      },
      {
        "n": "Z",
        "v": "Z"
      },
      {
        "n": "0-9",
        "v": "0-9"
      }
    ]
  },
  {
    "key": "6",
    "name": "时间排序",
    "value": [
      {
        "n": "全部",
        "v": "0"
      },
      {
        "n": "人气排序",
        "v": "hits"
      },
      {
        "n": "评分排序",
        "v": "score"
      }
    ]
  }
]
        return extend_list
    }

    async setFilterObj() {
        let $ = await this.getHtml(this.siteUrl)
        for (let i = 0; i < this.classes.slice(1, -1).length; i++) {
            let type_id = this.classes[i].type_id
            this.filterObj[type_id] = await this.getFilter($, i, type_id)
        }
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $("[class=\"video-img-box mb-e-20\"]")
        for (const element of vodElements) {
            let vodShort = new VodShort();
            let picElement = $(element).find("img")
            if (picElement.length > 0) {
                vodShort.vod_pic = $(element).find("img")[0].attribs["data-src"];
                vodShort.vod_remarks = $($(element).find("div")[1]).text()
                let url = $(element).find("a")[0].attribs["href"];
                vodShort.vod_name = url.split("/")[4]
                vodShort.vod_id = url.split("/")[4];
                vodShort.vod_remarks = $($(element).find("[class=\"sub-title\"]")).text().split("\n")[1].replaceAll(" ", "")
                vod_list.push(vodShort)
            }
        }
        return vod_list
    }

    async parseVodShortListFromDocByCategory($) {
        let vod_list = []
        let vodElements = $("div.video-img-box")
        for (const element of vodElements) {
            let vodShort = new VodShort()
            vodShort.vod_pic = $(element).find("img").attr("data-src");
            let url = $(element).find("a").attr("href");
            vodShort.vod_id = url.split("/")[4];
            vodShort.vod_name = url.split("/")[4];
            vodShort.vod_remarks = $($(element).find("[class=\"sub-title\"]")).text().split("\n")[1].replaceAll(" ", "").replaceAll("\t", "")
            vod_list.push(vodShort);
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail();
        let leftElement = $("[class=\"header-left\"]")
        vodDetail.vod_name = $($(leftElement).find("h4")).text();
        vodDetail.vod_pic = Utils.getStrByRegex(/<video poster="(.*?)" id=/, $.html())
        vodDetail.vod_year = $($("[class=\"inactive-color\"]")).text()
        let episodeName = Utils.getStrByRegex(/<span class="text-danger fs-1 mr-2"(.*?)\n/, $.html()).replaceAll(">", "").replaceAll("</span", "")
        let vodItems = []
        let episodeUrl = Utils.getStrByRegex(/var hlsUrl = '(.*?)';/, $.html())
        vodItems.push(episodeName + "$" + episodeUrl)
        let vod_play_list = []
        vod_play_list.push(vodItems.join("#"))
        let vod_play_from_list = ["Jable"]
        vodDetail.vod_play_from = vod_play_from_list.join("$$$")
        vodDetail.vod_play_url = vod_play_list.join("$$$")
        return vodDetail
    }

    async setHomeVod() {
        let $ = await this.getHtml(this.siteUrl)
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    async setDetail(id) {
        let $ = await this.getHtml(this.siteUrl + "/videos/" + id + "/")
        this.vodDetail = await this.parseVodDetailFromDoc($)
    }

    async setCategory(tid, pg, filter, extend) {
        let extend_type = extend["a"] ?? "video_viewed"
        let cateUrl = this.siteUrl + `/categories/bdsm/${pg}/?mode=async&function=get_block&block_id=list_videos_common_videos_list&sort_by=${extend_type}&_=${new Date().getTime()}`
        let $ = await this.getHtml(cateUrl);
        this.vodList = await this.parseVodShortListFromDocByCategory($)
    }

    async setSearch(wd, quick) {
        let searchUrl = this.siteUrl + `/search/${wd}/`
        let $ = await this.getHtml(searchUrl)
        this.vodList = await this.parseVodShortListFromDocByCategory($)
    }
}

let spider = new JableTVSpider()

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