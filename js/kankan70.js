/*
* @File     : kankan70.js
* @Author   : jade
* @Date     : 2023/12/29 15:33
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {JadeLogging} from "../lib/log.js";
import {Result, SpiderInit} from "../lib/spider_object.js";
import * as Utils from "../lib/utils.js";
import {getStrByRegex} from "../lib/utils.js";
import {_, load, Uri} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";

const JadeLog = new JadeLogging(getAppName(), "DEBUG")
let classes = [
    {
        "type_name": "电视剧",
        "type_id": "/tv/y2024/"
    },
    {
        "type_name": "电影",
        "type_id": "/mov/y2024/"
    },
    {
        "type_name": "综艺",
        "type_id": "/zongyi/y2024/"
    },
    {
        "type_name": "动漫",
        "type_id": "/acg/y2024/"
    }
]
let filterObj = {
    "/acg/y2024/": [
        {
            "key": "1",
            "name": "剧情",
            "value": [
                {
                    "n": "全部",
                    "v": "0"
                },
                {
                    "n": "搞笑",
                    "v": "71"
                },
                {
                    "n": "经典",
                    "v": "72"
                },
                {
                    "n": "热血",
                    "v": "73"
                },
                {
                    "n": "催泪",
                    "v": "74"
                },
                {
                    "n": "治愈",
                    "v": "75"
                },
                {
                    "n": "猎奇",
                    "v": "76"
                },
                {
                    "n": "励志",
                    "v": "78"
                },
                {
                    "n": "战斗",
                    "v": "80"
                },
                {
                    "n": "后宫",
                    "v": "81"
                },
                {
                    "n": "机战",
                    "v": "82"
                },
                {
                    "n": "恋爱",
                    "v": "84"
                },
                {
                    "n": "百合",
                    "v": "85"
                },
                {
                    "n": "科幻",
                    "v": "86"
                },
                {
                    "n": "奇幻",
                    "v": "88"
                },
                {
                    "n": "推理",
                    "v": "89"
                },
                {
                    "n": "校园",
                    "v": "90"
                },
                {
                    "n": "运动",
                    "v": "91"
                },
                {
                    "n": "魔法",
                    "v": "94"
                },
                {
                    "n": "历史",
                    "v": "95"
                },
                {
                    "n": "伪娘",
                    "v": "101"
                },
                {
                    "n": "美少女",
                    "v": "102"
                },
                {
                    "n": "萝莉",
                    "v": "103"
                },
                {
                    "n": "亲子",
                    "v": "105"
                },
                {
                    "n": "青春",
                    "v": "107"
                },
                {
                    "n": "冒险",
                    "v": "108"
                },
                {
                    "n": "竞技",
                    "v": "109"
                }
            ]
        },
        {
            "key": "2",
            "name": "年代",
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
                    "n": "更早",
                    "v": "2000"
                }
            ]
        },
        {
            "key": "3",
            "name": "地区",
            "value": [
                {
                    "n": "全部",
                    "v": "all"
                },
                {
                    "n": "日本",
                    "v": "japan"
                },
                {
                    "n": "国产",
                    "v": "china"
                },
                {
                    "n": "英国",
                    "v": "england"
                },
                {
                    "n": "美国",
                    "v": "american"
                },
                {
                    "n": "韩国",
                    "v": "korea"
                }
            ]
        }
    ],
    "/tv/y2024/": [
        {
            "key": "1",
            "name": "剧情",
            "value": [
                {
                    "n": "全部",
                    "v": "0"
                },
                {
                    "n": "古装",
                    "v": "19"
                },
                {
                    "n": "言情",
                    "v": "20"
                },
                {
                    "n": "武侠",
                    "v": "21"
                },
                {
                    "n": "偶像",
                    "v": "22"
                },
                {
                    "n": "家庭",
                    "v": "23"
                },
                {
                    "n": "青春",
                    "v": "24"
                },
                {
                    "n": "都市",
                    "v": "25"
                },
                {
                    "n": "爱情",
                    "v": "26"
                },
                {
                    "n": "喜剧",
                    "v": "27"
                },
                {
                    "n": "战争",
                    "v": "28"
                },
                {
                    "n": "军旅",
                    "v": "29"
                },
                {
                    "n": "谍战",
                    "v": "30"
                },
                {
                    "n": "悬疑",
                    "v": "31"
                },
                {
                    "n": "罪案",
                    "v": "32"
                },
                {
                    "n": "穿越",
                    "v": "33"
                },
                {
                    "n": "宫廷",
                    "v": "34"
                },
                {
                    "n": "历史",
                    "v": "35"
                },
                {
                    "n": "神话",
                    "v": "36"
                },
                {
                    "n": "科幻",
                    "v": "37"
                },
                {
                    "n": "年代",
                    "v": "38"
                },
                {
                    "n": "农村",
                    "v": "39"
                },
                {
                    "n": "商战",
                    "v": "40"
                },
                {
                    "n": "剧情",
                    "v": "41"
                },
                {
                    "n": "奇幻",
                    "v": "42"
                }
            ]
        },
        {
            "key": "2",
            "name": "年代",
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
                    "n": "更早",
                    "v": "2000"
                }
            ]
        },
        {
            "key": "3",
            "name": "地区",
            "value": [
                {
                    "n": "全部",
                    "v": "all"
                },
                {
                    "n": "国产",
                    "v": "china"
                },
                {
                    "n": "港剧",
                    "v": "hk"
                },
                {
                    "n": "台剧",
                    "v": "tw"
                },
                {
                    "n": "美剧",
                    "v": "american"
                },
                {
                    "n": "韩剧",
                    "v": "korea"
                },
                {
                    "n": "泰剧",
                    "v": "thailand"
                },
                {
                    "n": "日剧",
                    "v": "japan"
                }
            ]
        }
    ],
    "/mov/y2024/": [
        {
            "key": "1",
            "name": "剧情",
            "value": [
                {
                    "n": "全部",
                    "v": "0"
                },
                {
                    "n": "喜剧",
                    "v": "1"
                },
                {
                    "n": "悲剧",
                    "v": "2"
                },
                {
                    "n": "爱情",
                    "v": "3"
                },
                {
                    "n": "动作",
                    "v": "4"
                },
                {
                    "n": "枪战",
                    "v": "5"
                },
                {
                    "n": "犯罪",
                    "v": "6"
                },
                {
                    "n": "惊悚",
                    "v": "7"
                },
                {
                    "n": "恐怖",
                    "v": "8"
                },
                {
                    "n": "悬疑",
                    "v": "9"
                },
                {
                    "n": "动画",
                    "v": "10"
                },
                {
                    "n": "家庭",
                    "v": "11"
                },
                {
                    "n": "奇幻",
                    "v": "12"
                },
                {
                    "n": "魔幻",
                    "v": "13"
                },
                {
                    "n": "科幻",
                    "v": "14"
                },
                {
                    "n": "战争",
                    "v": "15"
                },
                {
                    "n": "青春",
                    "v": "16"
                },
                {
                    "n": "剧情",
                    "v": "17"
                }
            ]
        },
        {
            "key": "2",
            "name": "年代",
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
                    "n": "更早",
                    "v": "2000"
                }
            ]
        },
        {
            "key": "3",
            "name": "地区",
            "value": [
                {
                    "n": "全部",
                    "v": "all"
                },
                {
                    "n": "国产",
                    "v": "china"
                },
                {
                    "n": "香港",
                    "v": "hk"
                },
                {
                    "n": "英国",
                    "v": "england"
                },
                {
                    "n": "美国",
                    "v": "american"
                },
                {
                    "n": "韩国",
                    "v": "korea"
                },
                {
                    "n": "泰国",
                    "v": "thailand"
                },
                {
                    "n": "日本",
                    "v": "japan"
                }
            ]
        }
    ],
    "/zongyi/y2024/": [
        {
            "key": "1",
            "name": "剧情",
            "value": [
                {
                    "n": "全部",
                    "v": "0"
                },
                {
                    "n": "播报",
                    "v": "43"
                },
                {
                    "n": "访谈",
                    "v": "44"
                },
                {
                    "n": "搞笑",
                    "v": "45"
                },
                {
                    "n": "游戏",
                    "v": "46"
                },
                {
                    "n": "选秀",
                    "v": "47"
                },
                {
                    "n": "时尚",
                    "v": "48"
                },
                {
                    "n": "情感",
                    "v": "49"
                },
                {
                    "n": "晚会",
                    "v": "50"
                },
                {
                    "n": "曲艺",
                    "v": "51"
                },
                {
                    "n": "美食",
                    "v": "52"
                },
                {
                    "n": "少儿",
                    "v": "53"
                },
                {
                    "n": "脱口秀",
                    "v": "54"
                },
                {
                    "n": "职场",
                    "v": "55"
                },
                {
                    "n": "相亲",
                    "v": "56"
                },
                {
                    "n": "音乐",
                    "v": "57"
                },
                {
                    "n": "伦理",
                    "v": "58"
                },
                {
                    "n": "真人秀",
                    "v": "59"
                },
                {
                    "n": "舞蹈",
                    "v": "60"
                },
                {
                    "n": "亲子",
                    "v": "61"
                },
                {
                    "n": "财经",
                    "v": "62"
                },
                {
                    "n": "旅游",
                    "v": "63"
                },
                {
                    "n": "益智",
                    "v": "64"
                },
                {
                    "n": "竞技",
                    "v": "65"
                },
                {
                    "n": "纪实",
                    "v": "66"
                },
                {
                    "n": "生活",
                    "v": "67"
                },
                {
                    "n": "盛会",
                    "v": "68"
                },
                {
                    "n": "歌舞",
                    "v": "69"
                },
                {
                    "n": "其它",
                    "v": "70"
                }
            ]
        },
        {
            "key": "2",
            "name": "年代",
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
                    "n": "更早",
                    "v": "2000"
                }
            ]
        },
        {
            "key": "3",
            "name": "地区",
            "value": [
                {
                    "n": "全部",
                    "v": "all"
                },
                {
                    "n": "中国",
                    "v": "china"
                },
                {
                    "n": "英国",
                    "v": "england"
                },
                {
                    "n": "美国",
                    "v": "american"
                },
                {
                    "n": "韩国",
                    "v": "korea"
                },
                {
                    "n": "泰国",
                    "v": "thailand"
                },
                {
                    "n": "日本",
                    "v": "japan"
                }
            ]
        }
    ]
}
let result = new Result()
let CatOpenStatus = false
let ReconnectTimes = 0
let MaxReconnect = 5
const siteUrl = "http://cqdb6.com";

function getHeader() {
    return {"User-Agent": Utils.CHROME, "Referer": siteUrl + "/"};
}

function get_qp_name44(qp_type) {
    if (qp_type === 'zd') return '最大';
    if (qp_type === 'yj') return '永久';
    if (qp_type === 'hn') return '牛牛';
    if (qp_type === 'gs') return '光波';
    if (qp_type === 'sn') return '新朗';
    if (qp_type === 'wl') return '涡轮';
    if (qp_type === 'lz') return '良子';
    if (qp_type === 'fs') return 'F速';
    if (qp_type === 'ff') return '飞飞';
    if (qp_type === 'bd') return '百度';
    if (qp_type === 'uk') return '酷U';
    if (qp_type === 'wj') return '无天';
    if (qp_type === 'bj') return '八戒';
    if (qp_type === 'tk') return '天空';
    if (qp_type === 'ss') return '速速';
    if (qp_type === 'kb') return '酷播';
    if (qp_type === 'sd') return '闪电';
    if (qp_type === 'xk') return '看看';
    if (qp_type === 'tp') return '淘淘';
    if (qp_type === 'jy') return '精英';

    return qp_type;
}


async function reconnnect(fetch, reqUrl, headers, params) {
    await JadeLog.error("请求失败,请检查url:" + reqUrl + ",两秒后重试")
    Utils.sleep(2)
    if (ReconnectTimes < MaxReconnect) {
        ReconnectTimes = ReconnectTimes + 1
        return await fetch(reqUrl, headers, params)
    } else {
        await JadeLog.error("请求失败,重连失败")
        return null
    }
}

async function fetch(reqUrl, headers, params = null) {
    let data = Utils.objectToStr(params)
    if (!_.isEmpty(data)) {
        reqUrl = reqUrl + "?" + data
    }
    let uri = new Uri(reqUrl);
    let response = await req(uri.toString(), {
        method: "get",
        headers: headers,
        data: null,
    });
    if (response.code === 200 || response.code === undefined) {
        if (!_.isEmpty(response.content)) {
            return response.content
        } else {
            return await reconnnect(fetch, reqUrl, headers, params)
        }
    } else {
        await JadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
        return await reconnnect(fetch, reqUrl, headers)

    }
}

function getName() {
    return "📺┃70看看┃📺"
}

function getAppName() {
    return "70看看"
}

async function init(cfg) {
    let obj = await SpiderInit(cfg)
    CatOpenStatus = obj.CatOpenStatus
    // 读取缓存
}

function parseVodShortListFromDoc($) {
    let vod_list = []
    let vod_elements = $("a.li-hv")
    for (const vod_element of vod_elements) {
        let vodShort = new VodShort()
        vodShort.vod_id = "/" + vod_element.attribs["href"]
        vodShort.vod_name = vod_element.attribs["title"]
        vodShort.vod_pic = $(vod_element).find("img")[0].attribs["data-original"]
        let remarkEle = $(vod_element).find("p.bz")[0]
        if (remarkEle.length > 0) {
            vodShort.vod_remarks = remarkEle.children[0].data
        }
        vod_list.push(vodShort)
    }
    return vod_list
}


function parseVodDetailFromDoc($) {
    let vodDetail = new VodDetail()
    let infoElement = $("[class=info]")
    let dtElement = $(infoElement).find("dt.name")[0]
    vodDetail.vod_name = dtElement.children[0].data
    vodDetail.vod_remarks = dtElement.children[1].children[0].data
    let ddString = $(infoElement).find("dd").text()
    vodDetail.vod_area = Utils.getStrByRegex(/地区：(.*?) /, ddString)
    vodDetail.vod_year = Utils.getStrByRegex(/年代：(.*?)\n/, ddString)
    vodDetail.type_name = Utils.getStrByRegex(/类型：(.*?)\n/, ddString)
    vodDetail.vod_content = $(infoElement).find("[class=des2]").text().replaceAll("\n", "").replaceAll("剧情：", "")
    vodDetail.vod_pic = $("img.lazy")[0].attribs["data-original"]

    return vodDetail
}

function paraseUrlObject(js_str) {
    let content_list = js_str.split(";")
    let urlObject = {}
    let next_index = 0;
    let js_name = ""
    for (let i = 0; i < content_list.length; i++) {
        let content = content_list[i]
        if (i === 0) {
            next_index = parseInt(content.split("=").slice(-1)[0])
            js_name = content.split("=")[0].split(" ")[1]
            urlObject[js_name] = {"play_id": "", "list": [], "pl_dy": ""}
        } else {
            if (i % (next_index + 5) === 3) {
                urlObject[js_name]["play_id"] = content.split("=")[1]
            } else if (i % (next_index + 5) === 2) {
                urlObject[js_name]["pl_dy"] = content.split("=")[1]
            } else if (i % (next_index + 5) === 1) {
            } else if (i % (next_index + 5) === 0) {
                next_index = parseInt(content.split("=").slice(-1)[0])
                js_name = content.split("=")[0].split(" ")[1]
                if (js_name !== undefined) {
                    urlObject[js_name] = {"play_id": "", "list": [], "pl_dy": ""}
                }
            } else if (i % (next_index + 5) === next_index + 4) {
            } else {
                let play_url = content.split("=\"")[1].split(",")[0]
                urlObject[js_name]["list"].push(play_url)
            }
        }
    }
    let play_url_list = [], play_format_list = [];
    for (const key of Object.keys(urlObject)) {
        if (key.indexOf("_") > -1) {
            let play_format_name = get_qp_name44(key.split("_")[1])
            play_format_list.push(play_format_name)
            let vodItems = []
            let index = 0
            for (const play_url of urlObject[key]["list"]) {
                index = index + 1
                vodItems.push("第" + index.toString() + "集" + "$" + play_url)
            }
            play_url_list.push(vodItems.join("#"))
        }
    }
    return {"play_format": play_format_list.join("$$$"), "play_url": play_url_list.join("$$$")}
}

function paraseVodShortFromList(objectList) {
    let vod_list = []
    for (const object of objectList) {
        let vodShort = new VodShort()
        vodShort.vod_id = object["url"]
        vodShort.vod_pic = object["thumb"]
        vodShort.vod_remarks = object["time"]
        vodShort.vod_name = object["title"]
        vod_list.push(vodShort)
    }
    return vod_list

}

async function home(filter) {
    await JadeLog.info("正在解析首页类别", true)
    await JadeLog.debug(`首页类别解析完成,内容为${result.home(classes, [], filterObj)}`)
    await JadeLog.info("首页类别解析完成", true)
    return result.home(classes, [], filterObj)
}


async function homeVod() {
    await JadeLog.info("正在解析首页列表", true)
    let html = await fetch(siteUrl, getHeader())
    let $ = load(html)
    let vod_list = []
    if (!CatOpenStatus) {
        vod_list = parseVodShortListFromDoc($)
    }
    await JadeLog.debug(`首页列表为:${result.homeVod(vod_list)}`)

    return result.homeVod(vod_list)
}

function getParams(id, class_name, extend, pg) {
    let year = ""
    let area = ""
    let class_id = ""
    if (extend["2"] === undefined) {
        let timestamp = new Date()
        year = timestamp.getFullYear().toString()
    } else if (extend["2"] === "0") {
        let timestamp = new Date()
        year = timestamp.getFullYear().toString()
    }else{
        year = extend["2"]
    }

    if (extend["3"] === undefined) {
        area = "all"
    } else if (extend["3"] === "0") {
        area = "all"
    }else{
        area = extend["3"]
    }

    if (extend["1"] === undefined) {
        class_id = "0"
    }else{
        class_id = extend["3"]
    }


    return {
        "action": class_name,
        "page": parseInt(pg),
        "year": extend["2"] ?? "0",
        "area": extend["3"] ?? "all",
        "class":extend["1"] ?? "0",
        "dect": "",
        "id": id
    }
}

async function category(tid, pg, filter, extend) {
    let url = siteUrl + tid
    let vod_list = []
    let class_name = tid.split("/")[1]
    let id = tid.split("/")[2]
    let html = await fetch(url, getHeader())
    let limit = 0
    await JadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)},url = ${url}`)
    if (html !== null) {
        let api_str = getStrByRegex(/var _yu_gda_s="(.*?)";/, html)
        let params = getParams(id, class_name, extend, pg)
        let cate_html = await fetch(api_str, getHeader(), params)
        if (cate_html !== null) {
            await JadeLog.info(`分类详情解析成功,api url为:${api_str},传入参数为:${JSON.stringify(params)}`)
            let $ = load(cate_html)
            vod_list = parseVodShortListFromDoc($)
        } else {
            await JadeLog.error("分类结果API调用失败")
        }
    } else {
        await JadeLog.error("分类网页打开失败")
    }
    let page = parseInt(pg)
    let count = 0, total = 0
    await JadeLog.debug(`分类结果为:${result.category(vod_list, page, count, limit, total)}`)
    return result.category(vod_list, page, count, limit, total)
}


async function detail(id) {
    let detailUrl = siteUrl + id
    let html = await fetch(detailUrl, getHeader())
    let vod_detail = new VodDetail();
    vod_detail.vod_id = id
    if (html !== null) {
        let $ = load(html)
        vod_detail = parseVodDetailFromDoc($)
        vod_detail.vod_id = id
        let mather = /<script type="text\/javascript" src="http:\/\/test.gqyy8.com:8077\/ne2(.*?)"><\/script>/g.exec(html)
        let js_url = "http://test.gqyy8.com:8077/ne2" + mather[1]
        let js_str = await fetch(js_url, getHeader())
        if (js_str !== null) {
            let playObject = paraseUrlObject(js_str)
            vod_detail.vod_play_url = playObject["play_url"]
            vod_detail.vod_play_from = playObject["play_format"]
        }
    }
    return result.detail(vod_detail)
}

async function play(flag, id, flags) {
    return result.play(id)
}


async function search(wd, quick) {
    let url = siteUrl + "/search.php"
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${url}`)
    let html = await fetch(url, getHeader())
    let vod_list = []
    if (html !== null) {
        let params = {
            "top": 10,
            "q": wd,
        }
        let api_url = Utils.getStrByRegex(/var my_search='(.*?)';/, html)
        let res = await fetch(api_url, getHeader(), params)
        let res_json = JSON.parse(res)
        vod_list = paraseVodShortFromList(res_json)
    } else {
        await JadeLog.error("搜索失败")
    }
    await JadeLog.debug(`搜索页面解析完成,搜索结果为:${result.search(vod_list)}`)
    return result.search(vod_list)
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