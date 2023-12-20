/*
* @File     : nivid_object.js
* @Author   : jade
* @Date     : 2023/12/20 9:50
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {Crypto} from "./cat.js";
import {HomeSpiderResult} from "./spider_object.js";

let DesKey = "diao.com"

class ChannelResponse {
    // classes
    constructor() {
        this.channelMsg = ""
        this.channelStatus = 0
        this.channelList = []
        this.channelFilters = {}
    }

    fromJsonString(json_str, remove18ChannelCode = 0) {
        let json_dic = JSON.parse(json_str)
        this.channelMsg = json_dic.msg
        this.channelStatus = json_dic.status
        let channel_list = []
        for (const channel_info of json_dic.list) {
            let new_channel_info = new ChannelInfo()
            switch (remove18ChannelCode) {
                case 0:
                    new_channel_info.fromJson(channel_info)
                    channel_list.push(new_channel_info)
                    break
                case 1:
                    if (channel_info.channelName !== "午夜场" && channel_info.channelName !== "午夜直播") {
                        new_channel_info.fromJson(channel_info)
                        channel_list.push(new_channel_info)
                    }
                    break
                case 2:
                    if (channel_info.channelName === "午夜场" || channel_info.channelName === "午夜直播") {
                        new_channel_info.fromJson(channel_info)
                        channel_list.push(new_channel_info)
                    }
                    break
            }
        }
        this.channelList = channel_list
        this.channelFilters = json_dic.filter
    }

    setChannelFilters(filter_str) {
        this.channelFilters = JSON.parse(filter_str)
    }

    getFilters() {
        let filters = {}
        for (const channel_info of this.channelList) {
            filters[channel_info.channelId] = []
            let sortMapList = this.channelFilters["sortsMap"][parseInt(channel_info.channelId)]
            let values = []
            for (const sortMap of sortMapList) {
                values.push({"n": sortMap["title"], "v": sortMap["id"]})
            }
            filters[channel_info.channelId].push({"key": "1","name": "排序", "value": values})
        }
        let filterObj = {
    "1": [{
        "key": "1",
        "name": "全部剧情",
        "value": [{"n": "喜剧", "v": "喜剧"}, {"n": "爱情", "v": "爱情"}, {"n": "恐怖", "v": "恐怖"}, {
            "n": "动作",
            "v": "动作"
        }, {"n": "科幻", "v": "科幻"}, {"n": "剧情", "v": "剧情"}, {"n": "战争", "v": "战争"}, {
            "n": "警匪",
            "v": "警匪"
        }, {"n": "犯罪", "v": "犯罪"}, {"n": "古装", "v": "古装"}, {"n": "奇幻", "v": "奇幻"}, {
            "n": "武侠",
            "v": "武侠"
        }, {"n": "冒险", "v": "冒险"}, {"n": "枪战", "v": "枪战"}, {"n": "恐怖", "v": "恐怖"}, {
            "n": "悬疑",
            "v": "悬疑"
        }, {"n": "惊悚", "v": "惊悚"}, {"n": "经典", "v": "经典"}, {"n": "青春", "v": "青春"}, {
            "n": "文艺",
            "v": "文艺"
        }, {"n": "微电影", "v": "微电影"}, {"n": "历史", "v": "历史"}]
    }, {
        "key": "2",
        "name": "全部地区",
        "value": [{"n": "大陆", "v": "大陆"}, {"n": "香港", "v": "香港"}, {"n": "台湾", "v": "台湾"}, {
            "n": "美国",
            "v": "美国"
        }, {"n": "法国", "v": "法国"}, {"n": "英国", "v": "英国"}, {"n": "日本", "v": "日本"}, {
            "n": "韩国",
            "v": "韩国"
        }, {"n": "德国", "v": "德国"}, {"n": "泰国", "v": "泰国"}, {"n": "印度", "v": "印度"}, {
            "n": "意大利",
            "v": "意大利"
        }, {"n": "西班牙", "v": "西班牙"}, {"n": "加拿大", "v": "加拿大"}, {"n": "其他", "v": "其他"}]
    }, {
        "key": "3",
        "name": "全部语言",
        "value": [{"n": "国语", "v": "国语"}, {"n": "英语", "v": "英语"}, {"n": "粤语", "v": "粤语"}, {
            "n": "闽南语",
            "v": "闽南语"
        }, {"n": "韩语", "v": "韩语"}, {"n": "日语", "v": "日语"}, {"n": "法语", "v": "法语"}, {
            "n": "德语",
            "v": "德语"
        }, {"n": "其它", "v": "其它"}]
    }, {
        "key": "4",
        "name": "全部时间",
        "value": [{"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {"n": "2021", "v": "2021"}, {
            "n": "2020",
            "v": "2020"
        }, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {"n": "2017", "v": "2017"}, {
            "n": "2016",
            "v": "2016"
        }, {"n": "2015", "v": "2015"}, {"n": "2014", "v": "2014"}, {"n": "2013", "v": "2013"}, {
            "n": "2012",
            "v": "2012"
        }, {"n": "2011", "v": "2011"}, {"n": "2010", "v": "2010"}]
    }, {
        "key": "5",
        "name": "字母查找",
        "value": [{"n": "A", "v": "A"}, {"n": "B", "v": "B"}, {"n": "C", "v": "C"}, {"n": "D", "v": "D"}, {
            "n": "E",
            "v": "E"
        }, {"n": "F", "v": "F"}, {"n": "G", "v": "G"}, {"n": "H", "v": "H"}, {"n": "I", "v": "I"}, {
            "n": "J",
            "v": "J"
        }, {"n": "K", "v": "K"}, {"n": "L", "v": "L"}, {"n": "M", "v": "M"}, {"n": "N", "v": "N"}, {
            "n": "O",
            "v": "O"
        }, {"n": "P", "v": "P"}, {"n": "Q", "v": "Q"}, {"n": "R", "v": "R"}, {"n": "S", "v": "S"}, {
            "n": "T",
            "v": "T"
        }, {"n": "U", "v": "U"}, {"n": "V", "v": "V"}, {"n": "W", "v": "W"}, {"n": "X", "v": "X"}, {
            "n": "Y",
            "v": "Y"
        }, {"n": "Z", "v": "Z"}, {"n": "0-9", "v": "0-9"}]
    }, {"key": "6", "name": "时间排序", "value": [{"n": "人气排序", "v": "hits"}, {"n": "评分排序", "v": "score"}]}],
    "2": [{
        "key": "1",
        "name": "全部剧情",
        "value": [{"n": "喜剧", "v": "喜剧"}, {"n": "爱情", "v": "爱情"}, {"n": "恐怖", "v": "恐怖"}, {
            "n": "动作",
            "v": "动作"
        }, {"n": "科幻", "v": "科幻"}, {"n": "剧情", "v": "剧情"}, {"n": "战争", "v": "战争"}, {
            "n": "警匪",
            "v": "警匪"
        }, {"n": "犯罪", "v": "犯罪"}, {"n": "古装", "v": "古装"}, {"n": "奇幻", "v": "奇幻"}, {
            "n": "武侠",
            "v": "武侠"
        }, {"n": "冒险", "v": "冒险"}, {"n": "枪战", "v": "枪战"}, {"n": "恐怖", "v": "恐怖"}, {
            "n": "悬疑",
            "v": "悬疑"
        }, {"n": "惊悚", "v": "惊悚"}, {"n": "经典", "v": "经典"}, {"n": "青春", "v": "青春"}, {
            "n": "文艺",
            "v": "文艺"
        }, {"n": "微电影", "v": "微电影"}, {"n": "历史", "v": "历史"}]
    }, {
        "key": "2",
        "name": "全部地区",
        "value": [{"n": "大陆", "v": "大陆"}, {"n": "香港", "v": "香港"}, {"n": "台湾", "v": "台湾"}, {
            "n": "美国",
            "v": "美国"
        }, {"n": "法国", "v": "法国"}, {"n": "英国", "v": "英国"}, {"n": "日本", "v": "日本"}, {
            "n": "韩国",
            "v": "韩国"
        }, {"n": "德国", "v": "德国"}, {"n": "泰国", "v": "泰国"}, {"n": "印度", "v": "印度"}, {
            "n": "意大利",
            "v": "意大利"
        }, {"n": "西班牙", "v": "西班牙"}, {"n": "加拿大", "v": "加拿大"}, {"n": "其他", "v": "其他"}]
    }, {
        "key": "3",
        "name": "全部语言",
        "value": [{"n": "国语", "v": "国语"}, {"n": "英语", "v": "英语"}, {"n": "粤语", "v": "粤语"}, {
            "n": "闽南语",
            "v": "闽南语"
        }, {"n": "韩语", "v": "韩语"}, {"n": "日语", "v": "日语"}, {"n": "法语", "v": "法语"}, {
            "n": "德语",
            "v": "德语"
        }, {"n": "其它", "v": "其它"}]
    }, {
        "key": "4",
        "name": "全部时间",
        "value": [{"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {"n": "2021", "v": "2021"}, {
            "n": "2020",
            "v": "2020"
        }, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {"n": "2017", "v": "2017"}, {
            "n": "2016",
            "v": "2016"
        }, {"n": "2015", "v": "2015"}, {"n": "2014", "v": "2014"}, {"n": "2013", "v": "2013"}, {
            "n": "2012",
            "v": "2012"
        }, {"n": "2011", "v": "2011"}, {"n": "2010", "v": "2010"}]
    }, {
        "key": "5",
        "name": "字母查找",
        "value": [{"n": "A", "v": "A"}, {"n": "B", "v": "B"}, {"n": "C", "v": "C"}, {"n": "D", "v": "D"}, {
            "n": "E",
            "v": "E"
        }, {"n": "F", "v": "F"}, {"n": "G", "v": "G"}, {"n": "H", "v": "H"}, {"n": "I", "v": "I"}, {
            "n": "J",
            "v": "J"
        }, {"n": "K", "v": "K"}, {"n": "L", "v": "L"}, {"n": "M", "v": "M"}, {"n": "N", "v": "N"}, {
            "n": "O",
            "v": "O"
        }, {"n": "P", "v": "P"}, {"n": "Q", "v": "Q"}, {"n": "R", "v": "R"}, {"n": "S", "v": "S"}, {
            "n": "T",
            "v": "T"
        }, {"n": "U", "v": "U"}, {"n": "V", "v": "V"}, {"n": "W", "v": "W"}, {"n": "X", "v": "X"}, {
            "n": "Y",
            "v": "Y"
        }, {"n": "Z", "v": "Z"}, {"n": "0-9", "v": "0-9"}]
    }, {"key": "6", "name": "时间排序", "value": [{"n": "人气排序", "v": "hits"}, {"n": "评分排序", "v": "score"}]}],
    "3": [{
        "key": "1",
        "name": "全部剧情",
        "value": [{"n": "情感", "v": "情感"}, {"n": "科幻", "v": "科幻"}, {"n": "热血", "v": "热血"}, {
            "n": "推理",
            "v": "推理"
        }, {"n": "搞笑", "v": "搞笑"}, {"n": "冒险", "v": "冒险"}, {"n": "萝莉", "v": "萝莉"}, {
            "n": "校园",
            "v": "校园"
        }, {"n": "动作", "v": "动作"}, {"n": "机战", "v": "机战"}, {"n": "运动", "v": "运动"}, {
            "n": "战争",
            "v": "战争"
        }, {"n": "少年", "v": "少年"}, {"n": "少女", "v": "少女"}, {"n": "社会", "v": "社会"}, {
            "n": "原创",
            "v": "原创"
        }, {"n": "亲子", "v": "亲子"}, {"n": "益智", "v": "益智"}, {"n": "励志", "v": "励志"}, {
            "n": "其他",
            "v": "其他"
        }]
    }, {
        "key": "2",
        "name": "全部地区",
        "value": [{"n": "大陆", "v": "大陆"}, {"n": "香港", "v": "香港"}, {"n": "台湾", "v": "台湾"}, {
            "n": "美国",
            "v": "美国"
        }, {"n": "法国", "v": "法国"}, {"n": "英国", "v": "英国"}, {"n": "日本", "v": "日本"}, {
            "n": "韩国",
            "v": "韩国"
        }, {"n": "德国", "v": "德国"}, {"n": "泰国", "v": "泰国"}, {"n": "印度", "v": "印度"}, {
            "n": "意大利",
            "v": "意大利"
        }, {"n": "西班牙", "v": "西班牙"}, {"n": "加拿大", "v": "加拿大"}, {"n": "其他", "v": "其他"}]
    }, {
        "key": "3",
        "name": "全部语言",
        "value": [{"n": "国语", "v": "国语"}, {"n": "英语", "v": "英语"}, {"n": "粤语", "v": "粤语"}, {
            "n": "闽南语",
            "v": "闽南语"
        }, {"n": "韩语", "v": "韩语"}, {"n": "日语", "v": "日语"}, {"n": "法语", "v": "法语"}, {
            "n": "德语",
            "v": "德语"
        }, {"n": "其它", "v": "其它"}]
    }, {
        "key": "4",
        "name": "全部时间",
        "value": [{"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {"n": "2021", "v": "2021"}, {
            "n": "2020",
            "v": "2020"
        }, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {"n": "2017", "v": "2017"}, {
            "n": "2016",
            "v": "2016"
        }, {"n": "2015", "v": "2015"}, {"n": "2014", "v": "2014"}, {"n": "2013", "v": "2013"}, {
            "n": "2012",
            "v": "2012"
        }, {"n": "2011", "v": "2011"}, {"n": "2010", "v": "2010"}]
    }, {
        "key": "5",
        "name": "字母查找",
        "value": [{"n": "A", "v": "A"}, {"n": "B", "v": "B"}, {"n": "C", "v": "C"}, {"n": "D", "v": "D"}, {
            "n": "E",
            "v": "E"
        }, {"n": "F", "v": "F"}, {"n": "G", "v": "G"}, {"n": "H", "v": "H"}, {"n": "I", "v": "I"}, {
            "n": "J",
            "v": "J"
        }, {"n": "K", "v": "K"}, {"n": "L", "v": "L"}, {"n": "M", "v": "M"}, {"n": "N", "v": "N"}, {
            "n": "O",
            "v": "O"
        }, {"n": "P", "v": "P"}, {"n": "Q", "v": "Q"}, {"n": "R", "v": "R"}, {"n": "S", "v": "S"}, {
            "n": "T",
            "v": "T"
        }, {"n": "U", "v": "U"}, {"n": "V", "v": "V"}, {"n": "W", "v": "W"}, {"n": "X", "v": "X"}, {
            "n": "Y",
            "v": "Y"
        }, {"n": "Z", "v": "Z"}, {"n": "0-9", "v": "0-9"}]
    }, {"key": "6", "name": "时间排序", "value": [{"n": "人气排序", "v": "hits"}, {"n": "评分排序", "v": "score"}]}],
    "4": [{
        "key": "1",
        "name": "全部地区",
        "value": [{"n": "大陆", "v": "大陆"}, {"n": "香港", "v": "香港"}, {"n": "台湾", "v": "台湾"}, {
            "n": "美国",
            "v": "美国"
        }, {"n": "法国", "v": "法国"}, {"n": "英国", "v": "英国"}, {"n": "日本", "v": "日本"}, {
            "n": "韩国",
            "v": "韩国"
        }]
    }, {
        "key": "2",
        "name": "全部时间",
        "value": [{"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {"n": "2021", "v": "2021"}, {
            "n": "2020",
            "v": "2020"
        }, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {"n": "2017", "v": "2017"}, {
            "n": "2016",
            "v": "2016"
        }, {"n": "2015", "v": "2015"}, {"n": "2014", "v": "2014"}, {"n": "2013", "v": "2013"}, {
            "n": "2012",
            "v": "2012"
        }, {"n": "2011", "v": "2011"}, {"n": "2010", "v": "2010"}]
    }, {
        "key": "3",
        "name": "字母查找",
        "value": [{"n": "A", "v": "A"}, {"n": "B", "v": "B"}, {"n": "C", "v": "C"}, {"n": "D", "v": "D"}, {
            "n": "E",
            "v": "E"
        }, {"n": "F", "v": "F"}, {"n": "G", "v": "G"}, {"n": "H", "v": "H"}, {"n": "I", "v": "I"}, {
            "n": "J",
            "v": "J"
        }, {"n": "K", "v": "K"}, {"n": "L", "v": "L"}, {"n": "M", "v": "M"}, {"n": "N", "v": "N"}, {
            "n": "O",
            "v": "O"
        }, {"n": "P", "v": "P"}, {"n": "Q", "v": "Q"}, {"n": "R", "v": "R"}, {"n": "S", "v": "S"}, {
            "n": "T",
            "v": "T"
        }, {"n": "U", "v": "U"}, {"n": "V", "v": "V"}, {"n": "W", "v": "W"}, {"n": "X", "v": "X"}, {
            "n": "Y",
            "v": "Y"
        }, {"n": "Z", "v": "Z"}, {"n": "0-9", "v": "0-9"}]
    }, {"key": "4", "name": "时间排序", "value": [{"n": "人气排序", "v": "hits"}, {"n": "评分排序", "v": "score"}]}],
    "5": [{
        "key": "1",
        "name": "字母查找",
        "value": [{"n": "A", "v": "A"}, {"n": "B", "v": "B"}, {"n": "C", "v": "C"}, {"n": "D", "v": "D"}, {
            "n": "E",
            "v": "E"
        }, {"n": "F", "v": "F"}, {"n": "G", "v": "G"}, {"n": "H", "v": "H"}, {"n": "I", "v": "I"}, {
            "n": "J",
            "v": "J"
        }, {"n": "K", "v": "K"}, {"n": "L", "v": "L"}, {"n": "M", "v": "M"}, {"n": "N", "v": "N"}, {
            "n": "O",
            "v": "O"
        }, {"n": "P", "v": "P"}, {"n": "Q", "v": "Q"}, {"n": "R", "v": "R"}, {"n": "S", "v": "S"}, {
            "n": "T",
            "v": "T"
        }, {"n": "U", "v": "U"}, {"n": "V", "v": "V"}, {"n": "W", "v": "W"}, {"n": "X", "v": "X"}, {
            "n": "Y",
            "v": "Y"
        }, {"n": "Z", "v": "Z"}, {"n": "0-9", "v": "0-9"}]
    }, {"key": "2", "name": "时间排序", "value": [{"n": "人气排序", "v": "hits"}, {"n": "评分排序", "v": "score"}]}],
    "6": [{
        "key": "1",
        "name": "全部剧情",
        "value": [{"n": "古装", "v": "古装"}, {"n": "战争", "v": "战争"}, {
            "n": "青春偶像",
            "v": "青春偶像"
        }, {"n": "喜剧", "v": "喜剧"}, {"n": "家庭", "v": "家庭"}, {"n": "犯罪", "v": "犯罪"}, {
            "n": "动作",
            "v": "动作"
        }, {"n": "奇幻", "v": "奇幻"}, {"n": "剧情", "v": "剧情"}, {"n": "历史", "v": "历史"}, {
            "n": "经典",
            "v": "经典"
        }, {"n": "乡村", "v": "乡村"}, {"n": "情景", "v": "情景"}, {"n": "商战", "v": "商战"}, {
            "n": "网剧",
            "v": "网剧"
        }, {"n": "其他", "v": "其他"}]
    }, {"key": "2", "name": "全部地区", "value": [{"n": "内地", "v": "内地"}]}, {
        "key": "3",
        "name": "全部时间",
        "value": [{"n": "2023", "v": "2023"}, {"n": "2022", "v": "2022"}, {"n": "2021", "v": "2021"}, {
            "n": "2020",
            "v": "2020"
        }, {"n": "2019", "v": "2019"}, {"n": "2018", "v": "2018"}, {"n": "2017", "v": "2017"}, {
            "n": "2016",
            "v": "2016"
        }, {"n": "2015", "v": "2015"}, {"n": "2014", "v": "2014"}, {"n": "2013", "v": "2013"}, {
            "n": "2012",
            "v": "2012"
        }, {"n": "2011", "v": "2011"}, {"n": "2010", "v": "2010"}]
    }, {
        "key": "4",
        "name": "字母查找",
        "value": [{"n": "A", "v": "A"}, {"n": "B", "v": "B"}, {"n": "C", "v": "C"}, {"n": "D", "v": "D"}, {
            "n": "E",
            "v": "E"
        }, {"n": "F", "v": "F"}, {"n": "G", "v": "G"}, {"n": "H", "v": "H"}, {"n": "I", "v": "I"}, {
            "n": "J",
            "v": "J"
        }, {"n": "K", "v": "K"}, {"n": "L", "v": "L"}, {"n": "M", "v": "M"}, {"n": "N", "v": "N"}, {
            "n": "O",
            "v": "O"
        }, {"n": "P", "v": "P"}, {"n": "Q", "v": "Q"}, {"n": "R", "v": "R"}, {"n": "S", "v": "S"}, {
            "n": "T",
            "v": "T"
        }, {"n": "U", "v": "U"}, {"n": "V", "v": "V"}, {"n": "W", "v": "W"}, {"n": "X", "v": "X"}, {
            "n": "Y",
            "v": "Y"
        }, {"n": "Z", "v": "Z"}, {"n": "0-9", "v": "0-9"}]
    }, {"key": "5", "name": "时间排序", "value": [{"n": "人气排序", "v": "hits"}, {"n": "评分排序", "v": "score"}]}]
};

        return filterObj
    }

    getChannelFilters(){
        return this.channelFilters
    }
    toSpilder() {
        let homeSpiderResult = new HomeSpiderResult()
        return homeSpiderResult.setHomeSpiderResult(this.getClassList(), null, this.getFilters()).toString()
    }

    getChannelMsg() {
        return this.channelMsg
    }

    getChannelStatus() {
        return this.channelStatus
    }

    getChannelList() {
        return this.channelList
    }

    getClassList() {
        let classes = []
        for (const channel_info of this.channelList) {
            classes.push({"type_id": channel_info.channelId, "type_name": channel_info.channelName})
        }
        return classes
    }




    async save() {
        await local.set("niba", "niba_channel", this.toString());
        return this;
    }

    clear() {
        this.channelMsg = ""
        this.channelStatus = 0
        this.channelList = []
    }

    async clearCache() {
        await local.set("niba", "niba_channel", "{}");
    }

    toString() {
        const params = {
            msg: this.getChannelMsg(),
            status: this.getChannelStatus(),
            list: this.getChannelList(),
            filter:this.getChannelFilters()
        };
        return JSON.stringify(params);
    }
}

async function getChannelCache() {
    return await local.get("niba", "niba_channel");
}

class ChannelInfo {
    constructor() {
        this.channelId = 0
        this.channelName = ""
    }

    fromJsonString(json_str) {
        let json_dic = JSON.parse(json_str)
        this.channelId = json_dic.channelId
        this.channelName = json_dic.channelName
    }

    fromJson(json) {
        this.channelId = json.channelId
        this.channelName = json.channelName
    }

    getChannelName() {
        return this.channelName
    }

    getChannelId() {
        return this.channelId
    }
}


function getHeader() {
    return {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        "Referer": "https://m.nivod.tv/",
        "Content-Type": "application/x-www-form-urlencoded"
    }
}


//加密
async function createSign() {
    let params = {
        "_ts": "1702973305512", "app_version": "1.0",
        "platform": "3", "market_id": "web_nivod",
        "device_code": "web", "versioncode": 1,
        "oid": "8ca275aa5e12ba504b266d4c70d95d77a0c2eac5726198ea"
    }
    /**
     * __QUERY::_ts=1702973558399&app_version=1.0&device_code=web&market_id=web_nivod&oid=8ca275aa5e12ba504b266d4c70d95d77a0c2eac5726198ea&platform=3&versioncode=1&__BODY::__KEY::2x_Give_it_a_shot
     */
    let params_list = []
    for (const key of Object.keys(params).sort()) {
        params_list.push(`${key}=${params[key]}`)
    }
    let params_str = "__QUERY::" + params_list.join("&") + "&__BODY::__KEY::2x_Give_it_a_shot"
    let sign_code = md5X(params_str)
    params_list.push(`sign=${sign_code}`)
    return "?" + params_list.join("&")

}

//解密
function desDecrypt(content) {
    // 定义密钥
    const key = Crypto.enc.Utf8.parse(DesKey); // 密钥需要进行字节数转换
    /*
    const encrypted = Crypto.DES.encrypt(content, key, {
        mode: Crypto.mode.ECB, // 使用ECB模式
        padding: Crypto.pad.Pkcs7, // 使用Pkcs7填充
    }).ciphertext.toString();
     */
    return Crypto.DES.decrypt({ciphertext: Crypto.enc.Hex.parse(content)}, key, {
        mode: Crypto.mode.ECB,
        padding: Crypto.pad.Pkcs7,
    }).toString(Crypto.enc.Utf8);
}

export {getChannelCache, desDecrypt, createSign, ChannelResponse, getHeader};