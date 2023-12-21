/*
 * @Author: samples jadehh@live.com
 * @Date: 2023-12-14 11:03:04
 * @LastEditors: samples jadehh@live.com
 * @LastEditTime: 2023-12-14 11:03:04
 * @FilePath: js/wogg.js
 * @Description: 玩偶哥哥爬虫类
 */
import {_, load, Uri} from '../lib/cat.js';
import {VodDetail} from "../lib/vod.js"
import {JadeLogging} from "../lib/log.js";
import {detailContent, initAli, playContent} from "../lib/ali.js";

let siteKey = '';
let siteType = 0;
let siteUrl = 'https://tvfan.xxooo.cf';
let UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36";
let patternAli = /(https:\/\/www\.aliyundrive\.com\/s\/[^"]+|https:\/\/www\.alipan\.com\/s\/[^"]+)/
let JadeLog = new JadeLogging(getAppName(), "DEBUG")

let classes = [{'type_id': 1, 'type_name': '电影'}, {'type_id': 2, 'type_name': '电视剧'}, {
    'type_id': 3, 'type_name': '动漫'
}, {'type_id': 4, 'type_name': '综艺'}, {'type_id': 6, 'type_name': '短剧'}, {'type_id': 5, 'type_name': '音乐'}];
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
let CatOpenStatus = false

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    try {
        siteKey = _.isEmpty(cfg.skey) ? '' : cfg.skey;
        siteType = _.isEmpty(cfg.stype) ? '' : cfg.stype;
        let extObj = null;
        if (typeof cfg.ext === "string") {
            await JadeLog.info(`读取配置文件,ext为:${cfg.ext}`)
            extObj = JSON.parse(cfg.ext)
        } else if (typeof cfg.ext === "object") {
            await JadeLog.info(`读取配置文件,ext为:${JSON.parse(cfg.ext)}`)
            extObj = cfg.ext
        } else {
            await JadeLog.error(`不支持的数据类型,数据类型为${typeof cfg.ext}`)
        }
        let boxType = extObj["box"]
        if (boxType === "CatOpen") {
            CatOpenStatus = true
        }
        await initAli(extObj["token"]);
    } catch (e) {
        await JadeLog.error("初始化失败,失败原因为:" + e.message)
    }
}

function getName() {
    return "💂‍┃阿里玩偶┃💂"
}

function getAppName() {
    return "阿里玩偶"
}

function getHeader() {
    let header = {};
    header['User-Agent'] = UA;
    return header;
}

async function request(reqUrl) {
    let header = getHeader()
    let uri = new Uri(reqUrl);
    let res = await req(uri.toString(), {
        headers: header,
        timeout: 100000,
    });
    if (_.isEmpty(res.content)) {
        await JadeLog.error("html内容读取失败,请检查url:" + reqUrl)
    }
    return res.content;
}


function parseVodListFromDoc($) {
    let items = $('.module-item');
    let videos = [];
    for (const item of items) {
        let oneA = $(item).find('.module-item-cover .module-item-pic a').first();
        let href = oneA.attr('href');
        let name = oneA.attr('title');
        let oneImg = $(item).find('.module-item-cover .module-item-pic img').first();
        let pic = oneImg.attr('data-src');
        if (pic.indexOf("img.php?url=") > 0) {
            pic = pic.split("img.php?url=")[1]
        }
        let remark = $(item).find('.module-item-text').first().text();
        videos.push({
            vod_id: href,
            vod_name: name,
            vod_pic: pic,
            vod_remarks: remark,
        });
    }
    return videos

}

