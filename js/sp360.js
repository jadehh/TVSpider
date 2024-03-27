/*
* @File     : sp360.js
* @Author   : jade
* @Date     : 2024/3/21 11:18
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {Spider} from "./spider.js";
import {_, Crypto, load} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";

class Sp360Spider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://api.web.360kan.com"
    }

    getName() {
        return "🥎┃360影视┃🥎"
    }

    getAppName() {
        return "360"
    }
    getJSName() {
        return "sp360"
    }

    getType() {
        return 3
    }

    async init(cfg) {
        await super.init(cfg);
        this.danmuUrl = true
    }

    async setClasses() {
        this.classes = [this.getTypeDic("最近更新", "最近更新"), this.getTypeDic("电影", "1"), this.getTypeDic("剧集", "2"), this.getTypeDic("综艺", "3"), this.getTypeDic("动漫", "4")]
    }


    async setFilterObj() {
        this.filterObj = {
            "1": [{
                "key": "cat", "name": "类型", "value": [{
                    "n": "全部", "v": ""
                }, {
                    "n": "喜剧", "v": "喜剧"
                }, {
                    "n": "爱情", "v": "爱情"
                }, {
                    "n": "动作", "v": "动作"
                }, {
                    "n": "恐怖", "v": "恐怖"
                }, {
                    "n": "科幻", "v": "科幻"
                }, {
                    "n": "剧情", "v": "剧情"
                }, {
                    "n": "犯罪", "v": "犯罪"
                }, {
                    "n": "奇幻", "v": "奇幻"
                }, {
                    "n": "战争", "v": "战争"
                }, {
                    "n": "悬疑", "v": "悬疑"
                }, {
                    "n": "动画", "v": "动画"
                }, {
                    "n": "文艺", "v": "文艺"
                }, {
                    "n": "纪录", "v": "纪录"
                }, {
                    "n": "传记", "v": "传记"
                }, {
                    "n": "歌舞", "v": "歌舞"
                }, {
                    "n": "古装", "v": "古装"
                }, {
                    "n": "历史", "v": "历史"
                }, {
                    "n": "惊悚", "v": "惊悚"
                }, {
                    "n": "伦理", "v": "伦理"
                }, {
                    "n": "其他", "v": "其他"
                }]
            }, {
                "key": "year", "name": "年代", "value": [{
                    "n": "全部", "v": ""
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
                    "n": "2010", "v": "2010"
                }, {
                    "n": "2009", "v": "2009"
                }, {
                    "n": "2008", "v": "2008"
                }, {
                    "n": "2007", "v": "2007"
                }, {
                    "n": "更早", "v": "lt_year"
                }]
            }, {
                "key": "area", "name": "地区", "value": [{
                    "n": "全部", "v": ""
                }, {
                    "n": "内地", "v": "大陆"
                }, {
                    "n": "中国香港", "v": "香港"
                }, {
                    "n": "中国台湾", "v": "台湾"
                }, {
                    "n": "泰国", "v": "泰国"
                }, {
                    "n": "美国", "v": "美国"
                }, {
                    "n": "韩国", "v": "韩国"
                }, {
                    "n": "日本", "v": "日本"
                }, {
                    "n": "法国", "v": "法国"
                }, {
                    "n": "英国", "v": "英国"
                }, {
                    "n": "德国", "v": "德国"
                }, {
                    "n": "印度", "v": "印度"
                }, {
                    "n": "其他", "v": "其他"
                }]
            }, {
                "key": "rank", "name": "排序", "value": [{
                    "n": "最近热映", "v": "rankhot"
                }, {
                    "n": "最近上映", "v": "ranklatest"
                }, {
                    "n": "最受好评", "v": "rankpoint"
                }]
            }], "2": [{
                "key": "cat", "name": "类型", "value": [{
                    "n": "全部", "v": ""
                }, {
                    "n": "言情", "v": "言情"
                }, {
                    "n": "剧情", "v": "剧情"
                }, {
                    "n": "伦理", "v": "伦理"
                }, {
                    "n": "喜剧", "v": "喜剧"
                }, {
                    "n": "悬疑", "v": "悬疑"
                }, {
                    "n": "都市", "v": "都市"
                }, {
                    "n": "偶像", "v": "偶像"
                }, {
                    "n": "古装", "v": "古装"
                }, {
                    "n": "军事", "v": "军事"
                }, {
                    "n": "警匪", "v": "警匪"
                }, {
                    "n": "历史", "v": "历史"
                }, {
                    "n": "励志", "v": "励志"
                }, {
                    "n": "神话", "v": "神话"
                }, {
                    "n": "谍战", "v": "谍战"
                }, {
                    "n": "青春", "v": "青春剧"
                }, {
                    "n": "家庭", "v": "家庭剧"
                }, {
                    "n": "动作", "v": "动作"
                }, {
                    "n": "情景", "v": "情景"
                }, {
                    "n": "武侠", "v": "武侠"
                }, {
                    "n": "科幻", "v": "科幻"
                }, {
                    "n": "其他", "v": "其他"
                }, {
                    "n": "全部", "v": ""
                }]
            }, {
                "key": "year", "name": "年代", "value": [{
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
                    "n": "2010", "v": "2010"
                }, {
                    "n": "2009", "v": "2009"
                }, {
                    "n": "2008", "v": "2008"
                }, {
                    "n": "2007", "v": "2007"
                }, {
                    "n": "更早", "v": "lt_year"
                }]
            }, {
                "key": "area", "name": "地区", "value": [{
                    "n": "全部", "v": ""
                }, {
                    "n": "内地", "v": "内地"
                }, {
                    "n": "中国香港", "v": "香港"
                }, {
                    "n": "中国台湾", "v": "台湾"
                }, {
                    "n": "泰国", "v": "泰国"
                }, {
                    "n": "日本", "v": "日本"
                }, {
                    "n": "韩国", "v": "韩国"
                }, {
                    "n": "美国", "v": "美国"
                }, {
                    "n": "英国", "v": "英国"
                }, {
                    "n": "新加坡", "v": "新加坡"
                }]
            }, {
                "key": "rank", "name": "排序", "value": [{
                    "n": "最近热映", "v": "rankhot"
                }, {
                    "n": "最近上映", "v": "ranklatest"
                }, {
                    "n": "最受好评", "v": "rankpoint"
                }]
            }], "3": [{
                "key": "cat", "name": "类型", "value": [{
                    "n": "全部", "v": ""
                }, {
                    "n": "脱口秀", "v": "脱口秀"
                }, {
                    "n": "真人秀", "v": "真人秀"
                }, {
                    "n": "搞笑", "v": "搞笑"
                }, {
                    "n": "选秀", "v": "选秀"
                }, {
                    "n": "八卦", "v": "八卦"
                }, {
                    "n": "访谈", "v": "访谈"
                }, {
                    "n": "情感", "v": "情感"
                }, {
                    "n": "生活", "v": "生活"
                }, {
                    "n": "晚会", "v": "晚会"
                }, {
                    "n": "音乐", "v": "音乐"
                }, {
                    "n": "职场", "v": "职场"
                }, {
                    "n": "美食", "v": "美食"
                }, {
                    "n": "时尚", "v": "时尚"
                }, {
                    "n": "游戏", "v": "游戏"
                }, {
                    "n": "少儿", "v": "少儿"
                }, {
                    "n": "体育", "v": "体育"
                }, {
                    "n": "纪实", "v": "纪实"
                }, {
                    "n": "科教", "v": "科教"
                }, {
                    "n": "曲艺", "v": "曲艺"
                }, {
                    "n": "歌舞", "v": "歌舞"
                }, {
                    "n": "财经", "v": "财经"
                }, {
                    "n": "汽车", "v": "汽车"
                }, {
                    "n": "播报", "v": "播报"
                }, {
                    "n": "其他", "v": "其他"
                }]
            }, {
                "key": "area", "name": "地区", "value": [{
                    "n": "全部", "v": ""
                }, {
                    "n": "内地", "v": "大陆"
                }, {
                    "n": "中国香港", "v": "香港"
                }, {
                    "n": "中国台湾", "v": "台湾"
                }, {
                    "n": "日本", "v": "日本"
                }, {
                    "n": "欧美", "v": "欧美"
                }]
            }, {
                "key": "rank", "name": "排序", "value": [{
                    "n": "最近热映", "v": "rankhot"
                }, {
                    "n": "最近上映", "v": "ranklatest"
                }]
            }], "4": [{
                "key": "cat", "name": "类型", "value": [{
                    "n": "全部", "v": ""
                }, {
                    "n": "热血", "v": "热血"
                }, {
                    "n": "科幻", "v": "科幻"
                }, {
                    "n": "美少女", "v": "美少女"
                }, {
                    "n": "魔幻", "v": "魔幻"
                }, {
                    "n": "经典", "v": "经典"
                }, {
                    "n": "励志", "v": "励志"
                }, {
                    "n": "少儿", "v": "少儿"
                }, {
                    "n": "冒险", "v": "冒险"
                }, {
                    "n": "搞笑", "v": "搞笑"
                }, {
                    "n": "推理", "v": "推理"
                }, {
                    "n": "恋爱", "v": "恋爱"
                }, {
                    "n": "治愈", "v": "治愈"
                }, {
                    "n": "幻想", "v": "幻想"
                }, {
                    "n": "校园", "v": "校园"
                }, {
                    "n": "动物", "v": "动物"
                }, {
                    "n": "机战", "v": "机战"
                }, {
                    "n": "亲子", "v": "亲子"
                }, {
                    "n": "儿歌", "v": "儿歌"
                }, {
                    "n": "运动", "v": "运动"
                }, {
                    "n": "悬疑", "v": "悬疑"
                }, {
                    "n": "怪物", "v": "怪物"
                }, {
                    "n": "战争", "v": "战争"
                }, {
                    "n": "益智", "v": "益智"
                }, {
                    "n": "青春", "v": "青春"
                }, {
                    "n": "童话", "v": "童话"
                }, {
                    "n": "竞技", "v": "竞技"
                }, {
                    "n": "动作", "v": "动作"
                }, {
                    "n": "社会", "v": "社会"
                }, {
                    "n": "友情", "v": "友情"
                }, {
                    "n": "真人版", "v": "真人版"
                }, {
                    "n": "电影版", "v": "电影版"
                }, {
                    "n": "OVA版", "v": "OVA版"
                }, {
                    "n": "TV版", "v": "TV版"
                }, {
                    "n": "新番动画", "v": "新番动画"
                }, {
                    "n": "完结动画", "v": "完结动画"
                }]
            }, {
                "key": "year", "name": "年代", "value": [{
                    "n": "全部", "v": ""
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
                }, {
                    "n": "2009", "v": "2009"
                }, {
                    "n": "2008", "v": "2008"
                }, {
                    "n": "2007", "v": "2007"
                }, {
                    "n": "2006", "v": "2006"
                }, {
                    "n": "2005", "v": "2005"
                }, {
                    "n": "2004", "v": "2004"
                }, {
                    "n": "更早", "v": "更早"
                }]
            }, {
                "key": "area", "name": "地区", "value": [{
                    "n": "全部", "v": ""
                }, {
                    "n": "内地", "v": "大陆"
                }, {
                    "n": "日本", "v": "日本"
                }, {
                    "n": "美国", "v": "美国"
                }]
            }, {
                "key": "rank", "name": "排序", "value": [{
                    "n": "最近热映", "v": "rankhot"
                }, {
                    "n": "最近上映", "v": "ranklatest"
                }]
            }]
        }
    }

    async parseVodShortListFromJson(obj) {
        let vod_list = []
        for (const data of obj["data"]) {
            let vodShort = new VodShort();
            vodShort.vod_id = data["ent_id"] + "+" + data["cat"]
            if (!data["cover"].startsWith("http")) {
                vodShort.vod_pic = "https:" + data["cover"]
            } else {
                vodShort.vod_pic = data["cover"]
            }
            vodShort.vod_name = data["title"]
            vodShort.vod_remarks = data["upinfo"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodShortListFromJsonByCategory(obj, tid) {
        let vod_list = []
        for (const data of obj["data"]["movies"]) {
            let vodShort = new VodShort();
            vodShort.vod_id = data["id"] + "+" + tid
            if (!data["cover"].startsWith("http")) {
                vodShort.vod_pic = "https:" + data["cdncover"]
            } else {
                vodShort.vod_pic = data["cdncover"]
            }
            vodShort.vod_name = data["title"]
            vodShort.vod_remarks = data["tag"]
            if (!_.isEmpty(data["doubanscore"])) {
                vodShort.vod_remarks = "豆瓣评分:" + data["doubanscore"]
            } else {
                if (_.isEmpty(vodShort.vod_remarks)) {
                    vodShort.vod_remarks = data["pubdate"]
                }
            }
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async parseVodDetailfromJson(obj) {
        let vodDetail = new VodDetail()
        let data = obj["data"]
        vodDetail.vod_name = data["title"]
        vodDetail.vod_pic = data["cdncover"]
        vodDetail.vod_remarks = data["pubdate"]
        vodDetail.vod_actor = data["actor"].join("*")
        vodDetail.vod_director = data["director"].join("*")
        vodDetail.type_name = data["moviecategory"].join("*")
        vodDetail.vod_year = data["pubdate"]
        vodDetail.vod_area = data["area"].join("*")
        vodDetail.vod_content = data["description"]

        let playlist = {}
        for (const playFormat of data["playlink_sites"]) {
            let vodItems = []
            if (!_.isEmpty(data["allepidetail"])) {
                for (const items of data["allepidetail"][playFormat]) {
                    let episodeUrl = items["url"]
                    let episodeName = items["playlink_num"]
                    vodItems.push(episodeName + "$" + episodeUrl);
                }
            } else {
                let items = data["playlinksdetail"][playFormat]
                let episodeUrl = items["default_url"]
                let episodeName = items["quality"]
                vodItems.push(episodeName + "$" + episodeUrl);
            }
            playlist[playFormat] = vodItems.join("#")
        }


        vodDetail.vod_play_url = _.values(playlist).join('$$$');
        vodDetail.vod_play_from = _.keys(playlist).join('$$$');
        return vodDetail
    }

    async parseVodShortListFromJsonBySearch(obj) {
        let vod_list = []
        for (const data of obj["data"]["longData"]["rows"]) {
            let vodShort = new VodShort();
            vodShort.vod_id = data["en_id"] + "+" + data["cat_id"]
            if (!data["cover"].startsWith("http")) {
                vodShort.vod_pic = "https:" + data["cover"]
            } else {
                vodShort.vod_pic = data["cover"]
            }
            vodShort.vod_name = data["titleTxt"]
            vodShort.vod_remarks = data["coverInfo"]["txt"]
            vod_list.push(vodShort)
        }
        return vod_list
    }

    async setHomeVod() {
        let response = await this.fetch(this.siteUrl + "/v1/rank?cat=1", null, this.getHeader())
        this.homeVodList = await this.parseVodShortListFromJson(JSON.parse(response))
    }


    async setCategory(tid, pg, filter, extend) {
        let rank = extend["by"] ?? "rankhot"
        let year = extend["year"] ?? ""
        let cat = extend["cat"] ?? ""
        let area = extend["area"] ?? ""
        let url = this.siteUrl + `/v1/filter/list?catid=${tid}&rank=${rank}&cat=${cat}&year=${year}&area=${area}&act=&size=35&pageno=${pg}&callback=`
        let response = await this.fetch(url, null, this.getHeader())
        this.vodList = await this.parseVodShortListFromJsonByCategory(JSON.parse(response), tid)
    }

    async setDetail(id) {
        let tid_list = id.split("+")
        let url = this.siteUrl + `/v1/detail?cat=${tid_list[1]}&id=${tid_list[0]}`
        let response = await this.fetch(url, null, this.getHeader())
        this.vodDetail = await this.parseVodDetailfromJson(JSON.parse(response))
    }

    async setSearch(wd, quick) {
        let url = `https://api.so.360kan.com/index?force_v=1&kw=${wd}&from=&pageno=1&v_ap=1&tab=all`
        let response = await this.fetch(url, null, this.getHeader())
        this.vodList = await this.parseVodShortListFromJsonBySearch(JSON.parse(response))
    }

    async setPlay(flag, id, flags) {
        if (this.danmuUrl) {
            this.danmuUrl = await this.danmuSpider.getVideoUrl(id, 0)
        }
        this.result.parse = 1 //启用自动解析
        this.result.jx = 1
        this.playUrl = id
    }
}

let spider = new Sp360Spider()

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
export {spider}