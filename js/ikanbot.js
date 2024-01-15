/*
* @File     : ikanbot.js
* @Author   : jade
* @Date     : 2024/1/15 10:32
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

import {Spider} from "./spider.js";
import {load, _, Crypto} from "../lib/cat.js";
import {VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";

class IKanBot extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://v.ikanbot.com"
    }

    getName() {
        return "🤖|爱看机器人|🤖"
    }

    getAppName() {
        return "|爱看机器人|"
    }


    async parseVodShortListFromDoc($) {
        let vod_list = [];
        let VodShortElements = $($("[class=\"row list-wp\"]")).find("a")
        for (const vodShortElement of VodShortElements) {
            let vodShort = new VodShort()
            let reElement = $(vodShortElement).find("img")[0]
            vodShort.vod_id = vodShortElement.attribs["href"]
            let jsBase = await js2Proxy(true, 3, "ikanbot_open", 'img/', this.getHeader());
            vodShort.vod_pic = jsBase + Utils.base64Encode(reElement.attribs["data-src"])
            vodShort.vod_name = reElement.attribs["alt"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setClasses() {
        let html = await this.fetch(this.siteUrl + "/category", null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            let navElements = $("[class=\"navbar navbar-default navbar-fixed-bottom visible-xs-block visible-sm-block\"]").find("li").find("a")

            let classElements = $($($("[class=\"row visible-xs-block visible-sm-block\"]")).find("li")).find("a")
            let classList = []
            for (const classElement of classElements) {
                classList.push($(classElement).text())
                this.classes.push({"type_name": $(classElement).text(), "type_id": classElement.attribs["href"]})
            }


            for (const navElement of navElements) {
                let type_name = $(navElement).text().replaceAll("\n", "")

                if (type_name !== "首页" && type_name !== "看过" && type_name !== "分类") {
                    if (classList.indexOf(type_name) > -1) {
                        this.classes[classList.indexOf(type_name) + 1]["type_id"] = this.classes[classList.indexOf(type_name) + 1]["type_id"] + "," + navElement.attribs["href"]
                    } else {
                        this.classes.push({"type_name": type_name, "type_id": navElement.attribs["href"]})
                    }
                }
            }


        }

    }

    async setFilterObj() {
        for (const class_dic of this.classes.slice(1, 9)) {
            let type_id = class_dic["type_id"]
            if (type_id.indexOf("category") === -1 || type_id.indexOf(",") > -1) {
                let type_url = type_id.split(",").slice(-1)[0]
                let html = await this.fetch(this.siteUrl + type_url, null, this.getHeader())
                if (!_.isEmpty(html)) {
                    let $ = load(html)
                    let containerElement = $("[class=\"row visible-xs-block visible-sm-block\"]")
                    let filterElements = containerElement.find("[class=\"nav nav-pills\"]").find("a")
                    let value_list = []
                    if (type_id.indexOf(",") > -1) {
                        value_list.push({"n": "全部", "v": type_id.split(",")[0]})

                    }
                    let extend_dic = {
                        "key": type_id, "name": $(containerElement.find("h5")).text(), "value": value_list
                    }
                    for (const filterElement of filterElements) {
                        value_list.push({"n": $(filterElement).text(), "v": filterElement.attribs["href"]})
                    }
                    if (value_list.length > 0) {
                        this.filterObj[type_id] = [extend_dic]
                    }

                }
            }

        }
    }

    async setHome(filter) {
        // await this.setClasses()
        // await this.setFilterObj()
        this.classes = [{
            "type_name": "最近更新", "type_id": "最近更新"
        }, {
            "type_name": "全部", "type_id": "/category/"
        }, {
            "type_name": "电影", "type_id": "/category/1,/hot/index-movie-热门.html"
        }, {
            "type_name": "剧集", "type_id": "/category/2,/hot/index-tv-热门.html"
        }, {
            "type_name": "动漫", "type_id": "/category/18"
        }, {
            "type_name": "综艺", "type_id": "/category/19"
        }, {
            "type_name": "纪录片", "type_id": "/category/20"
        }, {
            "type_name": "榜单", "type_id": "/billboard.html"
        }, {
            "type_name": "片单", "type_id": "/kanlist/全部-p-1.html"
        }]
        this.filterObj = {
            "/category/1,/hot/index-movie-热门.html": [{
                "key": "/category/1,/hot/index-movie-热门.html", "name": "最近热门电影", "value": [{
                    "n": "全部", "v": "/category/1"
                }, {
                    "n": "热门", "v": "/hot/index-movie-热门.html"
                }, {
                    "n": "最新", "v": "/hot/index-movie-最新.html"
                }, {
                    "n": "经典", "v": "/hot/index-movie-经典.html"
                }, {
                    "n": "豆瓣高分", "v": "/hot/index-movie-豆瓣高分.html"
                }, {
                    "n": "冷门佳片", "v": "/hot/index-movie-冷门佳片.html"
                }, {
                    "n": "华语", "v": "/hot/index-movie-华语.html"
                }, {
                    "n": "欧美", "v": "/hot/index-movie-欧美.html"
                }, {
                    "n": "韩国", "v": "/hot/index-movie-韩国.html"
                }, {
                    "n": "日本", "v": "/hot/index-movie-日本.html"
                }, {
                    "n": "动作", "v": "/hot/index-movie-动作.html"
                }, {
                    "n": "喜剧", "v": "/hot/index-movie-喜剧.html"
                }, {
                    "n": "爱情", "v": "/hot/index-movie-爱情.html"
                }, {
                    "n": "科幻", "v": "/hot/index-movie-科幻.html"
                }, {
                    "n": "悬疑", "v": "/hot/index-movie-悬疑.html"
                }, {
                    "n": "恐怖", "v": "/hot/index-movie-恐怖.html"
                }, {
                    "n": "成长", "v": "/hot/index-movie-成长.html"
                }, {
                    "n": "豆瓣top250", "v": "/hot/index-movie-豆瓣top250.html"
                }]
            }], "/category/2,/hot/index-tv-热门.html": [{
                "key": "/category/2,/hot/index-tv-热门.html", "name": "最近热门剧集", "value": [{
                    "n": "全部", "v": "/category/2"
                }, {
                    "n": "热门", "v": "/hot/index-tv-热门.html"
                }, {
                    "n": "美剧", "v": "/hot/index-tv-美剧.html"
                }, {
                    "n": "英剧", "v": "/hot/index-tv-英剧.html"
                }, {
                    "n": "韩剧", "v": "/hot/index-tv-韩剧.html"
                }, {
                    "n": "日剧", "v": "/hot/index-tv-日剧.html"
                }, {
                    "n": "国产剧", "v": "/hot/index-tv-国产剧.html"
                }, {
                    "n": "港剧", "v": "/hot/index-tv-港剧.html"
                }, {
                    "n": "日本动画", "v": "/hot/index-tv-日本动画.html"
                }, {
                    "n": "综艺", "v": "/hot/index-tv-综艺.html"
                }, {
                    "n": "纪录片", "v": "/hot/index-tv-纪录片.html"
                }]
            }], "/kanlist/全部-p-1.html": [{
                "key": "/kanlist/全部-p-1.html", "name": "热门标签", "value": [{
                    "n": "全部", "v": "/kanlist/全部-p-1.html"
                }, {
                    "n": "剧情", "v": "/kanlist/剧情-p-1.html"
                }, {
                    "n": "情感", "v": "/kanlist/情感-p-1.html"
                }, {
                    "n": "治愈", "v": "/kanlist/治愈-p-1.html"
                }, {
                    "n": "颁奖", "v": "/kanlist/颁奖-p-1.html"
                }, {
                    "n": "爱情", "v": "/kanlist/爱情-p-1.html"
                }, {
                    "n": "喜剧", "v": "/kanlist/喜剧-p-1.html"
                }, {
                    "n": "获奖", "v": "/kanlist/获奖-p-1.html"
                }, {
                    "n": "科幻", "v": "/kanlist/科幻-p-1.html"
                }, {
                    "n": "漫威", "v": "/kanlist/漫威-p-1.html"
                }, {
                    "n": "甜蜜", "v": "/kanlist/甜蜜-p-1.html"
                }, {
                    "n": "悬疑", "v": "/kanlist/悬疑-p-1.html"
                }, {
                    "n": "励志", "v": "/kanlist/励志-p-1.html"
                }, {
                    "n": "烧脑", "v": "/kanlist/烧脑-p-1.html"
                }, {
                    "n": "友情", "v": "/kanlist/友情-p-1.html"
                }]
            }]
        }
        let html = await this.fetch(this.siteUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.homeVodList = await this.parseVodShortListFromDoc($)
        }
    }


    async setCategory(tid, pg, filter, extend) {
        let categoryUrl = this.siteUrl + (extend[tid] || tid.split(",")[0]).replace('.html', pg > 1 ? `-p-${pg}.html` : '.html');
        await this.jadeLog.debug(`分类URL:${categoryUrl}`)
        let html = await this.fetch(categoryUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDoc($)
            const hasMore = $('div.page-more > a:contains(下一页)').length > 0;
            this.limit = 24
            this.count = hasMore ? parseInt(pg) + 1 : parseInt(pg);
            this.total = this.limit * this.count

        }
    }
}


let spider = new IKanBot()

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
