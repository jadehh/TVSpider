import {__jsEvalReturn} from './weixine.js';


let spider = __jsEvalReturn();

async function test() {
    let siteKey = 'aiyingshi';
    let siteType = 0;
    await spider.init({
        skey: siteKey,
        stype: siteType,
        ext: {"token": "a5bf471ef70d4069b55758839d8ef4d1", "box": "CatOpen", "code": "1"}
    });
    //
    //
    //
    //
    //
    //
    //
    // var classes = JSON.parse(await spider.home(true));
    // // console.debug(classes);    // var classes = JSON.parse(await spider.home(true));
    // // console.debug(classes);    // var classes = JSON.parse(await spider.home(true));
    // // //
    // // // // //测试首页列表
    // var homeVod = JSON.parse(await spider.homeVod())
    // // console.debug(homeVod);
    // // // console.debug(JSON.stringify(homeVod));
    // //
    // // //测试分类列表
    // var page = JSON.parse(await spider.category("1", "1", undefined, {}));
    // console.debug(JSON.stringify(page));

    let detail1 = JSON.parse(await spider.detail("/voddetail/336160.html"))
    console.debug(JSON.stringify(detail1));
    if (detail1.list && detail1.list.length > 0) {
        const pFlag1 = detail1.list[0].vod_play_from.split('$$$');
        const pUrls1 = detail1.list[0].vod_play_url.split('$$$');
        if (pFlag1.length > 0 && pUrls1.length > 0) {
            for (const i in pFlag1) {
                // console.debug(i)
                let flag1 = pFlag1[i];
                let urls1 = pUrls1[i].split('#');
                // console.debug(flag, urls)
                for (const j in urls1) {
                    var name1 = urls1[j].split('$')[0];
                    var url1 = urls1[j].split('$')[1];
                    console.debug(flag + " | " + name1 + " | " + url1);
                    var playUrl1 = await spider.play(flag1, url1, []);
                    console.debug('playURL: ' + playUrl1);
                    break
                }
                break
            }
        }
    }



// 测试搜索
//
var search_page = JSON.parse(await spider.search("繁花"))
// console.debug(JSON.stringify(search_page));

// var play = await spider.play("1080","8bDyvtQuZPgWFns5mExYR9LJ0focNK6z@9tisBJg0Lg8YjuawSm1jm0TSsOGSULdI")


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
                        break
                    }
                    break
                }
            }
        }
    }
}
}

export {test};