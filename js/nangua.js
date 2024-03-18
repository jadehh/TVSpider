/*
* @File     : nangua.js
* @Author   : jade
* @Date     : 2024/3/18 10:54
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {Crypto, jinja2, _} from "../lib/cat.js";
import {Spider} from "./spider.js";
import {VodDetail} from "../lib/vod.js";

function stripHtmlTag(src) {
    return src
        .replace(/<\/?[^>]+(>|$)/g, '')
        .replace(/&.{1,5};/g, '')
        .replace(/\s{2,}/g, ' ');
}

function formatPlayUrl(src, name) {
    return name
        .trim()
        .replaceAll(src, '')
        .replace(/<|>|《|》/g, '')
        .replace(/\$|#/g, ' ')
        .trim();
}


class NanGuaSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = 'http://ys.changmengyun.com';
    }

    getName() {
        return "|南瓜影视|"
    }

    getAppName() {
        return "南瓜影视"
    }

    getHeader() {
        let t = new Date().getTime().toString();
        return {
            'version_name': '1.0.6',
            'version_code': '6',
            'package_name': 'com.app.nanguatv',
            'sign': Crypto.MD5('c431ea542cee9679#uBFszdEM0oL0JRn@' + t).toString().toLowerCase(),
            'imei': 'c431ea542cee9679',
            'timeMillis': t,
            'User-Agent': 'okhttp/4.6.0'
        }
    }

    async setClasses() {
        let data = JSON.parse(await this.fetch(this.siteUrl + '/api.php/provide/home_nav', null, this.getHeader()));
        for (const key in data) {
            if (data[key].name !== '精选') this.classes.push({
                type_id: data[key].id, type_name: data[key].name,
            });
        }
    }

    async setFilterObj() {
        this.filterObj = {
            "2": [{
                "key": "class",
                "name": "类型",
                "value": [{"n": "全部", "v": "类型"}, {"n": "国产剧", "v": "国产剧"}, {"n": "港台剧", "v": "港台剧"}]
            }, {
                "key": "area", "name": "地区", "value": [{"n": "全部", "v": "地区"}, {"n": "内地", "v": "内地"}, {
                    "n": "香港地区", "v": "香港地区"
                }, {"n": "台湾地区", "v": "台湾地区"}]
            }, {
                "key": "year",
                "name": "年份",
                "value": [{"n": "全部", "v": "年份"}, {"n": "2024", "v": "2024"}, {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {
                    "n": "2021", "v": "2021"
                }, {"n": "2020", "v": "2020"}, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {
                    "n": "2017", "v": "2017"
                }, {"n": "2016", "v": "2016"}, {"n": "2015", "v": "2015"}, {"n": "10年代", "v": "10年代"}, {
                    "n": "00年代", "v": "00年代"
                }, {"n": "90年代", "v": "90年代"}, {"n": "80年代", "v": "80年代"}]
            }, {
                "key": "by", "name": "排序", "value": [{"n": "热播榜", "v": "热播榜"}, {"n": "好评榜", "v": "好评榜"}, {
                    "n": "新上线", "v": "新上线"
                }]
            }], "1": [{
                "key": "class", "name": "类型", "value": [{"n": "全部", "v": "类型"}, {"n": "动作片", "v": "动作片"}, {
                    "n": "喜剧片", "v": "喜剧片"
                }, {"n": "爱情片", "v": "爱情片"}, {"n": "科幻片", "v": "科幻片"}, {
                    "n": "恐怖片", "v": "恐怖片"
                }, {"n": "剧情片", "v": "剧情片"}, {"n": "战争片", "v": "战争片"}, {"n": "惊悚片", "v": "惊悚片"}]
            }, {
                "key": "area", "name": "地区", "value": [{"n": "全部", "v": "地区"}, {"n": "华语", "v": "华语"}, {
                    "n": "香港地区", "v": "香港地区"
                }, {"n": "美国", "v": "美国"}, {"n": "欧洲", "v": "欧洲"}, {"n": "韩国", "v": "韩国"}, {
                    "n": "日本", "v": "日本"
                }, {"n": "台湾地区", "v": "台湾地区"}, {"n": "泰国", "v": "泰国"}, {
                    "n": "台湾地区", "v": "台湾地区"
                }, {"n": "印度", "v": "印度"}, {"n": "其它", "v": "其它"}]
            }, {
                "key": "year",
                "name": "年份",
                "value": [{"n": "全部", "v": "年份"}, {"n": "2024", "v": "2024"}, {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {
                    "n": "2021", "v": "2021"
                }, {"n": "2020", "v": "2020"}, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {
                    "n": "2017", "v": "2017"
                }, {"n": "2016", "v": "2016"}, {"n": "2015", "v": "2015"}, {"n": "10年代", "v": "10年代"}, {
                    "n": "00年代", "v": "00年代"
                }, {"n": "90年代", "v": "90年代"}, {"n": "80年代", "v": "80年代"}]
            }, {
                "key": "by", "name": "排序", "value": [{"n": "热播榜", "v": "热播榜"}, {"n": "好评榜", "v": "好评榜"}, {
                    "n": "新上线", "v": "新上线"
                }]
            }], "4": [{
                "key": "class", "name": "类型", "value": [{"n": "全部", "v": "类型"}, {"n": "国产漫", "v": "国产漫"}, {
                    "n": "欧美漫", "v": "欧美漫"
                }, {"n": "日韩漫", "v": "日韩漫"}, {"n": "港台漫", "v": "港台漫"}]
            }, {
                "key": "area",
                "name": "地区",
                "value": [{"n": "全部", "v": "地区"}, {"n": "中国大陆", "v": "中国大陆"}, {
                    "n": "日本", "v": "日本"
                }, {"n": "韩国", "v": "韩国"}, {"n": "欧美", "v": "欧美"}, {"n": "其它", "v": "其它"}]
            }, {
                "key": "year",
                "name": "年份",
                "value": [{"n": "全部", "v": "年份"}, {"n": "2024", "v": "2024"}, {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {
                    "n": "2021", "v": "2021"
                }, {"n": "2020", "v": "2020"}, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {
                    "n": "2017", "v": "2017"
                }, {"n": "2016", "v": "2016"}, {"n": "2015", "v": "2015"}, {"n": "10年代", "v": "10年代"}, {
                    "n": "00年代", "v": "00年代"
                }, {"n": "90年代", "v": "90年代"}, {"n": "80年代", "v": "80年代"}]
            }, {
                "key": "by", "name": "排序", "value": [{"n": "热播榜", "v": "热播榜"}, {"n": "新上线", "v": "新上线"}]
            }, {
                "key": "total",
                "name": "状态",
                "value": [{"n": "全部", "v": "状态"}, {"n": "连载", "v": "连载"}, {"n": "完结", "v": "完结"}]
            }], "3": [{
                "key": "class",
                "name": "类型",
                "value": [{"n": "全部", "v": "类型"}, {"n": "大陆", "v": "大陆"}, {"n": "港台", "v": "港台"}, {
                    "n": "日韩", "v": "日韩"
                }, {"n": "欧美", "v": "欧美"}]
            }, {
                "key": "area",
                "name": "地区",
                "value": [{"n": "全部", "v": "地区"}, {"n": "内地", "v": "内地"}, {"n": "港台", "v": "港台"}, {
                    "n": "日韩", "v": "日韩"
                }, {"n": "欧美", "v": "欧美"}, {"n": "其它", "v": "其它"}]
            }, {
                "key": "year",
                "name": "年份",
                "value": [{"n": "全部", "v": "年份"}, {"n": "2024", "v": "2024"}, {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {
                    "n": "2021", "v": "2021"
                }, {"n": "2020", "v": "2020"}, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {
                    "n": "2017", "v": "2017"
                }, {"n": "2016", "v": "2016"}, {"n": "2015", "v": "2015"}, {"n": "10年代", "v": "10年代"}, {
                    "n": "00年代", "v": "00年代"
                }, {"n": "90年代", "v": "90年代"}, {"n": "80年代", "v": "80年代"}]
            }, {
                "key": "by", "name": "排序", "value": [{"n": "热播榜", "v": "热播榜"}, {"n": "新上线", "v": "新上线"}]
            }], "46": [{
                "key": "class", "name": "类型", "value": [{"n": "全部", "v": "类型"}, {"n": "日韩剧", "v": "日韩剧"}, {
                    "n": "欧美剧", "v": "欧美剧"
                }, {"n": "海外剧", "v": "海外剧"}]
            }, {
                "key": "area",
                "name": "地区",
                "value": [{"n": "全部", "v": "地区"}, {"n": "韩国", "v": "韩国"}, {"n": "美剧", "v": "美剧"}, {
                    "n": "日本", "v": "日本"
                }, {"n": "泰国", "v": "泰国"}, {"n": "英国", "v": "英国"}, {"n": "新加坡", "v": "新加坡"}, {
                    "n": "其他", "v": "其他"
                }]
            }, {
                "key": "year",
                "name": "年份",
                "value": [{"n": "全部", "v": "年份"}, {"n": "2024", "v": "2024"}, {"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {
                    "n": "2021", "v": "2021"
                }, {"n": "2020", "v": "2020"}, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {
                    "n": "2017", "v": "2017"
                }, {"n": "2016", "v": "2016"}, {"n": "2015", "v": "2015"}, {"n": "10年代", "v": "10年代"}, {
                    "n": "00年代", "v": "00年代"
                }, {"n": "90年代", "v": "90年代"}, {"n": "80年代", "v": "80年代"}]
            }, {
                "key": "by", "name": "排序", "value": [{"n": "热播榜", "v": "热播榜"}, {"n": "好评榜", "v": "好评榜"}, {
                    "n": "新上线", "v": "新上线"
                }]
            }]
        };
    }

    async parseVodShortListFromJson(obj) {
        let vod_list = []
        obj.forEach(function (it) {
            vod_list.push({
                vod_id: it.id, vod_name: it.name, vod_pic: it.img, vod_remarks: it.remarks,
            });
        });
        return vod_list
    }

    async parseVodShortListFromJsonBySearch(obj) {
        let videos = [];
        obj.forEach(function (it) {
            videos.push({
                vod_id: it.id, vod_name: it["video_name"], vod_pic: it.img, vod_remarks: it["qingxidu"] + '/' + it.category,
            });
        });
        return videos
    }

    async parseVodDetailfromJson(obj) {
        let vodDetail = new VodDetail()
        vodDetail.vod_id = obj["id"]
        vodDetail.vod_name = obj["name"]
        vodDetail.vod_pic = obj["img"]
        vodDetail.type_name = obj["type"]
        vodDetail.vod_year = obj["year"]
        vodDetail.vod_content = stripHtmlTag(obj["info"])
        vodDetail.vod_remarks = '更新至: ' + obj["msg"] + ' / 评分: ' + obj["score"]
        let episodes = obj["player_info"];
        let playlist = {};
        episodes.forEach(function (it) {
            let playurls = it["video_info"];
            playurls.forEach(function (playurl) {
                let source = it.show;
                let t = formatPlayUrl(vodDetail.vod_name, playurl.name);
                if (t.length === 0) t = playurl.name.trim();
                if (!playlist.hasOwnProperty(source)) {
                    playlist[source] = [];
                }
                playlist[source].push(t + '$' + playurl.url);
            });
        });
        vodDetail.vod_play_from = _.keys(playlist).join('$$$');
        let urls = _.values(playlist);
        let vod_play_url = [];
        urls.forEach(function (it) {
            vod_play_url.push(it.join('#'));
        });
        vodDetail.vod_play_url = vod_play_url.join('$$$');
        return vodDetail
    }

    async setHomeVod() {
        let data = JSON.parse(await this.fetch(this.siteUrl + '/api.php/provide/vod_rank?app=ylys&sort_type=month&imei=c431ea542cee9679&id=2&page=1', null, this.getHeader()));
        this.homeVodList = await this.parseVodShortListFromJson(data)
    }

    async setCategory(tid, pg, filter, extend) {
        if (pg <= 0 || typeof (pg) == 'undefined') pg = 1;
        let reqUrl = this.siteUrl + '/api.php/provide/vod_list?app=ylys&id=' + tid + '&page=' + pg + '&imei=c431ea542cee9679&';
        reqUrl += jinja2('area={{ext.area}}&year={{ext.year}}&type={{ext.class}}&total={{ext.total}}&order={{ext.by}}', {ext: extend});
        let data = JSON.parse(await this.fetch(reqUrl, null, this.getHeader())).list;
        this.vodList = await this.parseVodShortListFromJson(data)
        let pgChk = JSON.parse(await this.fetch(this.siteUrl + '/api.php/provide/vod_list?app=ylys&id=' + tid + '&page=' + (parseInt(pg) + 1) + '&imei=c431ea542cee9679&', null, this.getHeader())).msg;
        this.count = (pgChk === 'ok') ? parseInt(pg) + 1 : parseInt(pg);
        this.limit = 20
        this.total = this.limit * this.count
    }

    async setDetail(id) {
        let data = JSON.parse(await this.fetch(this.siteUrl + '/api.php/provide/vod_detail?app=ylys&imei=c431ea542cee9679&id=' + id, null, this.getHeader())).data;
        this.vodDetail = await this.parseVodDetailfromJson(data)
    }

    async setSearch(wd, quick) {
        let data = JSON.parse(await this.fetch(this.siteUrl + '/api.php/provide/search_result_more?app=ylys&video_name=' + wd + '&pageSize=20&tid=0&imei=c431ea542cee9679&page=0', null, this.getHeader())).data;
        this.vodList = await this.parseVodShortListFromJsonBySearch(data)
    }

    async setPlay(flag, id, flags) {
        try {
            if (id.indexOf('m3u8') !== -1) {
                this.playUrl = id.split('url=')[1]
            } else if (id.indexOf(',') !== -1) {
                let mjurl = id.split(',')[1]
                let jData = JSON.parse(await this.fetch(mjurl, null, this.getHeader()));
                this.playUrl = jData["data"]["url"]
            } else {
                let mjurl = 'http://43.154.104.152:1234/jhapi/cs.php?url=' + id.split('url=')[1]
                let jData = JSON.parse(await this.fetch(mjurl, null, this.getHeader()));
                this.playUrl = jData["data"]["url"]
            }
        } catch (e) {
            await this.jadeLog.error("播放失败")
        }
    }

}


let spider = new NanGuaSpider()

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