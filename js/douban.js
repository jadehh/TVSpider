/*
* @File     : nivod.js
* @Author   : jade
* @Date     : 2023/12/19 14:23
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {JadeLogging} from "../lib/log.js";
import {_, Crypto, Uri} from "../lib/cat.js";
import {HomeSpiderResult, SpiderInit} from "../lib/spider_object.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import {} from "../lib/crypto-js.js"

let ApiUrl = 'https://frodo.douban.com/api/v2'
let APIKey = "0ac44ae016490db2204ce0a042db2916"

const JadeLog = new JadeLogging(getAppName(), "DEBUG")
let homeSpiderResult = new HomeSpiderResult()
let CatOpenStatus = false


let Classes = [
    {
        "type_name": "热门电影",
        "type_id": "hot_gaia"
    },
    {
        "type_name": "热播剧集",
        "type_id": "tv_hot"
    },
    {
        "type_name": "热播综艺",
        "type_id": "show_hot"
    },
    {
        "type_name": "电影筛选",
        "type_id": "movie"
    }, {
        "type_name": "电视筛选",
        "type_id": "tv"
    }, {
        "type_name": "电影榜单",
        "type_id": "rank_list_movie"
    }, {
        "type_name": "电视剧榜单",
        "type_id": "rank_list_tv"
    }
]
let Filters = {
    "hot_gaia": [
        {
            "key": "sort",
            "name": "排序",
            "value": [
                {
                    "n": "热度",
                    "v": "recommend"
                },
                {
                    "n": "最新",
                    "v": "time"
                },
                {
                    "n": "评分",
                    "v": "rank"
                }
            ]
        },
        {
            "key": "area",
            "name": "地区",
            "value": [
                {
                    "n": "全部",
                    "v": "全部"
                },
                {
                    "n": "华语",
                    "v": "华语"
                },
                {
                    "n": "欧美",
                    "v": "欧美"
                },
                {
                    "n": "韩国",
                    "v": "韩国"
                },
                {
                    "n": "日本",
                    "v": "日本"
                }
            ]
        }
    ],
    "tv_hot": [
        {
            "key": "type",
            "name": "分类",
            "value": [
                {
                    "n": "综合",
                    "v": "tv_hot"
                },
                {
                    "n": "国产剧",
                    "v": "tv_domestic"
                },
                {
                    "n": "欧美剧",
                    "v": "tv_american"
                },
                {
                    "n": "日剧",
                    "v": "tv_japanese"
                },
                {
                    "n": "韩剧",
                    "v": "tv_korean"
                },
                {
                    "n": "动画",
                    "v": "tv_animation"
                }
            ]
        }
    ],
    "show_hot": [
        {
            "key": "type",
            "name": "分类",
            "value": [
                {
                    "n": "综合",
                    "v": "show_hot"
                },
                {
                    "n": "国内",
                    "v": "show_domestic"
                },
                {
                    "n": "国外",
                    "v": "show_foreign"
                }
            ]
        }
    ],
    "movie": [
        {
            "key": "类型",
            "name": "类型",
            "value": [
                {
                    "n": "全部类型",
                    "v": ""
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
                    "n": "动作",
                    "v": "动作"
                },
                {
                    "n": "科幻",
                    "v": "科幻"
                },
                {
                    "n": "动画",
                    "v": "动画"
                },
                {
                    "n": "悬疑",
                    "v": "悬疑"
                },
                {
                    "n": "犯罪",
                    "v": "犯罪"
                },
                {
                    "n": "惊悚",
                    "v": "惊悚"
                },
                {
                    "n": "冒险",
                    "v": "冒险"
                },
                {
                    "n": "音乐",
                    "v": "音乐"
                },
                {
                    "n": "历史",
                    "v": "历史"
                },
                {
                    "n": "奇幻",
                    "v": "奇幻"
                },
                {
                    "n": "恐怖",
                    "v": "恐怖"
                },
                {
                    "n": "战争",
                    "v": "战争"
                },
                {
                    "n": "传记",
                    "v": "传记"
                },
                {
                    "n": "歌舞",
                    "v": "歌舞"
                },
                {
                    "n": "武侠",
                    "v": "武侠"
                },
                {
                    "n": "情色",
                    "v": "情色"
                },
                {
                    "n": "灾难",
                    "v": "灾难"
                },
                {
                    "n": "西部",
                    "v": "西部"
                },
                {
                    "n": "纪录片",
                    "v": "纪录片"
                },
                {
                    "n": "短片",
                    "v": "短片"
                }
            ]
        },
        {
            "key": "地区",
            "name": "地区",
            "value": [
                {
                    "n": "全部地区",
                    "v": ""
                },
                {
                    "n": "华语",
                    "v": "华语"
                },
                {
                    "n": "欧美",
                    "v": "欧美"
                },
                {
                    "n": "韩国",
                    "v": "韩国"
                },
                {
                    "n": "日本",
                    "v": "日本"
                },
                {
                    "n": "中国大陆",
                    "v": "中国大陆"
                },
                {
                    "n": "美国",
                    "v": "美国"
                },
                {
                    "n": "中国香港",
                    "v": "中国香港"
                },
                {
                    "n": "中国台湾",
                    "v": "中国台湾"
                },
                {
                    "n": "英国",
                    "v": "英国"
                },
                {
                    "n": "法国",
                    "v": "法国"
                },
                {
                    "n": "德国",
                    "v": "德国"
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
                    "n": "印度",
                    "v": "印度"
                },
                {
                    "n": "泰国",
                    "v": "泰国"
                },
                {
                    "n": "俄罗斯",
                    "v": "俄罗斯"
                },
                {
                    "n": "加拿大",
                    "v": "加拿大"
                },
                {
                    "n": "澳大利亚",
                    "v": "澳大利亚"
                },
                {
                    "n": "爱尔兰",
                    "v": "爱尔兰"
                },
                {
                    "n": "瑞典",
                    "v": "瑞典"
                },
                {
                    "n": "巴西",
                    "v": "巴西"
                },
                {
                    "n": "丹麦",
                    "v": "丹麦"
                }
            ]
        },
        {
            "key": "sort",
            "name": "排序",
            "value": [
                {
                    "n": "近期热度",
                    "v": "T"
                },
                {
                    "n": "首映时间",
                    "v": "R"
                },
                {
                    "n": "高分优先",
                    "v": "S"
                }
            ]
        },
        {
            "key": "年代",
            "name": "年代",
            "value": [
                {
                    "n": "全部年代",
                    "v": ""
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
                    "n": "2010年代",
                    "v": "2010年代"
                },
                {
                    "n": "2000年代",
                    "v": "2000年代"
                },
                {
                    "n": "90年代",
                    "v": "90年代"
                },
                {
                    "n": "80年代",
                    "v": "80年代"
                },
                {
                    "n": "70年代",
                    "v": "70年代"
                },
                {
                    "n": "60年代",
                    "v": "60年代"
                },
                {
                    "n": "更早",
                    "v": "更早"
                }
            ]
        }
    ],
    "tv": [
        {
            "key": "类型",
            "name": "类型",
            "value": [
                {
                    "n": "不限",
                    "v": ""
                },
                {
                    "n": "电视剧",
                    "v": "电视剧"
                },
                {
                    "n": "综艺",
                    "v": "综艺"
                }
            ]
        },
        {
            "key": "电视剧形式",
            "name": "电视剧形式",
            "value": [
                {
                    "n": "不限",
                    "v": ""
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
                    "n": "悬疑",
                    "v": "悬疑"
                },
                {
                    "n": "动画",
                    "v": "动画"
                },
                {
                    "n": "武侠",
                    "v": "武侠"
                },
                {
                    "n": "古装",
                    "v": "古装"
                },
                {
                    "n": "家庭",
                    "v": "家庭"
                },
                {
                    "n": "犯罪",
                    "v": "犯罪"
                },
                {
                    "n": "科幻",
                    "v": "科幻"
                },
                {
                    "n": "恐怖",
                    "v": "恐怖"
                },
                {
                    "n": "历史",
                    "v": "历史"
                },
                {
                    "n": "战争",
                    "v": "战争"
                },
                {
                    "n": "动作",
                    "v": "动作"
                },
                {
                    "n": "冒险",
                    "v": "冒险"
                },
                {
                    "n": "传记",
                    "v": "传记"
                },
                {
                    "n": "剧情",
                    "v": "剧情"
                },
                {
                    "n": "奇幻",
                    "v": "奇幻"
                },
                {
                    "n": "惊悚",
                    "v": "惊悚"
                },
                {
                    "n": "灾难",
                    "v": "灾难"
                },
                {
                    "n": "歌舞",
                    "v": "歌舞"
                },
                {
                    "n": "音乐",
                    "v": "音乐"
                }
            ]
        },
        {
            "key": "综艺形式",
            "name": "综艺形式",
            "value": [
                {
                    "n": "不限",
                    "v": ""
                },
                {
                    "n": "真人秀",
                    "v": "真人秀"
                },
                {
                    "n": "脱口秀",
                    "v": "脱口秀"
                },
                {
                    "n": "音乐",
                    "v": "音乐"
                },
                {
                    "n": "歌舞",
                    "v": "歌舞"
                }
            ]
        },
        {
            "key": "地区",
            "name": "地区",
            "value": [
                {
                    "n": "全部地区",
                    "v": ""
                },
                {
                    "n": "华语",
                    "v": "华语"
                },
                {
                    "n": "欧美",
                    "v": "欧美"
                },
                {
                    "n": "国外",
                    "v": "国外"
                },
                {
                    "n": "韩国",
                    "v": "韩国"
                },
                {
                    "n": "日本",
                    "v": "日本"
                },
                {
                    "n": "中国大陆",
                    "v": "中国大陆"
                },
                {
                    "n": "中国香港",
                    "v": "中国香港"
                },
                {
                    "n": "美国",
                    "v": "美国"
                },
                {
                    "n": "英国",
                    "v": "英国"
                },
                {
                    "n": "泰国",
                    "v": "泰国"
                },
                {
                    "n": "中国台湾",
                    "v": "中国台湾"
                },
                {
                    "n": "意大利",
                    "v": "意大利"
                },
                {
                    "n": "法国",
                    "v": "法国"
                },
                {
                    "n": "德国",
                    "v": "德国"
                },
                {
                    "n": "西班牙",
                    "v": "西班牙"
                },
                {
                    "n": "俄罗斯",
                    "v": "俄罗斯"
                },
                {
                    "n": "瑞典",
                    "v": "瑞典"
                },
                {
                    "n": "巴西",
                    "v": "巴西"
                },
                {
                    "n": "丹麦",
                    "v": "丹麦"
                },
                {
                    "n": "印度",
                    "v": "印度"
                },
                {
                    "n": "加拿大",
                    "v": "加拿大"
                },
                {
                    "n": "爱尔兰",
                    "v": "爱尔兰"
                },
                {
                    "n": "澳大利亚",
                    "v": "澳大利亚"
                }
            ]
        },
        {
            "key": "sort",
            "name": "排序",
            "value": [
                {
                    "n": "近期热度",
                    "v": "T"
                },
                {
                    "n": "首播时间",
                    "v": "R"
                },
                {
                    "n": "高分优先",
                    "v": "S"
                }
            ]
        },
        {
            "key": "年代",
            "name": "年代",
            "value": [
                {
                    "n": "全部",
                    "v": ""
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
                    "n": "2010年代",
                    "v": "2010年代"
                },
                {
                    "n": "2000年代",
                    "v": "2000年代"
                },
                {
                    "n": "90年代",
                    "v": "90年代"
                },
                {
                    "n": "80年代",
                    "v": "80年代"
                },
                {
                    "n": "70年代",
                    "v": "70年代"
                },
                {
                    "n": "60年代",
                    "v": "60年代"
                },
                {
                    "n": "更早",
                    "v": "更早"
                }
            ]
        },
        {
            "key": "平台",
            "name": "平台",
            "value": [
                {
                    "n": "全部",
                    "v": ""
                },
                {
                    "n": "腾讯视频",
                    "v": "腾讯视频"
                },
                {
                    "n": "爱奇艺",
                    "v": "爱奇艺"
                },
                {
                    "n": "优酷",
                    "v": "优酷"
                },
                {
                    "n": "湖南卫视",
                    "v": "湖南卫视"
                },
                {
                    "n": "Netflix",
                    "v": "Netflix"
                },
                {
                    "n": "HBO",
                    "v": "HBO"
                },
                {
                    "n": "BBC",
                    "v": "BBC"
                },
                {
                    "n": "NHK",
                    "v": "NHK"
                },
                {
                    "n": "CBS",
                    "v": "CBS"
                },
                {
                    "n": "NBC",
                    "v": "NBC"
                },
                {
                    "n": "tvN",
                    "v": "tvN"
                }
            ]
        }
    ],
    "rank_list_movie": [
        {
            "key": "榜单",
            "name": "榜单",
            "value": [
                {
                    "n": "实时热门电影",
                    "v": "movie_real_time_hotest"
                },
                {
                    "n": "一周口碑电影榜",
                    "v": "movie_weekly_best"
                },
                {
                    "n": "豆瓣电影Top250",
                    "v": "movie_top250"
                }
            ]
        }
    ],
    "rank_list_tv": [
        {
            "key": "榜单",
            "name": "榜单",
            "value": [
                {
                    "n": "实时热门电视",
                    "v": "tv_real_time_hotest"
                },
                {
                    "n": "华语口碑剧集榜",
                    "v": "tv_chinese_best_weekly"
                },
                {
                    "n": "全球口碑剧集榜",
                    "v": "tv_global_best_weekly"
                },
                {
                    "n": "国内口碑综艺榜",
                    "v": "show_chinese_best_weekly"
                },
                {
                    "n": "国外口碑综艺榜",
                    "v": "show_global_best_weekly"
                }
            ]
        }
    ]
}
let UserAgents = [
    "api-client/1 com.douban.frodo/7.22.0.beta9(231) Android/23 product/Mate 40 vendor/HUAWEI model/Mate 40 brand/HUAWEI  rom/android  network/wifi  platform/AndroidPad",
    "api-client/1 com.douban.frodo/7.18.0(230) Android/22 product/MI 9 vendor/Xiaomi model/MI 9 brand/Android  rom/miui6  network/wifi  platform/mobile nd/1",
    "api-client/1 com.douban.frodo/7.1.0(205) Android/29 product/perseus vendor/Xiaomi model/Mi MIX 3  rom/miui6  network/wifi  platform/mobile nd/1",
    "api-client/1 com.douban.frodo/7.3.0(207) Android/22 product/MI 9 vendor/Xiaomi model/MI 9 brand/Android  rom/miui6  network/wifi platform/mobile nd/1"]

function getHeader() {
    return {
        "Host": "frodo.douban.com",
        "Connection": "Keep-Alive",
        "Referer": "https://servicewechat.com/wx2f9b06c1de1ccfca/84/page-frame.html",
        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat"
    }
}

function objectToStr(params = null, isBase64Encode = false) {
    let params_str_list = []
    if (params !== null) {
        for (const key of Object.keys(params)) {
            if (isBase64Encode) {
                params_str_list.push(`${key}=${encodeURIComponent(params[key])}`)
            } else {
                params_str_list.push(`${key}=${params[key]}`)
            }

        }
    }

    return params_str_list.join("&")
}

async function fetch(reqUrl, params = null) {
    let header = getHeader()
    reqUrl = reqUrl + `?apikey=${APIKey}`
    let data = objectToStr(params);
    if (!_.isEmpty(data)) {
        reqUrl = reqUrl + "&" + data
    }
    let uri = new Uri(reqUrl);
    let response = await req(uri.toString(), {
        method: "get",
        headers: header,
        data: null,
    });
    if (response.code === 200 || response.code === undefined) {
        if (!_.isEmpty(response.content)) {
            return JSON.parse(response.content)
        } else {
            await JadeLog.error(`请求失败,请求url为:${uri},回复内容为空`)
            return null
        }
    } else {
        await JadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
        return null
    }

}

async function get(url, params) {
    let randomNumber = Math.floor(Math.random() * UserAgents.length); // 生成一个介于0到9之间的随机整数
    let headers = {
        'User-Agent': "api-client/1 com.douban.frodo/7.3.0(207) Android/22 product/MI 9 vendor/Xiaomi model/MI 9 brand/Android  rom/miui6  network/wifi platform/mobile nd/1"
    }

    url = url + "?" + objectToStr(params, true)
    let uri = new Uri(url);
    await JadeLog.info(url)
    let response = await req(uri.toString(), {
        method: "get",
        headers: headers,
        data: null,
    });
    if (response.code === 200 || response.code === undefined) {
        if (!_.isEmpty(response.content)) {
            return JSON.parse(response.content)
        } else {
            await JadeLog.error(`请求失败,请求url为:${uri},回复内容为空`)
            return null
        }
    } else {
        await JadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
        return null
    }

}

function getName() {
    return "🍥┃豆瓣┃🍥"
}

function getAppName() {
    return "豆瓣"
}

async function init(cfg) {
    CatOpenStatus = await SpiderInit(cfg)
    // 读取缓存
}


async function home(filter) {
    await JadeLog.info("正在解析首页类别", true)
    await JadeLog.debug(`首页类别内容为:${homeSpiderResult.setHomeSpiderResult(Classes, [], Filters).toString()}`)
    await JadeLog.info("首页类别解析完成", true)
    return homeSpiderResult.setHomeSpiderResult(Classes, [], Filters).toString()
}

function paraseVodDetailListFromJSONArray(items) {
    let vod_list = []
    for (const item of items) {
        let vod_short = new VodShort()
        vod_short.vod_id = "msearch:" + item["id"]
        vod_short.vod_name = item["title"]
        vod_short.vod_pic = item["pic"][
            "normal"]
        vod_short.vod_remarks = "评分:" + item["rating"]["value"].toString()
        vod_list.push(vod_short);
    }

    return vod_list
}

function paraseVodShortListFromJSONArray(items) {
    let vod_list = []
    for (const item of items) {
        let vod_short = new VodShort()
        vod_short.vod_id = item["target_id"]
        let target = item["target"]
        vod_short.vod_name = target["title"]
        vod_short.vod_pic = target["cover_url"]
        vod_short.vod_remarks = "评分:" + target["rating"]["value"].toString()
        vod_list.push(vod_short);
    }

    return vod_list
}


async function homeVod() {
    let vod_list = []
    if (!CatOpenStatus) {
        await JadeLog.info("正在解析首页内容")
        let url = ApiUrl + "/subject_collection/subject_real_time_hotest/items"
        let response = await fetch(url)
        if (response !== null) {
            let items = response["subject_collection_items"]
            vod_list = paraseVodDetailListFromJSONArray(items)
            await JadeLog.info("首页内容解析成功", true)
        } else {
            await JadeLog.error("首页内容解析失败", true)
        }
        await JadeLog.debug(`首页内容为:${JSON.stringify({"list": vod_list})}`)
    }
    return JSON.stringify({"list": vod_list})
}

function get_tags(extend) {
    let tag_list = []
    for (const key of Object.keys(extend)) {
        if (key !== "sort") {
            tag_list.push(extend[key])
        }
    }
    return tag_list.join(",")
}


async function category(tid, pg, filter, extend) {
    await JadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)}`)
    let sort = extend["sort"] ?? "show_hot";
    let tag_str = get_tags(extend)
    let count = 20
    let start = (parseInt(pg) - 1) * count
    let cateUrl = ""
    let params = {"start": start.toString(), "count": count.toString()}
    let itemKey = "items"
    let vod_list = []
    let page = parseInt(pg)
    switch (tid) {
        case "hot_gaia":
            sort = extend["sort"] ?? "recommend"
            let area = extend["area"] ?? "全部"
            params["sort"] = sort
            params["area"] = area
            cateUrl = "/movie/hot_gaia"
            break
        case "tv_hot":
            let type = extend["type"] ?? "tv_hot"
            cateUrl = "/subject_collection/" + type + "/items"
            itemKey = "subject_collection_items"
            break
        case "show_hot":
            let showType = extend["type"] ?? "show_hot"
            cateUrl = "/subject_collection/" + showType + "/items"
            itemKey = "subject_collection_items";
            break
        case "movie":
            params["sort"] = sort
            params["tags"] = tag_str
            cateUrl = "/movie/recommend"
            break
        case "tv":
            params["sort"] = sort
            params["tags"] = tag_str
            cateUrl = "/tv/recommend"
            break
        case "rank_list_movie":
            let rankMovieType = extend["榜单"] ?? "movie_real_time_hotest"
            cateUrl = "/subject_collection/" + rankMovieType + "/items"
            itemKey = "subject_collection_items"
            break
        case "rank_list_tv":
            let rankTVType = extend["榜单"] ?? "tv_real_time_hotest"
            cateUrl = "/subject_collection/" + rankTVType + "/items"
            itemKey = "subject_collection_items"
            break
        default:
            break
    }
    let response = await fetch(ApiUrl + cateUrl, params)
    if (response !== null) {
        let items = response[itemKey]
        vod_list = paraseVodDetailListFromJSONArray(items)
        await JadeLog.info("分类页解析成功", true)
    } else {
        page = page - 1
        await JadeLog.error("分类页解析失败", true)
    }
    await JadeLog.debug(`首页内容为:${JSON.stringify({"list": vod_list})}`)
    return JSON.stringify({
        page: page,
        list: vod_list,
    })
}


async function detail(id) {
    return JSON.stringify({})
}

async function play(flag, id, flags) {

    return JSON.stringify({});
}

function sign(url, ts, method = 'GET') {
    let _api_secret_key = "bf7dddc7c9cfe6f7"
    let url_path = "%2F" + url.split("/").slice(3).join("%2F")
    let raw_sign = [method.toLocaleUpperCase(), url_path, ts.toString()].join("&")
    return CryptoJS.HmacSHA1(raw_sign, _api_secret_key).toString(CryptoJS.enc.Base64)
}


async function search(wd, quick) {
    let _api_url = "https://frodo.douban.com/api/v2"
    let _api_key = "0dad551ec0f84ed02907ff5c42e8ec70"
    let url = _api_url + "/search/movie"
    let date = new Date()
    let ts = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString()
    let params = {
        '_sig': sign(url, ts), '_ts': ts, 'apiKey': _api_key,
        'count': 20, 'os_rom': 'android', 'q': wd, 'start': 0
    }
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${url}`)
    let vod_list = []
    let response = await get(url, params)
    if (response !== null) {
        vod_list = paraseVodShortListFromJSONArray(response["items"])
        await JadeLog.info("搜索页面解析成功", true)
    } else {
        await JadeLog.error("搜索页面解析失败", true)
    }
    await JadeLog.debug(`搜索页面内容为:${JSON.stringify({"list": vod_list})}`)
    return JSON.stringify({"list": vod_list})
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