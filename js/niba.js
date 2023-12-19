/*
* @File     : niba.js
* @Author   : jade
* @Date     : 2023/12/18 16:23
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {_, load, Uri} from '../lib/cat.js';
import {VodDetail} from "../lib/vod.js"
import {JadeLogging} from "../lib/log.js";
import {postJson} from "../lib/ali_object.js";
let JadeLog = new JadeLogging(getAppName(), "DEBUG")
async function init(cfg) {
    try {
        await JadeLog.info(`读取配置文件,key为:${cfg.skey},type为:${cfg.stype},ext为:${cfg.ext}`)
        let siteKey = _.isEmpty(cfg.skey) ? '' : cfg.skey;
        let siteType = _.isEmpty(cfg.stype) ? '' : cfg.stype;
    } catch (e) {
        await JadeLog.error("初始化失败,失败原因为:" + e.message)
    }
}

function getName() {
    return "💂‍┃泥巴┃💂"
}

function getAppName() {
    return "泥巴"
}

function getHeader() {
    let header = {};
    header['User-Agent'] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36" ;
    header['Referer'] = "https://www.nivod4.tv/"
    return header;
}




async function home(filter) {

    let params = {}
    params._ts = "1702965120731"
    params.app_version = "1.0"
    params.platform = 3
    params.market_id = "web_nivod"
    params.device_code = "web"
    params.versioncode = "1"
    params.oid = "8ca275aa5e12ba504b266d4c70d95d77a0c2eac5726198ea"
    params.sign = "565611c82c502775e96d93f27695ec29"

    let response = await  postJson("https://api.nivodz.com/show/channel/list/WEB/3.2?_ts=1702965961313&app_version=1.0&platform=3&market_id=web_nivod&device_code=web&versioncode=1&oid=8ca275aa5e12ba504b266d4c70d95d77a0c2eac5726198ea&sign=4692f325175432252a0547acb440e59b",getHeader())
    await JadeLog.info("Done")


}

async function homeVod() {
    return '{}';
}


async function category(tid, pg, filter, extend) {
    let urlParams = [tid.toString(), "", "", "", "", "", "", "", pg.toString(), "", "", ""]
    let extend_dic = get_extend_sort_dic(parseInt(tid))
    for (const key of Object.keys(extend_dic)) {
        urlParams[extend_dic[key]] = extend[key]
    }
    let reqUrl = siteUrl + '/index.php/vodshow/' + urlParams.join("-") + '.html';
    await JadeLog.info(`正在获取分类界面,请求url为:${reqUrl},tid为:${tid},pg为:${pg},filter为:${filter},extend为:${extend}`)
    let result = "";
    try {
        let con = await request(reqUrl);
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
        result = JSON.stringify({
            page: parseInt(pg),
            pagecount: pgCount,
            limit: limit,
            total: total,
            list: videos,
        });
        await JadeLog.info(`获取分类界面成功,详情界面结果为:${result}`)
        return result
    } catch (e) {
        await JadeLog.error("获取分类界面失败,失败原因为:" + e)
    }
}

async function detail(id) {
    let detailUrl = siteUrl + id;
    await JadeLog.info(`正在获取详情界面,url为:${detailUrl},id为:${id}`)
    try {
        let con = await request(detailUrl);
        let $ = load(con);
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
        let vidoe_info_director_list = video_items[0].children.slice(-1)[0].children
        for (const vidoe_info_director of vidoe_info_director_list) {
            try {
                vodDetail.vod_director = vodDetail.vod_director + vidoe_info_director.children[0].data
            } catch {

            }
        }
        let vidoe_info_actor_list = $(".video-info-actor")[1].children
        for (const vidoe_info_actor of vidoe_info_actor_list) {
            try {
                vodDetail.vod_actor = vodDetail.vod_actor + vidoe_info_actor.children[0].data
            } catch {

            }
        }
        vodDetail.vod_year = $(video_items[2]).find("a")[0].children[0].data
        vodDetail.vod_remarks = `清晰度:${video_items[3].children.slice(-1)[0].children[0].data}, 制作人:Jade`
        let video_content_list = video_items[4].children.slice(-1)[0].children
        for (const video_content of video_content_list) {
            try {
                vodDetail.vod_content = vodDetail.vod_content + video_content.children[0].data
            } catch {

            }
        }
        vodDetail.vod_content = vodDetail.vod_content.replace("[收起部分]", "").replace("[展开全部]", "")
        const share_url_list = [];
        let items = $('.module-row-info')
        for (const item of items) {
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
            await JadeLog.warning(`获取详情界面失败,失败原因为:没有分享链接`)
            return JSON.stringify({"list": [vodDetail]});
        }

    } catch (e) {
        await JadeLog.error(`获取详情界面失败,失败原因为:${e.message}`)
    }
}

async function play(flag, id, flags) {
    return await playContent(flag, id, flags);
}


async function search(wd, quick) {
    let searchUrl = siteUrl + '/index.php/vodsearch/-------------.html?wd=' + wd;
    await JadeLog.info(`正在获取搜索界面,url为:${searchUrl},名称为:${wd},quick为:${quick}`)
    try {
        let html = await request(searchUrl, UA);
        let $ = load(html);
        let items = $('.module-search-item');
        let videos = [];
        for (const item of items) {
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