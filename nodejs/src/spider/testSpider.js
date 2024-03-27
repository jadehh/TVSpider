/*
* @File     : testSpider.js
* @Author   : jade
* @Date     : 2024/3/26 10:42
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import base_spider from "./video/jianpian.js"

class DB {
    constructor() {
    }

    async getObjectDefault() {
        return {}
    }

    push() {

    }
}


let spider = base_spider.spider
let inReq = {"server":
        {
            "config": {"yiqikan": {}, "alitoken": "6827db23e5474d02a07fd7431d3d5a5a"},
            "db": new DB(),
            "prefix":"12"
        }}
let init = await spider.init(inReq)

let home = JSON.parse(await spider.home())
let homeVod = JSON.parse(await spider.homeVod())
let cateInReq = {"body": {"id": "2", "page": "1", "filters": {}}}
let category = JSON.parse(await spider.category(cateInReq))
let detailInReq = {"body": {"id": "154378"}}
let detail = JSON.parse(await spider.detail(detailInReq))

let playInReq = {
    "body": {
        "flag": "原画",
        "id": "6602a6b10b01351f145949debbbe89971b2cc9ea+97hoD7JJh9P+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiOTdob0Q3SkpoOVBcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTcxMTUyNzQwMywiaWF0IjoxNzExNTIwMTQzfQ.r2k_K3cxA6AFBP3B7qPWOhXkz3l27S0pmNpdMVeDYHoZSXtdf0EC1jkbILanqTs-Oo8A00Pa49oI9jN6f6G5CVRw3B01fHIM2PrZqXA4sY_a3tPhVYZQkV_2jlYstQT9K-dsUyM116GbI347gdq0aVSuegKO6W_Dkvz91T15wcM"
    }
}
let play = JSON.parse(await spider.play(playInReq))


let searchInReq = {"body": {"wd": "江河日上", "page": "1"}}
let search = JSON.parse(await spider.search(searchInReq))

let x = 0


