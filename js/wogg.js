/*
 * @Author: samples jadehh@live.com
 * @Date: 2023-12-14 11:03:04
 * @LastEditors: samples jadehh@live.com
 * @LastEditTime: 2023-12-14 11:03:04
 * @FilePath: js/wogg.js
 * @Description: 玩偶哥哥爬虫类
 */
import {_, load, Uri} from '../lib/cat.js';
import {VodDetail} from "../lib/vod.js"
import {JadeLogging} from "../lib/log.js";
import {detailContent, initAli, playContent} from "../lib/ali.js";


let siteKey = '';
let siteType = 0;
let siteUrl = 'https://tvfan.xxooo.cf';
let UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36";
let patternAli = /(https:\/\/www\.aliyundrive\.com\/s\/[^"]+|https:\/\/www\.alipan\.com\/s\/[^"]+)/
let JadeLog = new JadeLogging(getAppName(), "DEBUG")

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    try {
        await JadeLog.info(`读取配置文件,key为:${cfg.skey},type为:${cfg.stype},ext为:${cfg.ext}`)
        siteKey = _.isEmpty(cfg.skey) ? '' : cfg.skey;
        siteType = _.isEmpty(cfg.stype) ? '' : cfg.stype;
        await initAli(cfg);
    } catch (e) {
        await JadeLog.error("初始化失败,失败原因为:" + e.message)
    }
}

function getName() {
    return "💂‍┃阿里玩偶┃💂"
}

function getAppName() {
    return "阿里玩偶"
}

async function request(reqUrl, agentSp) {
    let header = {"User-Agent": agentSp}
    let uri = new Uri(reqUrl);
    let res = await req(uri.toString(), {
        headers: header,
        timeout: 100000
    });
    let keys = Object.keys(res).join(",")
    return res.content;
}

function getHeader() {
    let header = {};
    header['User-Agent'] = UA;
    return header;
}

async function getString(url) {
    let res = await req(url, {
        headers: getHeader()
    });
    return res.content;
}

function parseVodListFromDoc($) {
    let items = $('.module:eq(0) > .module-list > .module-items > .module-item');
    let videos = [];
    for (const item of items) {
        let oneA = $(item).find('.module-item-cover .module-item-pic a').first();
        let href = oneA.attr('href');
        let name = oneA.attr('title');
        let oneImg = $(item).find('.module-item-cover .module-item-pic img').first();
        let pic = oneImg.attr('data-src');
        if (pic.indexOf("img.php?url=") > 0) {
            pic = pic.split("img.php?url=")[1]
        }
        let remark = $(item).find('.module-item-text').first().text();
        videos.push({
            vod_id: href,
            vod_name: name,
            vod_pic: pic,
            vod_remarks: remark,
        });
    }
    return videos

}

async function home(filter) {
    await JadeLog.info("正在解析首页")
    try {
        let content = await request("https://gh.con.sh/https://raw.githubusercontent.com/jadehh/Spider/main/json/wanou.json", UA);
        await JadeLog.info("类别信息解析成功");
        let con =  await request(siteUrl,UA);
        const $ = load(con);
        let elements = $('.nav-link')
        await JadeLog.info("解析html内容成功")
        let classes = []
        for (const element of elements) {
            let type_id = parseInt(element.attribs.href.split("/").at(-1).split(".html")[0])
            let type_name = element.children[2].data.replace("\n", "").replace(" ", "").replace("玩偶", "")
            let type_dic = {type_id: type_id, type_name: type_name}
            await JadeLog.info(`type_id = ${type_id},type_name = ${type_name}`)
            classes.push(type_dic)
        }
        let vod_list = parseVodListFromDoc($)
        let result = JSON.stringify({
            class: classes,
            list: vod_list,
            filters: JSON.parse(content),

        });
        await JadeLog.info("首页解析完成,首页信息为:" + result)
        return result
    } catch (e) {
        await JadeLog.error("首页解析失败,失败原因为:" + e)
    }

}


async function homeVod() {
    return '{}';
}

function get_extend_sort_dic(tid) {
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
            "1": 3,
            "2": 1,
            "3": 4,
            "4": 11,
            "5": 5,
            "6": 2
        }
    } else if (tid === 4) {
        extend_dic = {
            "1": 1,
            "2": 11,
            "3": 5,
            "4": 2,
        }
    } else if (tid === 6) {
        extend_dic = {
            "1": 3,
            "2": 1,
            "3": 11,
            "4": 5,
            "5": 2,
        }
    } else if (tid === 5) {
        extend_dic = {
            "1": 5,
            "2": 2,
        }
    }

    return extend_dic
}

