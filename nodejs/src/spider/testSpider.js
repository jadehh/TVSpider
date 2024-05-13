/*
* @File     : testSpider.js
* @Author   : jade
* @Date     : 2024/3/26 10:42
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import base_spider from "./pan/alist.js"
import {Config, JsonDB} from "node-json-db";
function getInreq() {
    let prefix = "/spider/pan/alist"
    let db = new JsonDB(new Config((process.env['NODE_PATH'] || '.') + '/db.json', true, true, '/', true));
    class Server {
        constructor() {
            this.config = {"alist": [{"name":"🐉神族九帝","server":"https://alist.shenzjd.com"},{"name":"💢repl","server":"https://ali.liucn.repl.co"}]}
            this.db = db
            this.prefix = prefix
        }

        address() {
            return {"dynamic": "127.0.0.1"}
        }
    }
    return {"server": new Server(),"body": {"path":"/🐉神族九帝/夸克网盘/音乐/陈奕迅[音乐合集]/mp3-320k/2011-Stranger Under My Skin 2CD/CD2/","page":"1"}}
}
let spider = base_spider.spider
let inReq = getInreq()
let init = await spider.init(inReq)
let dir = await spider.dir(inReq)

let fileReq = {"body": {"path":"/🐉神族九帝/夸克网盘/音乐/陈奕迅[音乐合集]/mp3-320k/2011-Stranger Under My Skin 2CD/CD2/陳奕迅 - 等你愛我 .mp3","page":"1"}}
let file = await spider.file(fileReq)

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


