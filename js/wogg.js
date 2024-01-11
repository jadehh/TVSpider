/*
 * @Author: samples jadehh@live.com
 * @Date: 2023-12-14 11:03:04
 * @LastEditors: samples jadehh@live.com
 * @LastEditTime: 2023-12-14 11:03:04
 * @FilePath: js/wogg.js
 * @Description: 玩偶哥哥爬虫类
 */
import {_, load} from '../lib/cat.js';
import {VodDetail, VodShort} from "../lib/vod.js"
import {detailContent, initAli, playContent} from "../lib/ali.js";
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";
let patternAli  = /(https:\/\/www\.aliyundrive\.com\/s\/[^"]+|https:\/\/www\.alipan\.com\/s\/[^"]+)/
class WoggSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = 'https://tvfan.xxooo.cf';
    }

    async init(cfg) {
        let extObj = await super.init(cfg);
        await initAli(extObj["token"]);
    }

    getName() {
        return "💂‍┃阿里玩偶┃💂"
    }

    getAppName() {
        return "阿里玩偶"
    }

    async parseVodShortListFromDoc($) {
        let items = $('.module-item');
        let vod_list = [];
        for (const item of items) {
            let vodShort = new VodShort()
            let oneA = $(item).find('.module-item-cover .module-item-pic a').first();
            vodShort.vod_id = oneA.attr('href');
            vodShort.vod_name = oneA.attr('title');
            vodShort.vod_pic = $(item).find('.module-item-cover .module-item-pic img').first().attr('data-src');
            if (vodShort.vod_pic.indexOf("img.php?url=") > 0) {
                vodShort.vod_pic = vodShort.vod_pic.split("img.php?url=")[1]
            }
            vodShort.vod_remarks = $(item).find('.module-item-text').first().text();
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail()
        vodDetail.vod_name = $('.page-title')[0].children[0].data
        vodDetail.vod_pic = $($(".mobile-play")).find(".lazyload")[0].attribs["data-src"]
        let video_info_aux_list = $($(".video-info-aux")).find(".tag-link")[1].children
        for (const video_info_aux of video_info_aux_list) {
            try {
                vodDetail.type_name = vodDetail.type_name + video_info_aux.children[0].data
            } catch {

            }
        }
        let video_items = $('.video-info-items')
        vodDetail.vod_director = $(video_items[0]).find("a")[0].children[0].data
        let vidoe_info_actor_list = $(video_items[1]).find("a")
        let actor_list = []
        for (const vidoe_info_actor of vidoe_info_actor_list) {
            actor_list.push(vidoe_info_actor.children[0].data)
        }
        vodDetail.vod_actor = actor_list.join(" * ")
        vodDetail.vod_year = $(video_items[2]).find("a")[0].children[0].data
        vodDetail.vod_remarks = `清晰度:${$(video_items[3]).find("div")[0].children[0].data}, 制作人:Jade`
        vodDetail.vod_content = $(video_items[4]).find("p")[0].children[0].data

        vodDetail.vod_content = vodDetail.vod_content.replace("[收起部分]", "").replace("[展开全部]", "")
        const share_url_list = [];
        let items = $('.module-row-info')
        for (const item of items) {
            let aliUrl = $(item).find("p")[0].children[0].data
            let matches = aliUrl.match(patternAli);
            if (!_.isEmpty(matches)) share_url_list.push(matches[1])
        }
        if (share_url_list.length > 0) {
            let aliVodDetail = await detailContent(share_url_list)
            vodDetail.vod_play_url = aliVodDetail.vod_play_url
            vodDetail.vod_play_from = aliVodDetail.vod_play_from
        } else {
            await this.jadeLog.warning(`获取详情界面失败,失败原因为:没有分享链接`)
        }
        return vodDetail

    }

    async parseVodShortListFromDocBySearch($) {
        let items = $('.module-search-item');
        let vod_list = [];
        for (const item of items) {
            let vodShort = new VodShort()
            vodShort.vod_id = $(item).find(".video-serial")[0].attribs.href;
            vodShort.vod_name = $(item).find(".video-serial")[0].attribs.title;
            vodShort.vod_pic = $(item).find(".module-item-pic > img")[0].attribs['data-src'];
            vodShort.vod_remarks = '';
            vod_list.push(vodShort);
        }
        return vod_list
    }

    get_extend_sort_dic(tid) {
        /***
         tid为1,2,3的时候,电影,剧情,动漫
         urlParams#0表示类别,1表示全部地区,2表示人气评分,3表示全部剧情,4表示全部语言,5表示字母查找,6表示页数,11表示时间
         #key为1,代表全部剧情
         #key为2,代表全部地区
         #key为3,代表全部语言
         #key为4,代表全部时间
         #key为5,字幕查找
         #key为6,时间排序
         https://www.wogg.xyz/index.php/vodshow/1-全部地区-时间排序-全部剧情-全部语言-字幕查找------全部时间.html

         tid为4,综艺
         #key为1,代表全部地区
         #key为2,代表全部时间
         #key为3,字幕查找
         #key为4,时间排序
         https://tvfan.xxooo.cf/index.php/vodshow/4-全部地区-时间排序---字母查找------全部时间.html

         tid为5:音乐
         #key为1,字幕查找
         #key为2,时间排序
         https://tvfan.xxooo.cf/index.php/vodshow/5--时间排序---字幕查找------.html

         tid为6,短剧
         #key为1,代表全部剧情
         #key为2,代表全部地区
         #key为3,代表全部时间
         #key为4,字幕查找
         #key为5,时间排序
         https://tvfan.xxooo.cf/index.php/vodshow/6-全部地区-时间排序-全部剧情--字母查找------全部时间.html
         */
        let extend_dic = {}
        if (tid < 4) {
            extend_dic = {
                "1": 3, "2": 1, "3": 4, "4": 11, "5": 5, "6": 2
            }
        } else if (tid === 4) {
            extend_dic = {
                "1": 1, "2": 11, "3": 5, "4": 2,
            }
        } else if (tid === 6) {
            extend_dic = {
                "1": 3, "2": 1, "3": 11, "4": 5, "5": 2,
            }
        } else if (tid === 5) {
            extend_dic = {
                "1": 5, "2": 2,
            }
        }

        return extend_dic
    }

    async setClasses() {
        let con = await this.fetch(this.siteUrl,null,this.getHeader());
        if (!_.isEmpty(con)) {
            const $ = load(con);
            let elements = $('.nav-link')
            for (const element of elements) {
                let type_id = parseInt(element.attribs.href.split("/").slice(-1)[0].split(".html")[0])
                let type_name = element.children.slice(-1)[0].data.replace("\n", "").replace(" ", "").replace("玩偶", "")
                let type_dic = {"type_id": type_id, "type_name": type_name}
                this.classes.push(type_dic)
            }
            this.homeVodList = await this.parseVodShortListFromDoc($)
        }
    }

    async setHome(filter) {
        await this.setClasses()
        this.filterObj = {
            "1": [{
                "key": "1", "name": "全部剧情", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "喜剧", "v": "喜剧"
                }, {
                    "n": "爱情", "v": "爱情"
                }, {
                    "n": "恐怖", "v": "恐怖"
                }, {
                    "n": "动作", "v": "动作"
                }, {
                    "n": "科幻", "v": "科幻"
                }, {
                    "n": "剧情", "v": "剧情"
                }, {
                    "n": "战争", "v": "战争"
                }, {
                    "n": "警匪", "v": "警匪"
                }, {
                    "n": "犯罪", "v": "犯罪"
                }, {
                    "n": "古装", "v": "古装"
                }, {
                    "n": "奇幻", "v": "奇幻"
                }, {
                    "n": "武侠", "v": "武侠"
                }, {
                    "n": "冒险", "v": "冒险"
                }, {
                    "n": "枪战", "v": "枪战"
                }, {
                    "n": "恐怖", "v": "恐怖"
                }, {
                    "n": "悬疑", "v": "悬疑"
                }, {
                    "n": "惊悚", "v": "惊悚"
                }, {
                    "n": "经典", "v": "经典"
                }, {
                    "n": "青春", "v": "青春"
                }, {
                    "n": "文艺", "v": "文艺"
                }, {
                    "n": "微电影", "v": "微电影"
                }, {
                    "n": "历史", "v": "历史"
                }]
            }, {
                "key": "2", "name": "全部地区", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "大陆", "v": "大陆"
                }, {
                    "n": "香港", "v": "香港"
                }, {
                    "n": "台湾", "v": "台湾"
                }, {
                    "n": "美国", "v": "美国"
                }, {
                    "n": "法国", "v": "法国"
                }, {
                    "n": "英国", "v": "英国"
                }, {
                    "n": "日本", "v": "日本"
                }, {
                    "n": "韩国", "v": "韩国"
                }, {
                    "n": "德国", "v": "德国"
                }, {
                    "n": "泰国", "v": "泰国"
                }, {
                    "n": "印度", "v": "印度"
                }, {
                    "n": "意大利", "v": "意大利"
                }, {
                    "n": "西班牙", "v": "西班牙"
                }, {
                    "n": "加拿大", "v": "加拿大"
                }, {
                    "n": "其他", "v": "其他"
                }]
            }, {
                "key": "3", "name": "全部语言", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "国语", "v": "国语"
                }, {
                    "n": "英语", "v": "英语"
                }, {
                    "n": "粤语", "v": "粤语"
                }, {
                    "n": "闽南语", "v": "闽南语"
                }, {
                    "n": "韩语", "v": "韩语"
                }, {
                    "n": "日语", "v": "日语"
                }, {
                    "n": "法语", "v": "法语"
                }, {
                    "n": "德语", "v": "德语"
                }, {
                    "n": "其它", "v": "其它"
                }]
            }, {
                "key": "4", "name": "全部时间", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "2024", "v": "2024"
                }, {
                    "n": "2023", "v": "2023"
                }, {
                    "n": "2022", "v": "2022"
                }, {
                    "n": "2021", "v": "2021"
                }, {
                    "n": "2020", "v": "2020"
                }, {
                    "n": "2019", "v": "2019"
                }, {
                    "n": "2018", "v": "2018"
                }, {
                    "n": "2017", "v": "2017"
                }, {
                    "n": "2016", "v": "2016"
                }, {
                    "n": "2015", "v": "2015"
                }, {
                    "n": "2014", "v": "2014"
                }, {
                    "n": "2013", "v": "2013"
                }, {
                    "n": "2012", "v": "2012"
                }, {
                    "n": "2011", "v": "2011"
                }, {
                    "n": "2010", "v": "2010"
                }]
            }, {
                "key": "5", "name": "字母查找", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "A", "v": "A"
                }, {
                    "n": "B", "v": "B"
                }, {
                    "n": "C", "v": "C"
                }, {
                    "n": "D", "v": "D"
                }, {
                    "n": "E", "v": "E"
                }, {
                    "n": "F", "v": "F"
                }, {
                    "n": "G", "v": "G"
                }, {
                    "n": "H", "v": "H"
                }, {
                    "n": "I", "v": "I"
                }, {
                    "n": "J", "v": "J"
                }, {
                    "n": "K", "v": "K"
                }, {
                    "n": "L", "v": "L"
                }, {
                    "n": "M", "v": "M"
                }, {
                    "n": "N", "v": "N"
                }, {
                    "n": "O", "v": "O"
                }, {
                    "n": "P", "v": "P"
                }, {
                    "n": "Q", "v": "Q"
                }, {
                    "n": "R", "v": "R"
                }, {
                    "n": "S", "v": "S"
                }, {
                    "n": "T", "v": "T"
                }, {
                    "n": "U", "v": "U"
                }, {
                    "n": "V", "v": "V"
                }, {
                    "n": "W", "v": "W"
                }, {
                    "n": "X", "v": "X"
                }, {
                    "n": "Y", "v": "Y"
                }, {
                    "n": "Z", "v": "Z"
                }, {
                    "n": "0-9", "v": "0-9"
                }]
            }, {
                "key": "6", "name": "时间排序", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "人气排序", "v": "hits"
                }, {
                    "n": "评分排序", "v": "score"
                }]
            }], "2": [{
                "key": "1", "name": "全部剧情", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "喜剧", "v": "喜剧"
                }, {
                    "n": "爱情", "v": "爱情"
                }, {
                    "n": "恐怖", "v": "恐怖"
                }, {
                    "n": "动作", "v": "动作"
                }, {
                    "n": "科幻", "v": "科幻"
                }, {
                    "n": "剧情", "v": "剧情"
                }, {
                    "n": "战争", "v": "战争"
                }, {
                    "n": "警匪", "v": "警匪"
                }, {
                    "n": "犯罪", "v": "犯罪"
                }, {
                    "n": "古装", "v": "古装"
                }, {
                    "n": "奇幻", "v": "奇幻"
                }, {
                    "n": "武侠", "v": "武侠"
                }, {
                    "n": "冒险", "v": "冒险"
                }, {
                    "n": "枪战", "v": "枪战"
                }, {
                    "n": "恐怖", "v": "恐怖"
                }, {
                    "n": "悬疑", "v": "悬疑"
                }, {
                    "n": "惊悚", "v": "惊悚"
                }, {
                    "n": "经典", "v": "经典"
                }, {
                    "n": "青春", "v": "青春"
                }, {
                    "n": "文艺", "v": "文艺"
                }, {
                    "n": "微电影", "v": "微电影"
                }, {
                    "n": "历史", "v": "历史"
                }]
            }, {
                "key": "2", "name": "全部地区", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "大陆", "v": "大陆"
                }, {
                    "n": "香港", "v": "香港"
                }, {
                    "n": "台湾", "v": "台湾"
                }, {
                    "n": "美国", "v": "美国"
                }, {
                    "n": "法国", "v": "法国"
                }, {
                    "n": "英国", "v": "英国"
                }, {
                    "n": "日本", "v": "日本"
                }, {
                    "n": "韩国", "v": "韩国"
                }, {
                    "n": "德国", "v": "德国"
                }, {
                    "n": "泰国", "v": "泰国"
                }, {
                    "n": "印度", "v": "印度"
                }, {
                    "n": "意大利", "v": "意大利"
                }, {
                    "n": "西班牙", "v": "西班牙"
                }, {
                    "n": "加拿大", "v": "加拿大"
                }, {
                    "n": "其他", "v": "其他"
                }]
            }, {
                "key": "3", "name": "全部语言", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "国语", "v": "国语"
                }, {
                    "n": "英语", "v": "英语"
                }, {
                    "n": "粤语", "v": "粤语"
                }, {
                    "n": "闽南语", "v": "闽南语"
                }, {
                    "n": "韩语", "v": "韩语"
                }, {
                    "n": "日语", "v": "日语"
                }, {
                    "n": "法语", "v": "法语"
                }, {
                    "n": "德语", "v": "德语"
                }, {
                    "n": "其它", "v": "其它"
                }]
            }, {
                "key": "4", "name": "全部时间", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "2024", "v": "2024"
                }, {
                    "n": "2023", "v": "2023"
                }, {
                    "n": "2022", "v": "2022"
                }, {
                    "n": "2021", "v": "2021"
                }, {
                    "n": "2020", "v": "2020"
                }, {
                    "n": "2019", "v": "2019"
                }, {
                    "n": "2018", "v": "2018"
                }, {
                    "n": "2017", "v": "2017"
                }, {
                    "n": "2016", "v": "2016"
                }, {
                    "n": "2015", "v": "2015"
                }, {
                    "n": "2014", "v": "2014"
                }, {
                    "n": "2013", "v": "2013"
                }, {
                    "n": "2012", "v": "2012"
                }, {
                    "n": "2011", "v": "2011"
                }, {
                    "n": "2010", "v": "2010"
                }]
            }, {
                "key": "5", "name": "字母查找", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "A", "v": "A"
                }, {
                    "n": "B", "v": "B"
                }, {
                    "n": "C", "v": "C"
                }, {
                    "n": "D", "v": "D"
                }, {
                    "n": "E", "v": "E"
                }, {
                    "n": "F", "v": "F"
                }, {
                    "n": "G", "v": "G"
                }, {
                    "n": "H", "v": "H"
                }, {
                    "n": "I", "v": "I"
                }, {
                    "n": "J", "v": "J"
                }, {
                    "n": "K", "v": "K"
                }, {
                    "n": "L", "v": "L"
                }, {
                    "n": "M", "v": "M"
                }, {
                    "n": "N", "v": "N"
                }, {
                    "n": "O", "v": "O"
                }, {
                    "n": "P", "v": "P"
                }, {
                    "n": "Q", "v": "Q"
                }, {
                    "n": "R", "v": "R"
                }, {
                    "n": "S", "v": "S"
                }, {
                    "n": "T", "v": "T"
                }, {
                    "n": "U", "v": "U"
                }, {
                    "n": "V", "v": "V"
                }, {
                    "n": "W", "v": "W"
                }, {
                    "n": "X", "v": "X"
                }, {
                    "n": "Y", "v": "Y"
                }, {
                    "n": "Z", "v": "Z"
                }, {
                    "n": "0-9", "v": "0-9"
                }]
            }, {
                "key": "6", "name": "时间排序", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "人气排序", "v": "hits"
                }, {
                    "n": "评分排序", "v": "score"
                }]
            }], "3": [{
                "key": "1", "name": "全部剧情", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "情感", "v": "情感"
                }, {
                    "n": "科幻", "v": "科幻"
                }, {
                    "n": "热血", "v": "热血"
                }, {
                    "n": "推理", "v": "推理"
                }, {
                    "n": "搞笑", "v": "搞笑"
                }, {
                    "n": "冒险", "v": "冒险"
                }, {
                    "n": "萝莉", "v": "萝莉"
                }, {
                    "n": "校园", "v": "校园"
                }, {
                    "n": "动作", "v": "动作"
                }, {
                    "n": "机战", "v": "机战"
                }, {
                    "n": "运动", "v": "运动"
                }, {
                    "n": "战争", "v": "战争"
                }, {
                    "n": "少年", "v": "少年"
                }, {
                    "n": "少女", "v": "少女"
                }, {
                    "n": "社会", "v": "社会"
                }, {
                    "n": "原创", "v": "原创"
                }, {
                    "n": "亲子", "v": "亲子"
                }, {
                    "n": "益智", "v": "益智"
                }, {
                    "n": "励志", "v": "励志"
                }, {
                    "n": "其他", "v": "其他"
                }]
            }, {
                "key": "2", "name": "全部地区", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "大陆", "v": "大陆"
                }, {
                    "n": "香港", "v": "香港"
                }, {
                    "n": "台湾", "v": "台湾"
                }, {
                    "n": "美国", "v": "美国"
                }, {
                    "n": "法国", "v": "法国"
                }, {
                    "n": "英国", "v": "英国"
                }, {
                    "n": "日本", "v": "日本"
                }, {
                    "n": "韩国", "v": "韩国"
                }, {
                    "n": "德国", "v": "德国"
                }, {
                    "n": "泰国", "v": "泰国"
                }, {
                    "n": "印度", "v": "印度"
                }, {
                    "n": "意大利", "v": "意大利"
                }, {
                    "n": "西班牙", "v": "西班牙"
                }, {
                    "n": "加拿大", "v": "加拿大"
                }, {
                    "n": "其他", "v": "其他"
                }]
            }, {
                "key": "3", "name": "全部语言", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "国语", "v": "国语"
                }, {
                    "n": "英语", "v": "英语"
                }, {
                    "n": "粤语", "v": "粤语"
                }, {
                    "n": "闽南语", "v": "闽南语"
                }, {
                    "n": "韩语", "v": "韩语"
                }, {
                    "n": "日语", "v": "日语"
                }, {
                    "n": "法语", "v": "法语"
                }, {
                    "n": "德语", "v": "德语"
                }, {
                    "n": "其它", "v": "其它"
                }]
            }, {
                "key": "4", "name": "全部时间", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "2024", "v": "2024"
                }, {
                    "n": "2023", "v": "2023"
                }, {
                    "n": "2022", "v": "2022"
                }, {
                    "n": "2021", "v": "2021"
                }, {
                    "n": "2020", "v": "2020"
                }, {
                    "n": "2019", "v": "2019"
                }, {
                    "n": "2018", "v": "2018"
                }, {
                    "n": "2017", "v": "2017"
                }, {
                    "n": "2016", "v": "2016"
                }, {
                    "n": "2015", "v": "2015"
                }, {
                    "n": "2014", "v": "2014"
                }, {
                    "n": "2013", "v": "2013"
                }, {
                    "n": "2012", "v": "2012"
                }, {
                    "n": "2011", "v": "2011"
                }, {
                    "n": "2010", "v": "2010"
                }]
            }, {
                "key": "5", "name": "字母查找", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "A", "v": "A"
                }, {
                    "n": "B", "v": "B"
                }, {
                    "n": "C", "v": "C"
                }, {
                    "n": "D", "v": "D"
                }, {
                    "n": "E", "v": "E"
                }, {
                    "n": "F", "v": "F"
                }, {
                    "n": "G", "v": "G"
                }, {
                    "n": "H", "v": "H"
                }, {
                    "n": "I", "v": "I"
                }, {
                    "n": "J", "v": "J"
                }, {
                    "n": "K", "v": "K"
                }, {
                    "n": "L", "v": "L"
                }, {
                    "n": "M", "v": "M"
                }, {
                    "n": "N", "v": "N"
                }, {
                    "n": "O", "v": "O"
                }, {
                    "n": "P", "v": "P"
                }, {
                    "n": "Q", "v": "Q"
                }, {
                    "n": "R", "v": "R"
                }, {
                    "n": "S", "v": "S"
                }, {
                    "n": "T", "v": "T"
                }, {
                    "n": "U", "v": "U"
                }, {
                    "n": "V", "v": "V"
                }, {
                    "n": "W", "v": "W"
                }, {
                    "n": "X", "v": "X"
                }, {
                    "n": "Y", "v": "Y"
                }, {
                    "n": "Z", "v": "Z"
                }, {
                    "n": "0-9", "v": "0-9"
                }]
            }, {
                "key": "6", "name": "时间排序", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "人气排序", "v": "hits"
                }, {
                    "n": "评分排序", "v": "score"
                }]
            }], "4": [{
                "key": "1", "name": "全部地区", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "大陆", "v": "大陆"
                }, {
                    "n": "香港", "v": "香港"
                }, {
                    "n": "台湾", "v": "台湾"
                }, {
                    "n": "美国", "v": "美国"
                }, {
                    "n": "法国", "v": "法国"
                }, {
                    "n": "英国", "v": "英国"
                }, {
                    "n": "日本", "v": "日本"
                }, {
                    "n": "韩国", "v": "韩国"
                }]
            }, {
                "key": "2", "name": "全部时间", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "2024", "v": "2024"
                }, {
                    "n": "2023", "v": "2023"
                }, {
                    "n": "2022", "v": "2022"
                }, {
                    "n": "2021", "v": "2021"
                }, {
                    "n": "2020", "v": "2020"
                }, {
                    "n": "2019", "v": "2019"
                }, {
                    "n": "2018", "v": "2018"
                }, {
                    "n": "2017", "v": "2017"
                }, {
                    "n": "2016", "v": "2016"
                }, {
                    "n": "2015", "v": "2015"
                }, {
                    "n": "2014", "v": "2014"
                }, {
                    "n": "2013", "v": "2013"
                }, {
                    "n": "2012", "v": "2012"
                }, {
                    "n": "2011", "v": "2011"
                }, {
                    "n": "2010", "v": "2010"
                }]
            }, {
                "key": "3", "name": "字母查找", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "A", "v": "A"
                }, {
                    "n": "B", "v": "B"
                }, {
                    "n": "C", "v": "C"
                }, {
                    "n": "D", "v": "D"
                }, {
                    "n": "E", "v": "E"
                }, {
                    "n": "F", "v": "F"
                }, {
                    "n": "G", "v": "G"
                }, {
                    "n": "H", "v": "H"
                }, {
                    "n": "I", "v": "I"
                }, {
                    "n": "J", "v": "J"
                }, {
                    "n": "K", "v": "K"
                }, {
                    "n": "L", "v": "L"
                }, {
                    "n": "M", "v": "M"
                }, {
                    "n": "N", "v": "N"
                }, {
                    "n": "O", "v": "O"
                }, {
                    "n": "P", "v": "P"
                }, {
                    "n": "Q", "v": "Q"
                }, {
                    "n": "R", "v": "R"
                }, {
                    "n": "S", "v": "S"
                }, {
                    "n": "T", "v": "T"
                }, {
                    "n": "U", "v": "U"
                }, {
                    "n": "V", "v": "V"
                }, {
                    "n": "W", "v": "W"
                }, {
                    "n": "X", "v": "X"
                }, {
                    "n": "Y", "v": "Y"
                }, {
                    "n": "Z", "v": "Z"
                }, {
                    "n": "0-9", "v": "0-9"
                }]
            }, {
                "key": "4", "name": "时间排序", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "人气排序", "v": "hits"
                }, {
                    "n": "评分排序", "v": "score"
                }]
            }], "5": [{
                "key": "1", "name": "字母查找", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "A", "v": "A"
                }, {
                    "n": "B", "v": "B"
                }, {
                    "n": "C", "v": "C"
                }, {
                    "n": "D", "v": "D"
                }, {
                    "n": "E", "v": "E"
                }, {
                    "n": "F", "v": "F"
                }, {
                    "n": "G", "v": "G"
                }, {
                    "n": "H", "v": "H"
                }, {
                    "n": "I", "v": "I"
                }, {
                    "n": "J", "v": "J"
                }, {
                    "n": "K", "v": "K"
                }, {
                    "n": "L", "v": "L"
                }, {
                    "n": "M", "v": "M"
                }, {
                    "n": "N", "v": "N"
                }, {
                    "n": "O", "v": "O"
                }, {
                    "n": "P", "v": "P"
                }, {
                    "n": "Q", "v": "Q"
                }, {
                    "n": "R", "v": "R"
                }, {
                    "n": "S", "v": "S"
                }, {
                    "n": "T", "v": "T"
                }, {
                    "n": "U", "v": "U"
                }, {
                    "n": "V", "v": "V"
                }, {
                    "n": "W", "v": "W"
                }, {
                    "n": "X", "v": "X"
                }, {
                    "n": "Y", "v": "Y"
                }, {
                    "n": "Z", "v": "Z"
                }, {
                    "n": "0-9", "v": "0-9"
                }]
            }, {
                "key": "2", "name": "时间排序", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "人气排序", "v": "hits"
                }, {
                    "n": "评分排序", "v": "score"
                }]
            }], "6": [{
                "key": "1", "name": "全部剧情", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "古装", "v": "古装"
                }, {
                    "n": "战争", "v": "战争"
                }, {
                    "n": "青春偶像", "v": "青春偶像"
                }, {
                    "n": "喜剧", "v": "喜剧"
                }, {
                    "n": "家庭", "v": "家庭"
                }, {
                    "n": "犯罪", "v": "犯罪"
                }, {
                    "n": "动作", "v": "动作"
                }, {
                    "n": "奇幻", "v": "奇幻"
                }, {
                    "n": "剧情", "v": "剧情"
                }, {
                    "n": "历史", "v": "历史"
                }, {
                    "n": "经典", "v": "经典"
                }, {
                    "n": "乡村", "v": "乡村"
                }, {
                    "n": "情景", "v": "情景"
                }, {
                    "n": "商战", "v": "商战"
                }, {
                    "n": "网剧", "v": "网剧"
                }, {
                    "n": "其他", "v": "其他"
                }]
            }, {
                "key": "2", "name": "全部地区", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "内地", "v": "内地"
                }]
            }, {
                "key": "3", "name": "全部时间", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "2024", "v": "2024"
                }, {
                    "n": "2023", "v": "2023"
                }, {
                    "n": "2022", "v": "2022"
                }, {
                    "n": "2021", "v": "2021"
                }, {
                    "n": "2020", "v": "2020"
                }, {
                    "n": "2019", "v": "2019"
                }, {
                    "n": "2018", "v": "2018"
                }, {
                    "n": "2017", "v": "2017"
                }, {
                    "n": "2016", "v": "2016"
                }, {
                    "n": "2015", "v": "2015"
                }, {
                    "n": "2014", "v": "2014"
                }, {
                    "n": "2013", "v": "2013"
                }, {
                    "n": "2012", "v": "2012"
                }, {
                    "n": "2011", "v": "2011"
                }, {
                    "n": "2010", "v": "2010"
                }]
            }, {
                "key": "4", "name": "字母查找", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "A", "v": "A"
                }, {
                    "n": "B", "v": "B"
                }, {
                    "n": "C", "v": "C"
                }, {
                    "n": "D", "v": "D"
                }, {
                    "n": "E", "v": "E"
                }, {
                    "n": "F", "v": "F"
                }, {
                    "n": "G", "v": "G"
                }, {
                    "n": "H", "v": "H"
                }, {
                    "n": "I", "v": "I"
                }, {
                    "n": "J", "v": "J"
                }, {
                    "n": "K", "v": "K"
                }, {
                    "n": "L", "v": "L"
                }, {
                    "n": "M", "v": "M"
                }, {
                    "n": "N", "v": "N"
                }, {
                    "n": "O", "v": "O"
                }, {
                    "n": "P", "v": "P"
                }, {
                    "n": "Q", "v": "Q"
                }, {
                    "n": "R", "v": "R"
                }, {
                    "n": "S", "v": "S"
                }, {
                    "n": "T", "v": "T"
                }, {
                    "n": "U", "v": "U"
                }, {
                    "n": "V", "v": "V"
                }, {
                    "n": "W", "v": "W"
                }, {
                    "n": "X", "v": "X"
                }, {
                    "n": "Y", "v": "Y"
                }, {
                    "n": "Z", "v": "Z"
                }, {
                    "n": "0-9", "v": "0-9"
                }]
            }, {
                "key": "5", "name": "时间排序", "value": [{
                    "n": "全部", "v": "0"
                }, {
                    "n": "人气排序", "v": "hits"
                }, {
                    "n": "评分排序", "v": "score"
                }]
            }]
        };
    }

    async setCategory(tid, pg, filter, extend) {
        let urlParams = [tid.toString(), "", "", "", "", "", "", "", pg.toString(), "", "", ""]
        let extend_dic = this.get_extend_sort_dic(parseInt(tid))
        for (const key of Object.keys(extend_dic)) {
            if (extend[key] === "0") {
                urlParams[extend_dic[key]] = ""
            } else {
                urlParams[extend_dic[key]] = extend[key]
            }
        }
        let reqUrl = this.siteUrl + '/index.php/vodshow/' + urlParams.join("-") + '.html';
        let html = await this.fetch(reqUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDoc($)
            let total = Utils.getStrByRegex(/\$\("\.mac_total"\)\.text\('(\d+)'\)/, html)
            this.limit = 72;
            if (total.length > 0) {
                this.total = parseInt(total)
            }
            if (this.total <= this.limit) {
                this.count = 1
            } else {
                this.count = Math.ceil(this.total / this.limit)
            }
        }
    }

    async setDetail(id) {
        let detailUrl = this.siteUrl + id;
        let html = await this.fetch(detailUrl, null, this.getHeader());
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodDetail = await this.parseVodDetailFromDoc($)
        }
    }

    async play(flag, id, flags) {
        return await playContent(flag, id, flags);
    }

    async setSearch(wd, quick) {
        let searchUrl = this.siteUrl + '/index.php/vodsearch/-------------.html?wd=' + wd;
        let html = await this.fetch(searchUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDocBySearch($)
        }
    }

}

let spider = new WoggSpider()

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