async function category(tid, pg, filter, extend) {
    let urlParams = [tid.toString(), "", "", "", "", "", "", "", pg.toString(), "", "", ""]
    let extend_dic = get_extend_sort_dic(parseInt(tid))
    for (const key of Object.keys(extend_dic)) {
        urlParams[extend_dic[key]] = extend[key]
    }
    let reqUrl = siteUrl + '/index.php/vodshow/' + urlParams.join("-") + '.html';
    await JadeLog.info(`正在获取分类界面,请求url为:${reqUrl},tid为:${tid},pg为:${pg},filter为:${filter},extend为:${extend}`)
    try {
        let con = await request(reqUrl, UA);
        const $ = load(con);
        let videos = parseVodListFromDoc($)
        let patternPageCount = /\$\("\.mac_total"\)\.text\('(\d+)'\)/
        let matches = patternPageCount.exec(con)
        let total = 0;
        const limit = 72;
        let pgCount;
        if (matches.length > 0) {
            total = parseInt(matches[1])
        }
        if (total <= limit) {
            pgCount = 1
        } else {
            pgCount = Math.ceil(total / limit)
        }
        let result = JSON.stringify({
            page: parseInt(pg),
            pagecount: pgCount,
            limit: limit,
            total: total,
            list: videos,
        });
        await JadeLog.info(`正在获取分类界面成功,详情界面结果为:${result}`)
        return result
    } catch (e) {
        await JadeLog.error("获取分类界面失败,失败原因为:" + e)
    }
}

async function detail(id) {
    let detailUrl = siteUrl + id;
    await JadeLog.info(`正在获取详情界面,url为:${detailUrl},id为:${id}`)
    try {
        let aliUrl = await request(detailUrl, UA);
        let $ = load(aliUrl);
        let vodDetail = new VodDetail()
        let items = $('.module-row-info')
        vodDetail.vod_name = $('.page-title')[0].children[0].data
        let video_info_aux_list = $($(".video-info-aux")).find(".tag-link")[1].children
        for (var video_info_aux of video_info_aux_list) {
            try {
                vodDetail.type_name = vodDetail.type_name + video_info_aux.children[0].data
            } catch {

            }
        }
        vodDetail.vod_pic = $($(".mobile-play")).find(".lazyload")[0].attribs["data-src"]
        let video_items = $('.video-info-items')
        let vidoe_info_director_list = video_items[0].children[2].children
        for (var vidoe_info_director of vidoe_info_director_list) {
            try {
                vodDetail.vod_director = vodDetail.vod_director + vidoe_info_director.children[0].data
            } catch {

            }
        }
        let vidoe_info_actor_list = $(".video-info-actor")[1].children
        for (var vidoe_info_actor of vidoe_info_actor_list) {
            try {
                vodDetail.vod_actor = vodDetail.vod_actor + vidoe_info_actor.children[0].data
            } catch {

            }
        }
        vodDetail.vod_year = $(video_items[2]).find("a")[0].children[0].data
        vodDetail.vod_remarks = `清晰度:${video_items[3].children[2].children[0].data}, 制作人:Jade`
        let video_content_list = video_items[4].children[2].children
        for (var video_content of video_content_list) {
            try {
                vodDetail.vod_content = vodDetail.vod_content + video_content.children[0].data
            } catch {

            }
        }
        vodDetail.vod_content = vodDetail.vod_content.replace("[收起部分]", "").replace("[展开全部]", "")
        var share_url_list = []
        for (var item of items) {
            let aliUrl = $(item).find("p")[0].children[0].data
            let matches = aliUrl.match(patternAli);
            if (!_.isEmpty(matches))
                share_url_list.push(matches[1])
        }
        if (share_url_list.length > 0) {
            let aliVodDetail = await detailContent(share_url_list)
            vodDetail.vod_play_url = aliVodDetail.vod_play_url
            vodDetail.vod_play_from = aliVodDetail.vod_play_from
            let result = JSON.stringify({"list": [vodDetail]});
            await JadeLog.info(`获取详情界面成功,详情界面结果为:${result}`)
            return result
        } else {
            await JadeLog.info(`获取详情界面失败,失败原因为:没有分享链接`)
            return JSON.stringify({"list": [vodDetail]});
        }

    } catch (e) {
        await JadeLog.info(`获取详情界面失败,失败原因为:${e.message}`)
    }
}

async function play(flag, id, flags) {
    return await playContent(flag, id, flags);
}


async function search(wd, quick) {
    let searchUrl = siteUrl + '/index.php/vodsearch/-------------.html?wd=' + wd;
    await JadeLog.info(`正在获取分类界面,url为:${searchUrl},名称为:${wd},quick为:${quick}`)
    try {
        let html = await request(searchUrl, UA);
        let $ = load(html);
        let items = $('.module-search-item');
        let videos = [];
        for (var item of items) {
            let vodId = $(item).find(".video-serial")[0].attribs.href;
            let name = $(item).find(".video-serial")[0].attribs.title;
            let pic = $(item).find(".module-item-pic > img")[0].attribs['data-src'];
            let remark = '';
            videos.push({
                vod_id: vodId,
                vod_name: name,
                vod_pic: pic,
                vod_remarks: remark,
            });
        }
        let result = JSON.stringify({
            list: videos,
        });
        await JadeLog.info(`获取搜索界面成功,详情界面结果为:${result}`)
        return result
    } catch (e) {
        await JadeLog.error("获取搜索界面失败,失败原因为:" + e)
    }

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

