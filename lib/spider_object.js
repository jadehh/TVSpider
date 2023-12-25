/*
* @File     : spider_object.js
* @Author   : jade
* @Date     : 2023/12/20 10:35
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {JadeLogging} from "./log.js";

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
        return {"token":null,"CatOpenStatus":false}
    }

}

class HomeSpiderResult {
    constructor() {
        this.homeSpiderClass = []
        this.homeSpiderList = []
        this.homeSpiderfilters = {}
    }

    setHomeSpiderResult(classes, vod_list = null, filters = null) {
        this.homeSpiderClass = classes
        if (vod_list !== null) {
            this.homeSpiderList = vod_list
        }
        if (filters != null) {
            this.homeSpiderfilters = filters
        }
        return this
    }

    getHomeSpiderClasses() {
        return this.homeSpiderClass
    }

    getHomeSpiderList() {
        return this.homeSpiderList
    }

    getHomeSpiderFilters() {
        return this.homeSpiderfilters
    }

    toString() {
        const params = {
            class: this.getHomeSpiderClasses(),
            list: this.getHomeSpiderList(),
            filters: this.getHomeSpiderFilters(),
        };
        return JSON.stringify(params);
    }
}

export {HomeSpiderResult, SpiderInit}