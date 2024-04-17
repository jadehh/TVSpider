/*
* @File     : testSpider.js
* @Author   : jade
* @Date     : 2024/3/26 10:42
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import base_spider from "./video/kunyu77.js"
import {Config, JsonDB} from "node-json-db";
function getInreq() {
    let prefix = "/spider/video/kunyu77"
    let db = new JsonDB(new Config((process.env['NODE_PATH'] || '.') + '/db.json', true, true, '/', true));
    class Server {
        constructor() {
            this.config = {"kunyu77": {},   "bilicookie": "buvid3=02675249-8ED3-C418-87F5-59E18316459714816infoc; b_nut=1704421014; _uuid=5D435F74-F574-D9AB-62C1-B9294DE465D913102infoc; buvid_fp=e8c5650c749398e9b5cad3f3ddb5081e; buvid4=007E85D1-52C1-7E6E-07CF-837FFBC9349516677-024010502-J5vTDSZDCw4fNnXRejbSVg%3D%3D; rpdid=|()kYJmulRu0J'u~|RRJl)JR; PVID=1; SESSDATA=3be091d3%2C1720332009%2C699ed%2A11CjAcCdwXG5kY1umhCOpQHOn_WP7L9xFBfWO7KKd4BPweodpR6VyIfeNyPiRmkr5jCqsSVjg0R0dZOVVHRUo3RnhPRTZFc3JPbGdiUjFCdHpiRDhiTkticmdKTjVyS1VhbDdvNjFMSDJlbUJydUlRdjFUNGFBNkJlV2ZTa0N1Q1BEVi1QYTQzTUh3IIEC; bili_jct=b0ee7b5d3f27df893545d811d95506d4; DedeUserID=78014638; DedeUserID__ckMd5=4c8c5d65065e468a; enable_web_push=DISABLE; header_theme_version=CLOSE; home_feed_column=5; CURRENT_BLACKGAP=0; CURRENT_FNVAL=4048; b_lsid=75E916AA_18EA1A8D995; bsource=search_baidu; FEED_LIVE_VERSION=V_HEADER_LIVE_NO_POP; browser_resolution=1507-691; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTIzNjk5MTMsImlhdCI6MTcxMjExMDY1MywicGx0IjotMX0.8zQW_fNTCSBlK_JkHnzu3gDw62wuTK1qgKcbGec3swM; bili_ticket_expires=171236985"}
            this.db = db
            this.prefix = prefix
        }

        address() {
            return {"dynamic": "127.0.0.1"}
        }
    }
    return {"server": new Server()}
}
let spider = base_spider.spider
let inReq = getInreq()
let init = await spider.init(inReq)


let searchInReq = {"body": {"wd": "wang", "page": 2}}
let search = JSON.parse(await spider.search(searchInReq))

let home = JSON.parse(await spider.home())
let homeVod = JSON.parse(await spider.homeVod())

// let proxyInReq = {"params":
//         {
//             "what": "img",
//             "end":"aHR0cHM6Ly9hc3NldHMtY2RuLmphYmxlLnR2L2NvbnRlbnRzL3ZpZGVvc19zY3JlZW5zaG90cy80MDAwMC80MDc3My9wcmV2aWV3LmpwZw==",
//             "ids":"{\"User-Agent\":\"PostmanRuntime/7.36.3\",\"Host\":\"jable.tv\"}"},
//         }
// let proxy = await spider.proxy(proxyInReq,null)

let detailInReq = {"body": {"id": "https://hongkongdollvideo.com/video/ea68b0d424defdef.html"}}
let detail = JSON.parse(await spider.detail(detailInReq))

let cateInReq = {"body": {"id": "1", "page": "1", "filters": {}}}
let category = JSON.parse(await spider.category(cateInReq))



let playInReq = {
    "body": {
        "flag": "hd",
        "id": "https://www.douyin.com/lvdetail/6915956278669869581"
    }
}
let play = JSON.parse(await spider.play(playInReq))




let x = 0


