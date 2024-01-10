import {__jsEvalReturn} from './jiujiuliu.js';


let spider = __jsEvalReturn();

async function test() {
    let siteKey = 'niba';
    let siteType = 0;
    await spider.init({
        skey: siteKey,
        stype: siteType,
        ext: {"token": "a5bf471ef70d4069b55758839d8ef4d1", "box": "TVBox"}
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
    var page = JSON.parse(await spider.category("/show/id/1", "1", undefined, {}));
    // console.debug(JSON.stringify(page));

    let detail = JSON.parse(await spider.detail("/detail/313.html"))
    // console.debug(JSON.stringify(detail));


    // 测试搜索
    //
    var search_page = JSON.parse(await spider.search("奥本海默"))
    // console.debug(JSON.stringify(search_page));

    // var play = await spider.play("1080","8bDyvtQuZPgWFns5mExYR9LJ0focNK6z@9tisBJg0Lg8YjuawSm1jm0TSsOGSULdI")



    // 测试详情
    // if (search_page.list && search_page.list.length > 0) {
    //     for (const k in search_page.list) {
    //         // console.debug(k)
    //         if (k >= 1) break;
    //         let obj = search_page.list[k]
    //         let spVid = search_page.list[k].vod_id
    //         console.debug("===", spVid)
    //         var detail = JSON.parse(await spider.detail(spVid || search_page.list[k].vod_id));
    //         // var detail = JSON.parse(await spider.detail("/index.php/voddetail/82405.html"))
    //         // // var detail = JSON.parse(await spider.detail("/index.php/voddetail/81254.html"));
    //         console.debug(JSON.stringify(detail));
    //
    //         if (detail.list && detail.list.length > 0) {
    //             var pFlag = detail.list[0].vod_play_from.split('$$$');
    //             var pUrls = detail.list[0].vod_play_url.split('$$$');
    //             if (pFlag.length > 0 && pUrls.length > 0) {
    //                 for (const i in pFlag) {
    //                     // console.debug(i)
    //                     var flag = pFlag[i];
    //                     var urls = pUrls[i].split('#');
    //                     // console.debug(flag, urls)
    //                     for (const j in urls) {
    //                         var name = urls[j].split('$')[0];
    //                         var url = urls[j].split('$')[1];
    //                         console.debug(flag + " | " + name + " | " + url);
    //                         url = "654c8d27f1265738cb41441b898f40c8628377ef+Oppenheimer.2023.1080p.BluRay.DD5.1.x264-GalaxyRG.chs.mkv@@@srt@@@654c46d7096533e59ea84d6082359478ffa5969c+Oppenheimer.2023.BluRay.1080p.DTS-HD.MA.5.1.AVC.REMUX-FraMeSToR.chs@@@srt@@@654c3efd27f8e9e233064fe49da8d81ca5d3fa5c+奥本海默 (2023) - Oppenheimer.2023.UHD.BluRay.2160p.DTS-HD.MA.5.1.HEVC.REMUX-FraMeSToR.chs&eng@@@ass@@@6551be3051ca57b8dd2b4f41a38f7efe39329ada+UNdNKT3Tu3Q+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiVU5kTktUM1R1M1FcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTcwNDYxNTU0NiwiaWF0IjoxNzA0NjA4Mjg2fQ.l1S4u4-LRQXDzK1hqvplI3tgAnbU7-_SPTcfgKaKFGCNK7wj0CMAkgHZBlzuUjikwMKpv2AN2SC2jBXhcdywFEgIfj_4HNC85uFdCJHIQGvpESwebtBujbAXhAyiZXyEZdfAASd2qnt92z1GI8GdNiCzNoJYQsFLsXBQSrnAtog"
    //                         var playUrl = await spider.play("标清", url, []);
    //                         console.debug('playURL: ' + playUrl);
    //                         break
    //                     }
    //                     break
    //                 }
    //             }
    //         }
    //
    //
    //     }
    // }
}

export {test};