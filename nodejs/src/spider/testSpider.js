/*
* @File     : testSpider.js
* @Author   : jade
* @Date     : 2024/3/26 10:42
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import kunyu77 from "./video/kunyu77.js"
class DB{
    constructor() {
    }
    getObjectDefault(){
        return {}
    }
    push(){

    }
}

let spider = kunyu77.spider
let inReq = {"server":{"config":{"yiqikan":{}},"db":new DB()}}
let init = await spider.init(inReq)
let home = JSON.parse(await spider.home())
let homeVod = JSON.parse(await spider.homeVod())
let cateInReq = {"body":{"id":"1","page":"1","filters":{}}}
let category = JSON.parse(await spider.category(cateInReq))
let detailInReq = {"body":{"id":"154378"}}
let detail = JSON.parse(await spider.detail(detailInReq))
let playInReq = {"body":{"flag":"alivc","id":"c0c33ffcaaf971ee88256733a68f0102"}}
let play = JSON.parse(await spider.play(playInReq))
let searchInReq = {"body":{"wd":"小日子","page":"1"}}
let search = JSON.parse(await spider.search(searchInReq))
let x = 0


