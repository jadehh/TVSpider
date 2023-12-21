import {__jsEvalReturn} from './nivod.js';


var spider = __jsEvalReturn();

async function test() {
    let siteKey = 'niba';
    let siteType = 0;














    await spider.init({skey: siteKey, stype: siteType, ext: ""});







    var classes = JSON.parse(await spider.home(true));
    console.debug(classes);

    //测试首页列表
    // var homeVod = JSON.parse(await spider.homeVod())
    // // console.debug(homeVod);
    // console.debug(JSON.stringify(homeVod));

    //测试分类列表
    var page = JSON.parse(await spider.category(1, 1, undefined, {}));
    console.debug(JSON.stringify(page));
    //
    // 测试搜索
    var detail = JSON.parse(await spider.detail("/index.php/voddetail/82468.html"));

    var search_page = JSON.parse(await spider.search("奥本海默"))
    console.debug(JSON.stringify(search_page));

    // 测试详情
    if (search_page.list && search_page.list.length > 0) {
        for (const k in search_page.list) {
            // console.debug(k)
            if (k >= 1) break;
            let obj = search_page.list[k]
            let spVid = search_page.list[k].vod_id
            console.debug("===", spVid)
            var detail = JSON.parse(await spider.detail(spVid || search_page.list[k].vod_id));
            // var detail = JSON.parse(await spider.detail("/index.php/voddetail/82405.html"))
            // // var detail = JSON.parse(await spider.detail("/index.php/voddetail/81254.html"));
            console.debug(JSON.stringify(detail));

            if (detail.list && detail.list.length > 0) {
                var pFlag = detail.list[0].vod_play_from.split('$$$');
                var pUrls = detail.list[0].vod_play_url.split('$$$');
                if (pFlag.length > 0 && pUrls.length > 0) {
                    for (const i in pFlag) {
                        // console.debug(i)
                        var flag = pFlag[i];
                        var urls = pUrls[i].split('#');
                        // console.debug(flag, urls)
                        for (const j in urls) {
                            var name = urls[j].split('$')[0];
                            var url = urls[j].split('$')[1];
                            console.debug(flag + " | " + name + " | " + url);
                            var playUrl = await spider.play(flag, url, []);
                            console.debug('playURL: ' + playUrl);
                        }
                    }
                }
            }


        }
    }
}

export {test};