async function home(filter) {
    await JadeLog.info("正在解析首页")
    let vod_list = []
    let result_json = {
        class: classes,
        list: vod_list,
        filters: filterObj,

    }
    try {
        let con = await request(siteUrl);
        if (!_.isEmpty(con)) {
            const $ = load(con);
            let elements = $('.nav-link')
            let classes = []
            for (const element of elements) {
                let type_id = parseInt(element.attribs.href.split("/").slice(-1)[0].split(".html")[0])
                let type_name = element.children.slice(-1)[0].data.replace("\n", "").replace(" ", "").replace("玩偶", "")
                let type_dic = {"type_id": type_id, "type_name": type_name}
                classes.push(type_dic)
            }
            result_json.class = classes
            if (!CatOpenStatus) {
                vod_list = parseVodListFromDoc($)
            } else {
                await JadeLog.debug("CatOpen无需解析首页内容")
            }
            result_json.list = vod_list
            await JadeLog.info("首页解析完成,首页信息为:" + JSON.stringify(result_json))
            return JSON.stringify(result_json)
        } else {
            await JadeLog.warning("首页解析完成,首页信息为:" + JSON.stringify(result_json))
            return JSON.stringify(result_json)
        }
    } catch (e) {
        await JadeLog.error("首页解析失败,首页信息为:" + JSON.stringify(result_json) + ",失败原因为:" + e)
        return JSON.stringify(result_json)
    }

}


async function homeVod() {
    return '{}';
}

function get_extend_sort_dic(tid) {
    /***
     tid为1,2,3的时候,电影,剧情,动漫
     urlParams#0表示类别,1表示全部地区,2表示人气评分,3表示全部剧情,4表示全部语言,5表示字母查找,6表示页数,11表示时间
     #key为1,代表全部剧情
     #key为2,代表全部地区
     #key为3,代表全部语言
     #key为4,代表全部时间
     #key为5,字幕查找
     #key为6,时间排序
     https://www.wogg.xyz/index.php/vodshow/1-全部地区-时间排序-全部剧情-全部语言-字幕查找------全部时间.html

     tid为4,综艺
     #key为1,代表全部地区
     #key为2,代表全部时间
     #key为3,字幕查找
     #key为4,时间排序
     https://tvfan.xxooo.cf/index.php/vodshow/4-全部地区-时间排序---字母查找------全部时间.html

     tid为5:音乐
     #key为1,字幕查找
     #key为2,时间排序
     https://tvfan.xxooo.cf/index.php/vodshow/5--时间排序---字幕查找------.html

     tid为6,短剧
     #key为1,代表全部剧情
     #key为2,代表全部地区
     #key为3,代表全部时间
     #key为4,字幕查找
     #key为5,时间排序
     https://tvfan.xxooo.cf/index.php/vodshow/6-全部地区-时间排序-全部剧情--字母查找------全部时间.html
     */
    let extend_dic = {}
    if (tid < 4) {
        extend_dic = {
            "1": 3,
            "2": 1,
            "3": 4,
            "4": 11,
            "5": 5,
            "6": 2
        }
    } else if (tid === 4) {
        extend_dic = {
            "1": 1,
            "2": 11,
            "3": 5,
            "4": 2,
        }
    } else if (tid === 6) {
        extend_dic = {
            "1": 3,
            "2": 1,
            "3": 11,
            "4": 5,
            "5": 2,
        }
    } else if (tid === 5) {
        extend_dic = {
            "1": 5,
            "2": 2,
        }
    }

    return extend_dic
}

async function category(tid, pg, filter, extend) {
    let urlParams = [tid.toString(), "", "", "", "", "", "", "", pg.toString(), "", "", ""]
    let extend_dic = get_extend_sort_dic(parseInt(tid))
    for (const key of Object.keys(extend_dic)) {
        urlParams[extend_dic[key]] = extend[key]
    }
    let reqUrl = siteUrl + '/index.php/vodshow/' + urlParams.join("-") + '.html';
    await JadeLog.info(`正在获取分类界面,请求url为:${reqUrl},tid为:${tid},pg为:${pg},filter为:${filter},extend为:${extend}`)
    let result = "";
    try {
        let con = await request(reqUrl);
        const $ = load(con);
        let videos = parseVodListFromDoc($)
        let patternPageCount = /\$\("\.mac_total"\)\.text\('(\d+)'\)/
        let matches = patternPageCount.exec(con)
        let total = 0;
        const limit = 72;
        let pgCount;
        if (matches.length > 0) {
            total = parseInt(matches[1])
        }
        if (total <= limit) {
            pgCount = 1
        } else {
            pgCount = Math.ceil(total / limit)
        }
        result = JSON.stringify({
            page: parseInt(pg),
            pagecount: pgCount,
            limit: limit,
            total: total,
            list: videos,
        });
        await JadeLog.info(`获取分类界面成功,详情界面结果为:${result}`)
        return result
    } catch (e) {
        await JadeLog.error("获取分类界面失败,失败原因为:" + e)
    }
}

