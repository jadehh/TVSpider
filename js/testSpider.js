import {__jsEvalReturn} from './wogg.js';


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
    // var page = JSON.parse(await spider.category("https://hongkongdollvideo.com/91制片厂/", "1", undefined, {}));
    // console.debug(JSON.stringify(page));

    // let detail = JSON.parse(await spider.detail("https://hongkongdollvideo.com/video/10b1a473f0b33032.html"))
    // console.debug(JSON.stringify(detail));


    // 测试搜索
    //
    // var search_page = JSON.parse(await spider.search("繁花"))
    // console.debug(JSON.stringify(search_page));

    // var play = await spider.play("1080","8bDyvtQuZPgWFns5mExYR9LJ0focNK6z@9tisBJg0Lg8YjuawSm1jm0TSsOGSULdI")

    let url2 = "6599cc283e24ce67258c46f9b8353683d40a33ce+86ZtUWv8uTr+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiODZadFVXdjh1VHJcIixcImNyZWF0b3JcIjpcIjI1YTJkY2QwYzg4ZTRhYTZhZGZkZmMxODEyODYwMTEwXCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTcwNDYxNDEyMSwiaWF0IjoxNzA0NjA2ODYxfQ.Wa4cic3qqgiOYlMTP87S77e8SBKpzl2mPmCE1RtzFXqKrDA9N70ubejsqFQy46Ue7Dd_63-hwbhTuCh6kowDknFWm1GL0DaFumUsxaZ29tNL6KeX0i1ecvc-JtBH01pRmBw6GT79vsHdw71Q9tZIkfwM13spB2pu9KPPwYitVF0"
    var playUrl = await spider.play("标清", url2, []);

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
                            url = "65993ab2ab57bf9526384d708274ca4c1aca9a6c+25YBKrkDt42+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiMjVZQktya0R0NDJcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTcwNDYxMzU3NywiaWF0IjoxNzA0NjA2MzE3fQ.m6ChB3hgKdem9cQuadzGA8TI-P2u3y9Fgmi83Jm9WGnRP2JF0lSfhSzJPMiFOxe8-4yzk6NnvGkQn-Uye4Zrt167IgeMdOq-dI5in20Hw_HjyPGkkgCAlIwmQQ4Z9-rCDVfC1ybRYIjzhsNzgsVRLQSyIi85wA5QaTgO8A6gMQI"
                            var playUrl = await spider.play("标清", url, []);
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