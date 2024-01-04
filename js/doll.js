/*
* @File     : doll.js
* @Author   : jade
* @Date     : 2024/1/4 14:15
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     : doll
*/

import {Spider} from "./spider.js";
import {Crypto, load} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";

class Doll extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://hongkongdollvideo.com/"
    }

    getAppName() {
        return "🍥┃玩偶姐姐┃🍥"
    }

    getName() {
        return "玩偶姐姐"
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $("[class=\"stui-vodlist clearfix\"]").find("li")
        for (const vodElement of vodElements) {
            let resource = $(vodElement).find("[class=\"stui-vodlist__thumb lazyload\"]")[0]
            let vodShort = new VodShort()
            vodShort.vod_id = resource.attribs["href"]
            vodShort.vod_name = resource.attribs["title"]
            vodShort.vod_pic = resource.attribs["data-original"]
            vodShort.vod_remarks = $($(resource).find("[class=\"pic-text text-right\"]")[0]).text()
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodPlayFromUrl(play_url) {
        let html = await this.fetch(play_url, null, this.getHeader())
        if (html !== null) {
            let $ = load(html)
        }

    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail()
        let vodElement = $("[class=\"col-pd clearfix\"]")[1]
        let vodShortElement = $(vodElement).find("[class=\"stui-content__thumb\"]")[0]
        let vodItems = []
        for (const playElement of $("[class=\"stui-content__playlist clearfix\"]").find("a")) {
            let episodeUrl = this.siteUrl + playElement.attribs["href"];
            let episodeName = $(playElement).text();
            vodItems.push(episodeName + "$" + episodeUrl);
        }
        vodDetail.vod_name = $(vodShortElement).find("[class=\"stui-vodlist__thumb picture v-thumb\"]")[0].attribs["title"]
        vodDetail.vod_pic = $(vodShortElement).find("img")[0].attribs["data-original"]
        vodDetail.vod_remarks = $($(vodShortElement).find("[class=\"pic-text text-right\"]")[0]).text()
        let data_str = $($(vodElement).find("[class=\"data\"]")).text().replaceAll(" ", " ")
        vodDetail.type_name = Utils.getStrByRegex(/类型：(.*?) /, data_str)
        vodDetail.vod_area = Utils.getStrByRegex(/地区：(.*?) /, data_str)
        vodDetail.vod_year = Utils.getStrByRegex(/年份：(.*?) /, data_str)
        vodDetail.vod_actor = Utils.getStrByRegex(/主演：(.*?) /, data_str)
        vodDetail.vod_director = Utils.getStrByRegex(/导演：(.*?) /, data_str)
        vodDetail.vod_content = $($("[class=\"stui-pannel_bd\"]").find("[class=\"col-pd\"]")).text()
        vodDetail.vod_play_from = "996"
        vodDetail.vod_play_url = vodItems.join("$$$")
        return vodDetail
    }

    async setClasses() {
        let html = await this.fetch(this.siteUrl, null, this.getHeader())
        if (html !== null) {
            let $ = load(html)
            let navElements = $("[class=\"list-unstyled topnav-menu d-flex d-lg-block align-items-center justify-content-center flex-fill topnav-menu-left m-0\"]").find("li")
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
            let index = 1
            for (const navElement of navElements) {
                let type_list = $(navElement).text().split("\n")
                let valueElements = $(navElement).find("a")
                let valueList = []
                let type_id = index.toString()
                for (const valueElement of valueElements) {
                    let title = $(valueElement).text().replaceAll("\n","")
                    let href = valueElement.attribs["href"]
                    if (href !== undefined) {
                        valueList.push({"n": title, "v": href})
                    }
                }
                type_list = type_list.filter(element => element !== "");
                let type_dic = {
                    "type_name": type_list[0],
                    "type_id": type_id
                }
                this.filterObj[type_id] = [{"key": "1", "name": type_list[0], "value": valueList}]
                index = index + 1
                this.classes.push(type_dic)

            }

            let menuElements = $("[id=\"side-menu\"]").find("li")
            for (const menuElement of menuElements) {
                let type_id = $(menuElement).find("a")[0].attribs["href"]
                if (type_id !== undefined) {
                    let type_dic = {
                        "type_name": $(menuElement).text(),
                        "type_id": type_id
                    }
                    this.classes.push(type_dic)
                }
            }
        }

    }

    async setHome(filter) {
        await this.setClasses()

    }

    async setCategory(tid, pg, filter, extend) {
        let cateUrl = ""
        if (tid !== "/") {
            cateUrl = this.siteUrl + tid + `/page/${pg.toString()}.html`
        } else {
            cateUrl = this.siteUrl + tid
        }
        this.limit = 36
        let html = await this.fetch(cateUrl, null, this.getHeader())
        if (html != null) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDoc($)
        }
    }

    async setDetail(id) {
        let detailUrl = this.siteUrl + id
        let html = await this.fetch(detailUrl, null, this.getHeader())
        if (html != null) {
            let $ = load(html)
            this.vodDetail = await this.parseVodDetailFromDoc($)
        }
    }

    async setPlay(flag, id, flags) {
        let html = await this.fetch(id, null, this.getHeader())
        if (html !== null) {
            let matcher = Utils.getStrByRegex(/player_aaaa=(.*?)<\/script>/, html)
            let player = JSON.parse(matcher);
            try {
                this.playUrl = decodeURIComponent(Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(player["url"])))
            } catch (e) {
                await this.jadeLog.error(e)
            }
        }
    }
}

let spider = new Doll()

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