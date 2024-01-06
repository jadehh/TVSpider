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

    getName() {
        return "🔞┃玩偶姐姐┃🔞"
    }

    getAppName() {
        return "玩偶姐姐"
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let vodElements = $("[class=\"row\"]").find("[class=\"video-detail\"]")
        for (const vodElement of vodElements) {
            let vodShort = new VodShort()
            vodShort.vod_id = $(vodElement).find("a")[0].attribs["href"]
            let videoInfoElements = $($(vodElement).find("[class=\"video-info\"]")).find("a")
            vodShort.vod_name = videoInfoElements[0].attribs["title"]
            vodShort.vod_remarks = $(videoInfoElements[1]).text()
            vodShort.vod_pic = this.siteUrl + $(vodElement).find("img")[0].attribs["data-src"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodDetailFromDoc($, key) {
        let vodDetail = new VodDetail()
        let vodElement = $("[class=\"container-fluid\"]")
        vodDetail.vod_name = $($(vodElement).find("[class=\"page-title\"]")[0]).text()
        vodDetail.vod_remarks = $(vodElement).find("[class=\"tag my-1 text-center\"]")[0].attribs["href"].replaceAll("/", "")
        vodDetail.vod_pic = this.siteUrl + $(vodElement).find("video")[0].attribs["poster"]
        let html = $.html()
        let voteTag = Utils.getStrByRegex(/var voteTag="(.*?)";/g, html)
        let videoInfo = JSON.parse(Utils.getStrByRegex(/<script type="application\/ld\+json">(.*?)<\/script>/g, html))
        //
        // try {
        //     let play_url_1 = await this.fetch(videoInfo["contentUrl"], null, this.getHeader())
        //     await this.jadeLog.debug(`播放链接为:${play_url_1}`)
        // } catch (e) {
        //     await this.jadeLog.error(e)
        // }


        voteTag = Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(voteTag))
        let code = []
        for (let i = 0; i < voteTag.length; i++) {
            let k = i % key.length;
            code.push(String.fromCharCode(voteTag.charCodeAt(i) ^ key.charCodeAt(k)))
        }
        let play_url_2 = decodeURIComponent(Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(code.join(""))))
        vodDetail.vod_play_from = "doll"
        vodDetail.vod_play_url = "玩偶姐姐" + "$" + play_url_2
        return vodDetail
    }

    async setClasses() {
        let html = await this.fetch(this.siteUrl, null, this.getHeader())
        if (html !== null) {
            let $ = load(html)
            let navElements = $("[class=\"list-unstyled topnav-menu d-flex d-lg-block align-items-center justify-content-center flex-fill topnav-menu-left m-0\"]").find("li")
            let index = 1
            for (const navElement of navElements) {
                let type_list = $(navElement).text().split("\n")
                let valueElements = $(navElement).find("a")
                let valueList = [{"n": "全部", "v": this.siteUrl}]
                let type_id = index.toString()
                for (const valueElement of valueElements) {
                    let title = $(valueElement).text().replaceAll("\n", "")
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
                this.filterObj[type_id] = []
                let new_value_list = []
                for (let i = 0; i < valueList.length; i++) {
                    new_value_list.push(valueList[i])
                    if (i % 8 === 0 && i !== 0) {
                        this.filterObj[type_id].push({"key": type_id, "name": type_list[0], "value": new_value_list})
                        new_value_list = []
                    }
                }
                this.filterObj[type_id].push({"key": type_id, "name": type_list[0], "value": new_value_list})
                index = index + 1
                this.classes.push(type_dic)

            }

            let menuElements = $("[id=\"side-menu\"]").find("li")
            for (const menuElement of menuElements) {
                let type_id = $(menuElement).find("a")[0].attribs["href"]
                if (type_id !== undefined && type_id.indexOf(this.siteUrl) > -1) {
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
        // await this.setClasses()
        this.filterObj = {
            "1": [
                {
                    "key": "1",
                    "name": "麻豆",
                    "value": [
                        {
                            "n": "全部",
                            "v": "https://hongkongdollvideo.com/"
                        },
                        {
                            "n": "孟若羽",
                            "v": "https://hongkongdollvideo.com/star/孟若羽/"
                        },
                        {
                            "n": "沈娜娜",
                            "v": "https://hongkongdollvideo.com/star/沈娜娜/"
                        },
                        {
                            "n": "夏晴子",
                            "v": "https://hongkongdollvideo.com/star/夏晴子/"
                        },
                        {
                            "n": "吴梦梦",
                            "v": "https://hongkongdollvideo.com/star/吴梦梦/"
                        },
                        {
                            "n": "斑斑",
                            "v": "https://hongkongdollvideo.com/star/斑斑/"
                        },
                        {
                            "n": "林思妤",
                            "v": "https://hongkongdollvideo.com/star/林思妤/"
                        },
                        {
                            "n": "仙儿媛",
                            "v": "https://hongkongdollvideo.com/star/仙儿媛/"
                        },
                        {
                            "n": "妍希",
                            "v": "https://hongkongdollvideo.com/star/妍希/"
                        }
                    ]
                },
                {
                    "key": "1",
                    "name": "麻豆",
                    "value": [
                        {
                            "n": "艾秋",
                            "v": "https://hongkongdollvideo.com/star/艾秋/"
                        },
                        {
                            "n": "苏语棠",
                            "v": "https://hongkongdollvideo.com/star/苏语棠/"
                        },
                        {
                            "n": "李蓉蓉",
                            "v": "https://hongkongdollvideo.com/star/李蓉蓉/"
                        },
                        {
                            "n": "金宝娜",
                            "v": "https://hongkongdollvideo.com/star/金宝娜/"
                        },
                        {
                            "n": "吴芳宜",
                            "v": "https://hongkongdollvideo.com/star/吴芳宜/"
                        },
                        {
                            "n": "季妍希",
                            "v": "https://hongkongdollvideo.com/star/季妍希/"
                        },
                        {
                            "n": "凌薇",
                            "v": "https://hongkongdollvideo.com/star/凌薇/"
                        },
                        {
                            "n": "吴文淇",
                            "v": "https://hongkongdollvideo.com/star/吴文淇/"
                        }
                    ]
                },
                {
                    "key": "1",
                    "name": "麻豆",
                    "value": [
                        {
                            "n": "秦可欣",
                            "v": "https://hongkongdollvideo.com/star/秦可欣/"
                        },
                        {
                            "n": "韩棠",
                            "v": "https://hongkongdollvideo.com/star/韩棠/"
                        },
                        {
                            "n": "佳芯",
                            "v": "https://hongkongdollvideo.com/star/佳芯/"
                        },
                        {
                            "n": "小敏儿",
                            "v": "https://hongkongdollvideo.com/star/小敏儿/"
                        },
                        {
                            "n": "温芮欣",
                            "v": "https://hongkongdollvideo.com/star/温芮欣/"
                        },
                        {
                            "n": "丝丝",
                            "v": "https://hongkongdollvideo.com/star/丝丝/"
                        },
                        {
                            "n": "唐茜",
                            "v": "https://hongkongdollvideo.com/star/唐茜/"
                        },
                        {
                            "n": "白允儿",
                            "v": "https://hongkongdollvideo.com/star/白允儿/"
                        }
                    ]
                },
                {
                    "key": "1",
                    "name": "麻豆",
                    "value": [
                        {
                            "n": "莉娜",
                            "v": "https://hongkongdollvideo.com/star/莉娜/"
                        },
                        {
                            "n": "徐蕾",
                            "v": "https://hongkongdollvideo.com/star/徐蕾/"
                        },
                        {
                            "n": "苏清歌",
                            "v": "https://hongkongdollvideo.com/star/苏清歌/"
                        },
                        {
                            "n": "玥可岚",
                            "v": "https://hongkongdollvideo.com/star/玥可岚/"
                        },
                        {
                            "n": "李娜娜",
                            "v": "https://hongkongdollvideo.com/star/李娜娜/"
                        },
                        {
                            "n": "苡若",
                            "v": "https://hongkongdollvideo.com/star/苡若/"
                        },
                        {
                            "n": "冉冉",
                            "v": "https://hongkongdollvideo.com/star/冉冉/"
                        },
                        {
                            "n": "雪千夏",
                            "v": "https://hongkongdollvideo.com/star/雪千夏/"
                        }
                    ]
                },
                {
                    "key": "1",
                    "name": "麻豆",
                    "value": [
                        {
                            "n": "管明美",
                            "v": "https://hongkongdollvideo.com/star/管明美/"
                        },
                        {
                            "n": "白熙雨",
                            "v": "https://hongkongdollvideo.com/star/白熙雨/"
                        },
                        {
                            "n": "蜜苏",
                            "v": "https://hongkongdollvideo.com/star/蜜苏/"
                        },
                        {
                            "n": "周甯",
                            "v": "https://hongkongdollvideo.com/star/周甯/"
                        },
                        {
                            "n": "宋南伊",
                            "v": "https://hongkongdollvideo.com/star/宋南伊/"
                        },
                        {
                            "n": "尤莉",
                            "v": "https://hongkongdollvideo.com/star/尤莉/"
                        },
                        {
                            "n": "梁芸菲",
                            "v": "https://hongkongdollvideo.com/star/梁芸菲/"
                        },
                        {
                            "n": "许木学长",
                            "v": "https://hongkongdollvideo.com/star/许木学长/"
                        }
                    ]
                },
                {
                    "key": "1",
                    "name": "麻豆",
                    "value": [
                        {
                            "n": "西门庆",
                            "v": "https://hongkongdollvideo.com/star/西门庆/"
                        },
                        {
                            "n": "宛冰",
                            "v": "https://hongkongdollvideo.com/star/宛冰/"
                        },
                        {
                            "n": "乐奈子",
                            "v": "https://hongkongdollvideo.com/star/乐奈子/"
                        },
                        {
                            "n": "林嫣",
                            "v": "https://hongkongdollvideo.com/star/林嫣/"
                        },
                        {
                            "n": "寻小小",
                            "v": "https://hongkongdollvideo.com/star/寻小小/"
                        },
                        {
                            "n": "林沁儿",
                            "v": "https://hongkongdollvideo.com/star/林沁儿/"
                        },
                        {
                            "n": "楚梦舒",
                            "v": "https://hongkongdollvideo.com/star/楚梦舒/"
                        },
                        {
                            "n": "舒可芯",
                            "v": "https://hongkongdollvideo.com/star/舒可芯/"
                        }
                    ]
                },
                {
                    "key": "1",
                    "name": "麻豆",
                    "value": [
                        {
                            "n": "白沛瑶",
                            "v": "https://hongkongdollvideo.com/star/白沛瑶/"
                        },
                        {
                            "n": "袁子仪",
                            "v": "https://hongkongdollvideo.com/star/袁子仪/"
                        },
                        {
                            "n": "香菱",
                            "v": "https://hongkongdollvideo.com/star/香菱/"
                        },
                        {
                            "n": "优娜",
                            "v": "https://hongkongdollvideo.com/star/优娜/"
                        },
                        {
                            "n": "张芸熙",
                            "v": "https://hongkongdollvideo.com/star/张芸熙/"
                        },
                        {
                            "n": "艾玛",
                            "v": "https://hongkongdollvideo.com/star/艾玛/"
                        },
                        {
                            "n": "白靖寒",
                            "v": "https://hongkongdollvideo.com/star/白靖寒/"
                        },
                        {
                            "n": "小婕",
                            "v": "https://hongkongdollvideo.com/star/小婕/"
                        }
                    ]
                },
                {
                    "key": "1",
                    "name": "麻豆",
                    "value": [
                        {
                            "n": "雪霏",
                            "v": "https://hongkongdollvideo.com/star/雪霏/"
                        },
                        {
                            "n": "湘湘",
                            "v": "https://hongkongdollvideo.com/star/湘湘/"
                        },
                        {
                            "n": "李允熙",
                            "v": "https://hongkongdollvideo.com/star/李允熙/"
                        },
                        {
                            "n": "雷梦娜",
                            "v": "https://hongkongdollvideo.com/star/雷梦娜/"
                        }
                    ]
                }
            ],
            "2": [
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "全部",
                            "v": "https://hongkongdollvideo.com/"
                        },
                        {
                            "n": "乱伦",
                            "v": "https://hongkongdollvideo.com/tag/乱伦/"
                        },
                        {
                            "n": "萝莉",
                            "v": "https://hongkongdollvideo.com/tag/萝莉/"
                        },
                        {
                            "n": "巨乳",
                            "v": "https://hongkongdollvideo.com/tag/巨乳/"
                        },
                        {
                            "n": "爆操",
                            "v": "https://hongkongdollvideo.com/tag/爆操/"
                        },
                        {
                            "n": "丝袜",
                            "v": "https://hongkongdollvideo.com/tag/丝袜/"
                        },
                        {
                            "n": "性感",
                            "v": "https://hongkongdollvideo.com/tag/性感/"
                        },
                        {
                            "n": "淫荡",
                            "v": "https://hongkongdollvideo.com/tag/淫荡/"
                        },
                        {
                            "n": "女友",
                            "v": "https://hongkongdollvideo.com/tag/女友/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "高潮",
                            "v": "https://hongkongdollvideo.com/tag/高潮/"
                        },
                        {
                            "n": "少妇",
                            "v": "https://hongkongdollvideo.com/tag/少妇/"
                        },
                        {
                            "n": "极品",
                            "v": "https://hongkongdollvideo.com/tag/极品/"
                        },
                        {
                            "n": "诱惑",
                            "v": "https://hongkongdollvideo.com/tag/诱惑/"
                        },
                        {
                            "n": "人妻",
                            "v": "https://hongkongdollvideo.com/tag/人妻/"
                        },
                        {
                            "n": "黑丝",
                            "v": "https://hongkongdollvideo.com/tag/黑丝/"
                        },
                        {
                            "n": "内射",
                            "v": "https://hongkongdollvideo.com/tag/内射/"
                        },
                        {
                            "n": "调教",
                            "v": "https://hongkongdollvideo.com/tag/调教/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "勾引",
                            "v": "https://hongkongdollvideo.com/tag/勾引/"
                        },
                        {
                            "n": "强上",
                            "v": "https://hongkongdollvideo.com/tag/强上/"
                        },
                        {
                            "n": "女神",
                            "v": "https://hongkongdollvideo.com/tag/女神/"
                        },
                        {
                            "n": "美女",
                            "v": "https://hongkongdollvideo.com/tag/美女/"
                        },
                        {
                            "n": "做爱",
                            "v": "https://hongkongdollvideo.com/tag/做爱/"
                        },
                        {
                            "n": "偷情",
                            "v": "https://hongkongdollvideo.com/tag/偷情/"
                        },
                        {
                            "n": "性奴",
                            "v": "https://hongkongdollvideo.com/tag/性奴/"
                        },
                        {
                            "n": "女优",
                            "v": "https://hongkongdollvideo.com/tag/女优/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "无套",
                            "v": "https://hongkongdollvideo.com/tag/无套/"
                        },
                        {
                            "n": "骚逼",
                            "v": "https://hongkongdollvideo.com/tag/骚逼/"
                        },
                        {
                            "n": "素人",
                            "v": "https://hongkongdollvideo.com/tag/素人/"
                        },
                        {
                            "n": "大屌",
                            "v": "https://hongkongdollvideo.com/tag/大屌/"
                        },
                        {
                            "n": "按摩",
                            "v": "https://hongkongdollvideo.com/tag/按摩/"
                        },
                        {
                            "n": "约炮",
                            "v": "https://hongkongdollvideo.com/tag/约炮/"
                        },
                        {
                            "n": "大学生",
                            "v": "https://hongkongdollvideo.com/tag/大学生/"
                        },
                        {
                            "n": "清纯",
                            "v": "https://hongkongdollvideo.com/tag/清纯/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "女奴",
                            "v": "https://hongkongdollvideo.com/tag/女奴/"
                        },
                        {
                            "n": "饥渴",
                            "v": "https://hongkongdollvideo.com/tag/饥渴/"
                        },
                        {
                            "n": "淫乱",
                            "v": "https://hongkongdollvideo.com/tag/淫乱/"
                        },
                        {
                            "n": "迷奸",
                            "v": "https://hongkongdollvideo.com/tag/迷奸/"
                        },
                        {
                            "n": "口交",
                            "v": "https://hongkongdollvideo.com/tag/口交/"
                        },
                        {
                            "n": "护士",
                            "v": "https://hongkongdollvideo.com/tag/护士/"
                        },
                        {
                            "n": "抽插",
                            "v": "https://hongkongdollvideo.com/tag/抽插/"
                        },
                        {
                            "n": "嫩穴",
                            "v": "https://hongkongdollvideo.com/tag/嫩穴/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "骚货",
                            "v": "https://hongkongdollvideo.com/tag/骚货/"
                        },
                        {
                            "n": "母狗",
                            "v": "https://hongkongdollvideo.com/tag/母狗/"
                        },
                        {
                            "n": "SM",
                            "v": "https://hongkongdollvideo.com/tag/SM/"
                        },
                        {
                            "n": "中出",
                            "v": "https://hongkongdollvideo.com/tag/中出/"
                        },
                        {
                            "n": "情趣",
                            "v": "https://hongkongdollvideo.com/tag/情趣/"
                        },
                        {
                            "n": "3P",
                            "v": "https://hongkongdollvideo.com/tag/3P/"
                        },
                        {
                            "n": "小穴",
                            "v": "https://hongkongdollvideo.com/tag/小穴/"
                        },
                        {
                            "n": "爆乳",
                            "v": "https://hongkongdollvideo.com/tag/爆乳/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "学生妹",
                            "v": "https://hongkongdollvideo.com/tag/学生妹/"
                        },
                        {
                            "n": "自慰",
                            "v": "https://hongkongdollvideo.com/tag/自慰/"
                        },
                        {
                            "n": "学姐",
                            "v": "https://hongkongdollvideo.com/tag/学姐/"
                        },
                        {
                            "n": "模特",
                            "v": "https://hongkongdollvideo.com/tag/模特/"
                        },
                        {
                            "n": "主播",
                            "v": "https://hongkongdollvideo.com/tag/主播/"
                        },
                        {
                            "n": "变态",
                            "v": "https://hongkongdollvideo.com/tag/变态/"
                        },
                        {
                            "n": "空姐",
                            "v": "https://hongkongdollvideo.com/tag/空姐/"
                        },
                        {
                            "n": "御姐",
                            "v": "https://hongkongdollvideo.com/tag/御姐/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "美乳",
                            "v": "https://hongkongdollvideo.com/tag/美乳/"
                        },
                        {
                            "n": "色诱",
                            "v": "https://hongkongdollvideo.com/tag/色诱/"
                        },
                        {
                            "n": "外围",
                            "v": "https://hongkongdollvideo.com/tag/外围/"
                        },
                        {
                            "n": "反差",
                            "v": "https://hongkongdollvideo.com/tag/反差/"
                        },
                        {
                            "n": "破处",
                            "v": "https://hongkongdollvideo.com/tag/破处/"
                        },
                        {
                            "n": "后入",
                            "v": "https://hongkongdollvideo.com/tag/后入/"
                        },
                        {
                            "n": "白虎",
                            "v": "https://hongkongdollvideo.com/tag/白虎/"
                        },
                        {
                            "n": "性欲强",
                            "v": "https://hongkongdollvideo.com/tag/性欲强/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "长腿",
                            "v": "https://hongkongdollvideo.com/tag/长腿/"
                        },
                        {
                            "n": "淫水",
                            "v": "https://hongkongdollvideo.com/tag/淫水/"
                        },
                        {
                            "n": "白丝",
                            "v": "https://hongkongdollvideo.com/tag/白丝/"
                        },
                        {
                            "n": "网红",
                            "v": "https://hongkongdollvideo.com/tag/网红/"
                        },
                        {
                            "n": "欲女",
                            "v": "https://hongkongdollvideo.com/tag/欲女/"
                        },
                        {
                            "n": "口爆",
                            "v": "https://hongkongdollvideo.com/tag/口爆/"
                        },
                        {
                            "n": "瑜伽",
                            "v": "https://hongkongdollvideo.com/tag/瑜伽/"
                        },
                        {
                            "n": "肉便器",
                            "v": "https://hongkongdollvideo.com/tag/肉便器/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "潮吹",
                            "v": "https://hongkongdollvideo.com/tag/潮吹/"
                        },
                        {
                            "n": "高冷",
                            "v": "https://hongkongdollvideo.com/tag/高冷/"
                        },
                        {
                            "n": "硬上",
                            "v": "https://hongkongdollvideo.com/tag/硬上/"
                        },
                        {
                            "n": "技师",
                            "v": "https://hongkongdollvideo.com/tag/技师/"
                        },
                        {
                            "n": "按摩师",
                            "v": "https://hongkongdollvideo.com/tag/按摩师/"
                        },
                        {
                            "n": "双飞",
                            "v": "https://hongkongdollvideo.com/tag/双飞/"
                        },
                        {
                            "n": "制服",
                            "v": "https://hongkongdollvideo.com/tag/制服/"
                        },
                        {
                            "n": "炮友",
                            "v": "https://hongkongdollvideo.com/tag/炮友/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "肉欲",
                            "v": "https://hongkongdollvideo.com/tag/肉欲/"
                        },
                        {
                            "n": "骑乘",
                            "v": "https://hongkongdollvideo.com/tag/骑乘/"
                        },
                        {
                            "n": "足交",
                            "v": "https://hongkongdollvideo.com/tag/足交/"
                        },
                        {
                            "n": "情侣",
                            "v": "https://hongkongdollvideo.com/tag/情侣/"
                        },
                        {
                            "n": "女王",
                            "v": "https://hongkongdollvideo.com/tag/女王/"
                        },
                        {
                            "n": "大胸",
                            "v": "https://hongkongdollvideo.com/tag/大胸/"
                        },
                        {
                            "n": "捆绑",
                            "v": "https://hongkongdollvideo.com/tag/捆绑/"
                        },
                        {
                            "n": "淫妻",
                            "v": "https://hongkongdollvideo.com/tag/淫妻/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "骚妻",
                            "v": "https://hongkongdollvideo.com/tag/骚妻/"
                        },
                        {
                            "n": "女秘书",
                            "v": "https://hongkongdollvideo.com/tag/女秘书/"
                        },
                        {
                            "n": "娇妻",
                            "v": "https://hongkongdollvideo.com/tag/娇妻/"
                        },
                        {
                            "n": "凌辱",
                            "v": "https://hongkongdollvideo.com/tag/凌辱/"
                        },
                        {
                            "n": "尤物",
                            "v": "https://hongkongdollvideo.com/tag/尤物/"
                        },
                        {
                            "n": "引诱",
                            "v": "https://hongkongdollvideo.com/tag/引诱/"
                        },
                        {
                            "n": "美少女",
                            "v": "https://hongkongdollvideo.com/tag/美少女/"
                        },
                        {
                            "n": "蜜穴",
                            "v": "https://hongkongdollvideo.com/tag/蜜穴/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "痴汉",
                            "v": "https://hongkongdollvideo.com/tag/痴汉/"
                        },
                        {
                            "n": "JK制服",
                            "v": "https://hongkongdollvideo.com/tag/JK制服/"
                        },
                        {
                            "n": "熟女",
                            "v": "https://hongkongdollvideo.com/tag/熟女/"
                        },
                        {
                            "n": "车震",
                            "v": "https://hongkongdollvideo.com/tag/车震/"
                        },
                        {
                            "n": "4P",
                            "v": "https://hongkongdollvideo.com/tag/4P/"
                        },
                        {
                            "n": "挑逗",
                            "v": "https://hongkongdollvideo.com/tag/挑逗/"
                        },
                        {
                            "n": "偷窥",
                            "v": "https://hongkongdollvideo.com/tag/偷窥/"
                        },
                        {
                            "n": "骚妇",
                            "v": "https://hongkongdollvideo.com/tag/骚妇/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "伦理",
                            "v": "https://hongkongdollvideo.com/tag/伦理/"
                        },
                        {
                            "n": "颜射",
                            "v": "https://hongkongdollvideo.com/tag/颜射/"
                        },
                        {
                            "n": "美腿",
                            "v": "https://hongkongdollvideo.com/tag/美腿/"
                        },
                        {
                            "n": "健身教练",
                            "v": "https://hongkongdollvideo.com/tag/健身教练/"
                        },
                        {
                            "n": "兔女郎",
                            "v": "https://hongkongdollvideo.com/tag/兔女郎/"
                        },
                        {
                            "n": "双插",
                            "v": "https://hongkongdollvideo.com/tag/双插/"
                        },
                        {
                            "n": "肉丝",
                            "v": "https://hongkongdollvideo.com/tag/肉丝/"
                        },
                        {
                            "n": "深喉",
                            "v": "https://hongkongdollvideo.com/tag/深喉/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "母子",
                            "v": "https://hongkongdollvideo.com/tag/母子/"
                        },
                        {
                            "n": "美臀",
                            "v": "https://hongkongdollvideo.com/tag/美臀/"
                        },
                        {
                            "n": "美鲍",
                            "v": "https://hongkongdollvideo.com/tag/美鲍/"
                        },
                        {
                            "n": "吞精",
                            "v": "https://hongkongdollvideo.com/tag/吞精/"
                        },
                        {
                            "n": "操逼",
                            "v": "https://hongkongdollvideo.com/tag/操逼/"
                        },
                        {
                            "n": "蜜桃臀",
                            "v": "https://hongkongdollvideo.com/tag/蜜桃臀/"
                        },
                        {
                            "n": "肛交",
                            "v": "https://hongkongdollvideo.com/tag/肛交/"
                        },
                        {
                            "n": "粉穴",
                            "v": "https://hongkongdollvideo.com/tag/粉穴/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "肥臀",
                            "v": "https://hongkongdollvideo.com/tag/肥臀/"
                        },
                        {
                            "n": "女上位",
                            "v": "https://hongkongdollvideo.com/tag/女上位/"
                        },
                        {
                            "n": "舔逼",
                            "v": "https://hongkongdollvideo.com/tag/舔逼/"
                        },
                        {
                            "n": "啪啪啪",
                            "v": "https://hongkongdollvideo.com/tag/啪啪啪/"
                        },
                        {
                            "n": "一线天",
                            "v": "https://hongkongdollvideo.com/tag/一线天/"
                        },
                        {
                            "n": "男奴",
                            "v": "https://hongkongdollvideo.com/tag/男奴/"
                        },
                        {
                            "n": "推油",
                            "v": "https://hongkongdollvideo.com/tag/推油/"
                        },
                        {
                            "n": "舔脚",
                            "v": "https://hongkongdollvideo.com/tag/舔脚/"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "标签",
                    "value": [
                        {
                            "n": "69式",
                            "v": "https://hongkongdollvideo.com/tag/69式/"
                        },
                        {
                            "n": "馒头逼",
                            "v": "https://hongkongdollvideo.com/tag/馒头逼/"
                        },
                        {
                            "n": "蝴蝶逼",
                            "v": "https://hongkongdollvideo.com/tag/蝴蝶逼/"
                        }
                    ]
                }
            ],
            "3": [
                {
                    "key": "3",
                    "name": "热门",
                    "value": [
                        {
                            "n": "全部",
                            "v": "https://hongkongdollvideo.com/"
                        },
                        {
                            "n": "最近一天",
                            "v": "https://hongkongdollvideo.com/hot/yesterday/"
                        },
                        {
                            "n": "最近一周",
                            "v": "https://hongkongdollvideo.com/hot/recentweek/"
                        },
                        {
                            "n": "本周",
                            "v": "https://hongkongdollvideo.com/hot/thisweek/"
                        },
                        {
                            "n": "上周",
                            "v": "https://hongkongdollvideo.com/hot/lastweek/"
                        },
                        {
                            "n": "最近一个月",
                            "v": "https://hongkongdollvideo.com/hot/recentmonth/"
                        },
                        {
                            "n": "本月",
                            "v": "https://hongkongdollvideo.com/hot/thismonth/"
                        },
                        {
                            "n": "上月",
                            "v": "https://hongkongdollvideo.com/hot/lastmonth/"
                        },
                        {
                            "n": "最近三个月",
                            "v": "https://hongkongdollvideo.com/hot/recent3month/"
                        }
                    ]
                },
                {
                    "key": "3",
                    "name": "热门",
                    "value": [
                        {
                            "n": "最近半年",
                            "v": "https://hongkongdollvideo.com/hot/recent6month/"
                        },
                        {
                            "n": "最近一年",
                            "v": "https://hongkongdollvideo.com/hot/recentyear/"
                        }
                    ]
                }
            ]
        }
        this.classes = [
            {
                "type_name": "麻豆",
                "type_id": "1"
            },
            {
                "type_name": "标签",
                "type_id": "2"
            },
            {
                "type_name": "热门",
                "type_id": "3"
            },
            {
                "type_name": "最新",
                "type_id": "https://hongkongdollvideo.com/latest/"
            },
            {
                "type_name": "麻豆传媒映画",
                "type_id": "https://hongkongdollvideo.com/麻豆传媒映画/"
            },
            {
                "type_name": "91制片厂",
                "type_id": "https://hongkongdollvideo.com/91制片厂/"
            },
            {
                "type_name": "天美传媒",
                "type_id": "https://hongkongdollvideo.com/天美传媒/"
            },
            {
                "type_name": "69FILMS",
                "type_id": "https://hongkongdollvideo.com/69FILMS/"
            },
            {
                "type_name": "蜜桃影像传媒",
                "type_id": "https://hongkongdollvideo.com/蜜桃影像传媒/"
            },
            {
                "type_name": "皇家华人",
                "type_id": "https://hongkongdollvideo.com/皇家华人/"
            },
            {
                "type_name": "星空无限传媒",
                "type_id": "https://hongkongdollvideo.com/星空无限传媒/"
            },
            {
                "type_name": "精东影业",
                "type_id": "https://hongkongdollvideo.com/精东影业/"
            },
            {
                "type_name": "乐播传媒",
                "type_id": "https://hongkongdollvideo.com/乐播传媒/"
            },
            {
                "type_name": "成人头条",
                "type_id": "https://hongkongdollvideo.com/成人头条/"
            },
            {
                "type_name": "乌鸦传媒",
                "type_id": "https://hongkongdollvideo.com/乌鸦传媒/"
            },
            {
                "type_name": "兔子先生",
                "type_id": "https://hongkongdollvideo.com/兔子先生/"
            },
            {
                "type_name": "杏吧原创",
                "type_id": "https://hongkongdollvideo.com/杏吧原创/"
            },
            {
                "type_name": "mini传媒",
                "type_id": "https://hongkongdollvideo.com/mini传媒/"
            },
            {
                "type_name": "大象传媒",
                "type_id": "https://hongkongdollvideo.com/大象传媒/"
            },
            {
                "type_name": "开心鬼传媒",
                "type_id": "https://hongkongdollvideo.com/开心鬼传媒/"
            },
            {
                "type_name": "PsychoPorn",
                "type_id": "https://hongkongdollvideo.com/PsychoPorn/"
            },
            {
                "type_name": "糖心Vlog",
                "type_id": "https://hongkongdollvideo.com/糖心Vlog/"
            },
            {
                "type_name": "爱豆传媒",
                "type_id": "https://hongkongdollvideo.com/爱豆传媒/"
            },
            {
                "type_name": "性视界传媒",
                "type_id": "https://hongkongdollvideo.com/性视界传媒/"
            },
            {
                "type_name": "草霉视频",
                "type_id": "https://hongkongdollvideo.com/草霉视频/"
            },
            {
                "type_name": "果冻传媒",
                "type_id": "https://hongkongdollvideo.com/果冻传媒/"
            },
            {
                "type_name": "猫爪影像",
                "type_id": "https://hongkongdollvideo.com/猫爪影像/"
            },
            {
                "type_name": "萝莉社",
                "type_id": "https://hongkongdollvideo.com/萝莉社/"
            },
            {
                "type_name": "SA国际传媒",
                "type_id": "https://hongkongdollvideo.com/SA国际传媒/"
            },
            {
                "type_name": "猛料原创",
                "type_id": "https://hongkongdollvideo.com/猛料原创/"
            },
            {
                "type_name": "天美影视",
                "type_id": "https://hongkongdollvideo.com/天美影视/"
            },
            {
                "type_name": "91茄子",
                "type_id": "https://hongkongdollvideo.com/91茄子/"
            },
            {
                "type_name": "乌托邦传媒",
                "type_id": "https://hongkongdollvideo.com/乌托邦传媒/"
            },
            {
                "type_name": "麻豆传媒映画",
                "type_id": "https://hongkongdollvideo.com/麻豆传媒映画/"
            },
            {
                "type_name": "91制片厂",
                "type_id": "https://hongkongdollvideo.com/91制片厂/"
            },
            {
                "type_name": "天美传媒",
                "type_id": "https://hongkongdollvideo.com/天美传媒/"
            },
            {
                "type_name": "69FILMS",
                "type_id": "https://hongkongdollvideo.com/69FILMS/"
            },
            {
                "type_name": "蜜桃影像传媒",
                "type_id": "https://hongkongdollvideo.com/蜜桃影像传媒/"
            },
            {
                "type_name": "皇家华人",
                "type_id": "https://hongkongdollvideo.com/皇家华人/"
            },
            {
                "type_name": "星空无限传媒",
                "type_id": "https://hongkongdollvideo.com/星空无限传媒/"
            },
            {
                "type_name": "精东影业",
                "type_id": "https://hongkongdollvideo.com/精东影业/"
            },
            {
                "type_name": "乐播传媒",
                "type_id": "https://hongkongdollvideo.com/乐播传媒/"
            },
            {
                "type_name": "成人头条",
                "type_id": "https://hongkongdollvideo.com/成人头条/"
            },
            {
                "type_name": "乌鸦传媒",
                "type_id": "https://hongkongdollvideo.com/乌鸦传媒/"
            },
            {
                "type_name": "兔子先生",
                "type_id": "https://hongkongdollvideo.com/兔子先生/"
            },
            {
                "type_name": "杏吧原创",
                "type_id": "https://hongkongdollvideo.com/杏吧原创/"
            },
            {
                "type_name": "mini传媒",
                "type_id": "https://hongkongdollvideo.com/mini传媒/"
            },
            {
                "type_name": "大象传媒",
                "type_id": "https://hongkongdollvideo.com/大象传媒/"
            },
            {
                "type_name": "开心鬼传媒",
                "type_id": "https://hongkongdollvideo.com/开心鬼传媒/"
            },
            {
                "type_name": "PsychoPorn",
                "type_id": "https://hongkongdollvideo.com/PsychoPorn/"
            },
            {
                "type_name": "糖心Vlog",
                "type_id": "https://hongkongdollvideo.com/糖心Vlog/"
            },
            {
                "type_name": "爱豆传媒",
                "type_id": "https://hongkongdollvideo.com/爱豆传媒/"
            },
            {
                "type_name": "性视界传媒",
                "type_id": "https://hongkongdollvideo.com/性视界传媒/"
            },
            {
                "type_name": "草霉视频",
                "type_id": "https://hongkongdollvideo.com/草霉视频/"
            },
            {
                "type_name": "果冻传媒",
                "type_id": "https://hongkongdollvideo.com/果冻传媒/"
            },
            {
                "type_name": "猫爪影像",
                "type_id": "https://hongkongdollvideo.com/猫爪影像/"
            },
            {
                "type_name": "萝莉社",
                "type_id": "https://hongkongdollvideo.com/萝莉社/"
            },
            {
                "type_name": "SA国际传媒",
                "type_id": "https://hongkongdollvideo.com/SA国际传媒/"
            },
            {
                "type_name": "猛料原创",
                "type_id": "https://hongkongdollvideo.com/猛料原创/"
            },
            {
                "type_name": "天美影视",
                "type_id": "https://hongkongdollvideo.com/天美影视/"
            },
            {
                "type_name": "91茄子",
                "type_id": "https://hongkongdollvideo.com/91茄子/"
            },
            {
                "type_name": "乌托邦传媒",
                "type_id": "https://hongkongdollvideo.com/乌托邦传媒/"
            }
        ]
    }

    async setCategory(tid, pg, filter, extend) {
        let cateUrl = ""
        if (tid.indexOf(this.siteUrl) > -1) {
            cateUrl = tid + pg.toString() + ".html"
        } else {
            cateUrl = extend [tid] ?? this.siteUrl
        }
        this.limit = 36
        let html = await this.fetch(cateUrl, null, this.getHeader())
        if (html != null) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDoc($)
        }
    }

    async setDetail(id) {
        let html = await this.fetch(id, null, this.getHeader())
        if (html != null) {
            let $ = load(html)
            let key = Utils.getStrByRegex(/video\/(\w+).html/, id)
            this.vodDetail = await this.parseVodDetailFromDoc($, key)
        }
    }

    async setPlay(flag, id, flags) {
        this.playUrl = id
        this.playHeader = {}
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