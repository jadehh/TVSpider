/*
* @File     : spider_object.js
* @Author   : jade
* @Date     : 2023/12/20 10:35
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/

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
    getHomeSpiderClasses(){
        return this.homeSpiderClass
    }
    getHomeSpiderList(){
        return this.homeSpiderList
    }
    getHomeSpiderFilters(){
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
export {HomeSpiderResult}