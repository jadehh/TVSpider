/*
* @File     : spider_object.js
* @Author   : jade
* @Date     : 2023/12/20 10:35
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {JadeLogging} from "./log.js";
import {_} from "./cat.js";

let JadeLog = new JadeLogging("Spider", "INFO")

async function SpiderInit(cfg) {
    try {
        let extObj = null;
        if (typeof cfg.ext === "string") {
            await JadeLog.info(`读取配置文件,ext为:${cfg.ext}`)
            extObj = JSON.parse(cfg.ext)
        } else if (typeof cfg.ext === "object") {
            await JadeLog.info(`读取配置文件,ext为:${JSON.stringify(cfg.ext)}`)
            extObj = cfg.ext
        } else {
            await JadeLog.error(`不支持的数据类型,数据类型为${typeof cfg.ext}`)
        }
        let boxType = extObj["box"]
        extObj["CatOpenStatus"] = boxType === "CatOpen";
        return extObj
    } catch (e) {
        await JadeLog.error("初始化失败,失败原因为:" + e.message)
        return {"token":null,"CatOpenStatus":false,"code":0}
    }

}

class Result {
    constructor() {
        this.class = []
        this.list = []
        this.filters = []
        this.header = "";
        this.format = "";
        this.danmaku = "";
        this.url = "";
        this.subs = [];
        this.parse = 0
        this.jx = 0;
        this.page = 0
        this.pagecount = 0
        this.limit = 0;
        this.total = 0;
    }

    home(classes,list,filters){
        return this.setClass(classes).setVod(list).setFilters(filters).toString();
    }

    homeVod(vod_list){
        return this.setVod(vod_list).toString()
    }
    category(vod_list,page,count,limit,total){
         return this.setVod(vod_list).setPage(page,count,limit,total).toString()
    }


     setClass(classes) {
        this.class = classes;
        return this;
    }
     setVod(list) {
        if (typeof list === "object" && Array.isArray(list)){
                 this.list = list;
        }else if (list !== undefined){
            this.list = [list]
        }
        return this;
    }

    setFilters( filters) {
        this.filters = filters;
        return this;
    }
    header( header) {
        this.header = header;
        return this;
    }

    parse( parse) {
        this.parse = parse;
        return this;
    }

    jx() {
        this.jx = 1;
        return this;
    }

     url( url) {
        this.url = url;
        return this;
    }

     danmaku( danmaku) {
        this.danmaku = danmaku;
        return this;
    }

     format( format) {
        this.format = format;
        return this;
    }

    subs( subs) {
        this.subs = subs;
        return this;
    }

   dash() {
        this.format = "application/dash+xml";
        return this;
    }

    m3u8() {
        this.format = "application/x-mpegURL";
        return this;
    }

    rtsp() {
        this.format = "application/x-rtsp";
        return this;
    }

    octet() {
        this.format = "application/octet-stream";
        return this;
    }


    setPage(page, count, limit, total){
        this.page = page
        this.limit = limit
        this.total = total
        this.pagecount = count
        return this;
    }
    toString(){
    return JSON.stringify(this);
    }
}

export {Result, SpiderInit}