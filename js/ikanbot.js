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
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";


function _0xf746(_0xbb40c4, _0x1cb776) {
    const _0x45e084 = _0x45e0();
    return _0xf746 = function (_0xf74696, _0x4d32af) {
        _0xf74696 = _0xf74696 - 0x1a8;
        let _0xcbfa28 = _0x45e084[_0xf74696];
        return _0xcbfa28;
    }, _0xf746(_0xbb40c4, _0x1cb776);
}

function _0x45e0() {
    const _0x58b10c = ['1580630GngmmA', '117uvwflw', 'join', 'current_id', '565448Apkhig', '23092JwmytW', '707152yowhOv', 'getElementById', '855936CGaczt', 'length', '2966831GCGpvn', '611266nfcTEf', 'value', 'substring'];
    _0x45e0 = function () {
        return _0x58b10c;
    };
    return _0x45e0();
}

(function (_0x27923d, _0x43d7fc) {
    const _0x439396 = _0xf746, _0x30f164 = _0x27923d();
    while (!![]) {
        try {
            const _0xa560eb = -parseInt(_0x439396(0x1b4)) / 0x1 + parseInt(_0x439396(0x1ad)) / 0x2 + -parseInt(_0x439396(0x1b1)) / 0x3 * (-parseInt(_0x439396(0x1b5)) / 0x4) + -parseInt(_0x439396(0x1b0)) / 0x5 + parseInt(_0x439396(0x1aa)) / 0x6 + parseInt(_0x439396(0x1ac)) / 0x7 + parseInt(_0x439396(0x1a8)) / 0x8;
            if (_0xa560eb === _0x43d7fc) break; else _0x30f164['push'](_0x30f164['shift']());
        } catch (_0x3ae316) {
            _0x30f164['push'](_0x30f164['shift']());
        }
    }
}(_0x45e0, 0x4a3d9));

function get_tks(play_id,e_token) {
    const _0xf07220 = _0xf746;
    let _0x35162d = play_id,
        _0xf25678 = e_token;
    if (!_0x35162d || !_0xf25678) return;
    let _0x3882a3 = _0x35162d['length'], _0x52a097 = _0x35162d[_0xf07220(0x1af)](_0x3882a3 - 0x4, _0x3882a3),
        _0x2d9d1b = [];
    for (let _0x570711 = 0x0; _0x570711 < _0x52a097[_0xf07220(0x1ab)]; _0x570711++) {
        let _0x23e537 = parseInt(_0x52a097[_0x570711]), _0x48b93d = _0x23e537 % 0x3 + 0x1;
        _0x2d9d1b[_0x570711] = _0xf25678[_0xf07220(0x1af)](_0x48b93d, _0x48b93d + 0x8), _0xf25678 = _0xf25678[_0xf07220(0x1af)](_0x48b93d + 0x8, _0xf25678[_0xf07220(0x1ab)]);
    }
    return  _0x2d9d1b[_0xf07220(0x1b2)]('');
}

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
            let jsBase = await js2Proxy(true, 3, "ikanbot_open", 'img/', {});
            vodShort.vod_pic = jsBase + Utils.base64Encode(reElement.attribs["data-src"])
            vodShort.vod_name = reElement.attribs["alt"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        const detail = $('div.detail > .meta');
        let jsBase = await js2Proxy(true, 3, "ikanbot_open", 'img/', {});
        let vodDetail = new VodDetail();
        vodDetail.vod_pic = jsBase + Utils.base64Encode($('div.item-root > img')[0].attribs['data-src'])
        for (const info of detail) {
            if ($(info).hasClass('title')) {
                vodDetail.vod_name = info.children[0].data;
            } else if ($(info).hasClass('year')) {
                vodDetail.vod_area = info.children[0].data;
            } else if ($(info).hasClass('country')) {
                vodDetail.vod_area = info.children[0].data;
            } else if ($(info).hasClass('celebrity')) {
                vodDetail.vod_actor = info.children[0].data;
            }
        }

        let id = Utils.getStrByRegex(/<input type="hidden" id="current_id" value="(.*?)"/,$.html())
        let token = Utils.getStrByRegex(/<input type="hidden" id="e_token" value="(.*?)"/,$.html())
        let mtype =  Utils.getStrByRegex(/<input type="hidden" id="mtype" value="(.*?)"/,$.html())
        let params = {
            "videoId":id,
            "mtype":mtype,
            "token":get_tks(id,token),
        }
        let content = await this.fetch(this.siteUrl + '/api/getResN' ,params,this.getHeader())

        const list = JSON.parse(content)["data"]["list"];
        let playlist = {};
        for (const l of list) {
            const flagData = JSON.parse(l["resData"]);
            for (const f of flagData) {
                const from = f.flag;
                const urls = f.url;
                if (!from || !urls) continue;
                if (playlist[from]) continue;
                playlist[from] = urls;
            }
        }
        vodDetail.vod_play_from = _.keys(playlist).join('$$$');
        vodDetail.vod_play_url = _.values(playlist).join('$$$');
        return vodDetail
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
        let categoryUrl = (this.siteUrl + (extend[tid] || tid.split(",")[0]))
        let update_page = false
        if (categoryUrl.indexOf("html") > -1) {
            categoryUrl = categoryUrl.replace('.html', pg > 1 ? `-p-${pg}.html` : '.html');
        } else {
            categoryUrl = categoryUrl + `?p=${pg}`
            update_page = true

        }
        await this.jadeLog.debug(`分类URL:${categoryUrl}`)
        let html = await this.fetch(categoryUrl, null, this.getHeader())
        if (!_.isEmpty(html)) {
            let $ = load(html)
            this.vodList = await this.parseVodShortListFromDoc($)
            let pageDoc = $('div.page-more > a:contains(下一页)')
            if (update_page) {
                this.page = parseInt(pageDoc[0].attribs["href"].split("p=")[1])
            }
            const hasMore = pageDoc.length > 0;
            this.limit = 24
            this.count = hasMore ? parseInt(pg) + 1 : parseInt(pg);
            this.total = this.limit * this.count

        }
    }

    async setDetail(id) {
        let html = await this.fetch(this.siteUrl + id)
        if (!_.isEmpty(html)) {
            await this.jadeLog.debug(html)
            let $ = load(html);
            this.vodDetail = await this.parseVodDetailFromDoc($)
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
