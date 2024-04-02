/*
* @File     : testSpider.js
* @Author   : jade
* @Date     : 2024/3/26 10:42
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import base_spider from "./video/haiwaikan.js"
import {Config, JsonDB} from "node-json-db";
function getInreq() {
    let prefix = "/spider/video/haiwaikan"
    let db = new JsonDB(new Config((process.env['NODE_PATH'] || '.') + '/db.json', true, true, '/', true));
    class Server {
        constructor() {
            this.config = {"haiwaikan": {}, "alitoken": "6827db23e5474d02a07fd7431d3d5a5a"}
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

let home = JSON.parse(await spider.home())
let homeVod = JSON.parse(await spider.homeVod())

let cateInReq = {"body": {"id": "1", "page": "1", "filters": {}}}
let category = JSON.parse(await spider.category(cateInReq))

let detailInReq = {"body": {"id": "hKPiZRH4QHP7Tx+1"}}
let detail = JSON.parse(await spider.detail(detailInReq))




let playInReq = {
    "body": {
        "flag": "hd",
        "id": "https://www.douyin.com/lvdetail/6915956278669869581"
    }
}
let play = JSON.parse(await spider.play(playInReq))


let searchInReq = {"body": {"wd": "江河日上", "page": "1"}}
let search = JSON.parse(await spider.search(searchInReq))

let x = 0