async function detail(id) {
    let detailUrl = siteUrl + id;
    await JadeLog.info(`正在获取详情界面,url为:${detailUrl},id为:${id}`)
    try {
        let con = await request(detailUrl);
        let $ = load(con);
        let vodDetail = new VodDetail()
        vodDetail.vod_name = $('.page-title')[0].children[0].data
        vodDetail.vod_pic = $($(".mobile-play")).find(".lazyload")[0].attribs["data-src"]
        let video_info_aux_list = $($(".video-info-aux")).find(".tag-link")[1].children
        for (const video_info_aux of video_info_aux_list) {
            try {
                vodDetail.type_name = vodDetail.type_name + video_info_aux.children[0].data
            } catch {

            }
        }
        let video_items = $('.video-info-items')
        vodDetail.vod_director = $(video_items[0]).find("a")[0].children[0].data
        let vidoe_info_actor_list = $(video_items[1]).find("a")
        let actor_list = []
        for (const vidoe_info_actor of vidoe_info_actor_list) {
            actor_list.push(vidoe_info_actor.children[0].data)
        }
        vodDetail.vod_actor = actor_list.join(" * ")
        vodDetail.vod_year = $(video_items[2]).find("a")[0].children[0].data
        vodDetail.vod_remarks = `清晰度:${$(video_items[3]).find("div")[0].children[0].data}, 制作人:Jade`
        vodDetail.vod_content = $(video_items[4]).find("p")[0].children[0].data

        vodDetail.vod_content = vodDetail.vod_content.replace("[收起部分]", "").replace("[展开全部]", "")
        const share_url_list = [];
        let items = $('.module-row-info')
        for (const item of items) {
            let aliUrl = $(item).find("p")[0].children[0].data
            let matches = aliUrl.match(patternAli);
            if (!_.isEmpty(matches))
                share_url_list.push(matches[1])
        }
        if (share_url_list.length > 0) {
            let aliVodDetail = await detailContent(share_url_list)
            vodDetail.vod_play_url = aliVodDetail.vod_play_url
            vodDetail.vod_play_from = aliVodDetail.vod_play_from
            let result = JSON.stringify({"list": [vodDetail]});
            await JadeLog.info(`获取详情界面成功,详情界面结果为:${result}`)
            return result
        } else {
            await JadeLog.warning(`获取详情界面失败,失败原因为:没有分享链接`)
            return JSON.stringify({"list": [vodDetail]});
        }

    } catch (e) {
        await JadeLog.error(`获取详情界面失败,失败原因为:${e.message}`)
    }
}

async function play(flag, id, flags) {
    return await playContent(flag, id, flags);
}


async function search(wd, quick) {
    let searchUrl = siteUrl + '/index.php/vodsearch/-------------.html?wd=' + wd;
    await JadeLog.info(`正在获取搜索界面,url为:${searchUrl},名称为:${wd},quick为:${quick}`)
    try {
        let html = await request(searchUrl, UA);
        let $ = load(html);
        let items = $('.module-search-item');
        let videos = [];
        for (const item of items) {
            let vodId = $(item).find(".video-serial")[0].attribs.href;
            let name = $(item).find(".video-serial")[0].attribs.title;
            let pic = $(item).find(".module-item-pic > img")[0].attribs['data-src'];
            let remark = '';
            videos.push({
                vod_id: vodId,
                vod_name: name,
                vod_pic: pic,
                vod_remarks: remark,
            });
        }
        let result = JSON.stringify({
            list: videos,
        });
        await JadeLog.info(`获取搜索界面成功,详情界面结果为:${result}`)
        return result
    } catch (e) {
        await JadeLog.error("获取搜索界面失败,失败原因为:" + e)
    }

}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}

