/*
* @File     : changzhang.js
* @Author   : jade
* @Date     : 2024/2/2 16:02
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
/**
 * #coding=utf-8
 * #!/usr/bin/python
 * import sys
 * sys.path.append('..')
 * from base.spider import Spider
 * import json
 * import base64
 * from Crypto.Cipher import AES
 *
 * class Spider(Spider):  # 元类 默认的元类 type
 *    def getName(self):
 *        return "厂长资源"
 *    def init(self,extend=""):
 *        print("============{0}============".format(extend))
 *        pass
 *    def homeContent(self,filter):
 *        result = {}
 *        cateManual = {
 *            "豆瓣电影Top250": "dbtop250",
 *            "最新电影": "zuixindianying",
 *            "电视剧": "dsj",
 *            "国产剧": "gcj",
 *            "美剧": "meijutt",
 *            "韩剧": "hanjutv",
 *            "番剧": "fanju",
 *            "动漫": "dm"
 *        }
 *        classes = []
 *        for k in cateManual:
 *            classes.append({
 *                'type_name':k,
 *                'type_id':cateManual[k]
 *            })
 *        result['class'] = classes
 *        return result
 *    def homeVideoContent(self):
 *        rsp = self.fetch("https://www.czzy66.com/")
 *        root = self.html(rsp.text)
 *        aList = root.xpath("//div[@class='mi_btcon']//ul/li")
 *        videos = []
 *        for a in aList:
 *            name = a.xpath('./a/img/@alt')[0]
 *            pic = a.xpath('./a/img/@data-original')[0]
 *            mark = a.xpath("./div[@class='hdinfo']/span/text()")[0]
 *            sid = a.xpath("./a/@href")[0]
 *            sid = self.regStr(sid,"/movie/(\\S+).html")
 *            videos.append({
 *                "vod_id":sid,
 *                "vod_name":name,
 *                "vod_pic":pic,
 *                "vod_remarks":mark
 *            })
 *        result = {
 *            'list':videos
 *        }
 *        return result
 *    def categoryContent(self,tid,pg,filter,extend):
 *        result = {}
 *        url = 'https://www.czzy66.com/{0}/page/{1}'.format(tid,pg)
 *        rsp = self.fetch(url)
 *        root = self.html(rsp.text)
 *        aList = root.xpath("//div[contains(@class,'mi_cont')]//ul/li")
 *        videos = []
 *        for a in aList:
 *            name = a.xpath('./a/img/@alt')[0]
 *            pic = a.xpath('./a/img/@data-original')[0]
 *            mark = a.xpath("./div[@class='hdinfo']/span/text()")[0]
 *            sid = a.xpath("./a/@href")[0]
 *            sid = self.regStr(sid,"/movie/(\\S+).html")
 *            videos.append({
 *                "vod_id":sid,
 *                "vod_name":name,
 *                "vod_pic":pic,
 *                "vod_remarks":mark
 *            })
 *
 *        result['list'] = videos
 *        result['page'] = pg
 *        result['pagecount'] = 9999
 *        result['limit'] = 90
 *        result['total'] = 999999
 *        return result
 *    def detailContent(self,array):
 *        tid = array[0]
 *        url = 'https://www.czzy66.com/movie/{0}.html'.format(tid)
 *        rsp = self.fetch(url)
 *        root = self.html(rsp.text)
 *        node = root.xpath("//div[@class='dyxingq']")[0]
 *
 *        pic = node.xpath(".//div[@class='dyimg fl']/img/@src")[0]
 *        title = node.xpath('.//h1/text()')[0]
 *        detail = root.xpath(".//div[@class='yp_context']//p/text()")[0]
 *
 *        vod = {
 *            "vod_id":tid,
 *            "vod_name":title,
 *            "vod_pic":pic,
 *            "type_name":"",
 *            "vod_year":"",
 *            "vod_area":"",
 *            "vod_remarks":"",
 *            "vod_actor":"",
 *            "vod_director":"",
 *            "vod_content":detail
 *        }
 *
 *        infoArray = node.xpath(".//ul[@class='moviedteail_list']/li")
 *        for info in infoArray:
 *            content = info.xpath('string(.)')
 *            if content.startswith('类型'):
 *                vod['type_name'] = content
 *            if content.startswith('年份'):
 *                vod['vod_year'] = content
 *            if content.startswith('地区'):
 *                vod['vod_area'] = content
 *            if content.startswith('豆瓣'):
 *                vod['vod_remarks'] = content
 *            if content.startswith('主演'):
 *                vod['vod_actor'] = content
 *            if content.startswith('导演'):
 *                vod['vod_director'] = content
 *            # if content.startswith('剧情'):
 *            #    vod['vod_content'] = content
 *
 *        vod_play_from = '$$$'
 *        playFrom = ['厂长']
 *        vod_play_from = vod_play_from.join(playFrom)
 *
 *        vod_play_url = '$$$'
 *        playList = []
 *        vodList = root.xpath("//div[@class='paly_list_btn']")
 *        for vl in vodList:
 *            vodItems = []
 *            aList = vl.xpath('./a')
 *            for tA in aList:
 *                href = tA.xpath('./@href')[0]
 *                name = tA.xpath('./text()')[0]
 *                tId = self.regStr(href,'/v_play/(\\S+).html')
 *                vodItems.append(name + "$" + tId)
 *            joinStr = '#'
 *            joinStr = joinStr.join(vodItems)
 *            playList.append(joinStr)
 *        vod_play_url = vod_play_url.join(playList)
 *
 *        vod['vod_play_from'] = vod_play_from
 *        vod['vod_play_url'] = vod_play_url
 *
 *        result = {
 *            'list':[
 *                vod
 *            ]
 *        }
 *        return result
 *
 *    def searchContent(self,key,quick):
 *        url = 'https://www.czzy66.com/xssearch?q={0}'.format(key)
 *        # getHeader()
 *        rsp = self.fetch(url)
 *        root = self.html(rsp.text)
 *
 *        result = {}
 *        vodList = root.xpath("//div[contains(@class,'mi_ne_kd')]/ul/li/a")
 *        videos = []
 *        for vod in vodList:
 *            name = vod.xpath('./img/@alt')[0]
 *            pic = vod.xpath('./img/@data-original')[0]
 *            href = vod.xpath('./@href')[0]
 *            tid = self.regStr(href,'movie/(\\S+).html')
 *            remark = ""
 *            videos.append({
 *                "vod_id": tid,
 *                "vod_name": name,
 *                "vod_pic": pic,
 *                "vod_remarks": remark
 *            })
 *        result = {
 *            'list':videos
 *        }
 *        return result
 *
 *    config = {
 *        "player": { },
 *        "filter": {	}
 *    }
 *    header = {
 *        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36"
 *    }
 *
 *    def parseCBC(self, enc, key, iv):
 *        keyBytes = key.encode("utf-8")
 *        ivBytes = iv.encode("utf-8")
 *        cipher = AES.new(keyBytes, AES.MODE_CBC, ivBytes)
 *        msg = cipher.decrypt(enc)
 *        paddingLen = msg[len(msg)-1]
 *        return msg[0:-paddingLen]
 *
 *    def playerContent(self,flag,id,vipFlags):
 *        url = 'https://www.czzy66.com/v_play/{0}.html'.format(id)
 *        pat = '\\"([^\\"]+)\\";var [\\d\\w]+=function dncry.*md5.enc.Utf8.parse\\(\\"([\\d\\w]+)\\".*md5.enc.Utf8.parse\\(([\\d]+)\\)'
 *        rsp = self.fetch(url)
 *
 *        html = rsp.text
 *        content = self.regStr(html,pat)
 *        key = self.regStr(html,pat,2)
 *        iv = self.regStr(html,pat,3)
 *        decontent = self.parseCBC(base64.b64decode(content),key,iv).decode()
 *
 *        urlPat = 'video: \\{url: \\\"([^\\\"]+)\\\"'
 *        vttPat = 'subtitle: \\{url:\\\"([^\\\"]+\\.vtt)\\\"'
 *
 *        str3 = self.regStr(decontent,urlPat)
 *        str4 = self.regStr(decontent,vttPat)
 *
 *        self.loadVtt(str3)
 *
 *        result = {
 *            'parse':'0',
 *            'playUrl':'',
 *            'url':str3,
 *            'header':''
 *        }
 *        if len(str4) > 0:
 *            result['subf'] = '/vtt/utf-8'
 *            # result['subt'] = Proxy.localProxyUrl() + "?do=czspp&url=" + URLEncoder.encode(str4)
 *            result['subt'] = ''
 *        return result
 *
 *    def loadVtt(self,url):
 *        print(url)
 *    def isVideoFormat(self,url):
 *        pass
 *    def manualVideoCheck(self):
 *        pass
 *    def localProxy(self,param):
 *        action = {}
 *        return [200, "video/MP2T", action, ""]
 */
import {Spider} from "./spider.js";
import {_, Crypto} from "../lib/cat.js";
import {VodDetail, VodShort} from "../lib/vod.js";
import * as Utils from "../lib/utils.js";

function cryptJs(text, key, iv, type) {
    let key_value = CryptoJS.enc.Utf8.parse(key || 'PBfAUnTdMjNDe6pL');
    let iv_value = CryptoJS.enc.Utf8.parse(iv || 'sENS6bVbwSfvnXrj');
    let content
    if (type) {
         content = CryptoJS.AES.encrypt(text, key_value, {
            iv: iv_value, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7
        })
    } else {
         content = CryptoJS.AES.decrypt(text, key_value, {
            iv: iv_value, padding: CryptoJS.pad.Pkcs7
        }).toString(CryptoJS.enc.Utf8)
    }
    return content
}


class ChangZhangSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://www.czzy55.com"
    }

    getName() {
        return "🏭️┃厂长直连┃🏭️"
    }

    getAppName() {
        return "厂长资源"
    }

    parseVodShortFromElement($, element) {
        let vodShort = new VodShort()
        let imgElement = $($(element).find("a")).find("img")[0]
        vodShort.vod_name = imgElement.attribs.alt
        vodShort.vod_pic = imgElement.attribs["data-original"]
        vodShort.vod_remarks = $($($(element).find("[class='hdinfo']")).find("span")).text()
        vodShort.vod_id = $(element).find("a")[0].attribs.href
        return vodShort
    }

    async parseVodShortListFromDoc($) {
        let vod_list = []
        let aList = $($("[class=\"mi_cont\"]").find("ul")).find("li")
        for (const a of aList) {
            vod_list.push(this.parseVodShortFromElement($, a))
        }
        return vod_list
    }

    async parseVodShortListFromDocByCategory($) {
        let vod_list = []
        let aList = $($("[class=\"mi_cont \"]").find("ul")).find("li")
        for (const a of aList) {
            vod_list.push(this.parseVodShortFromElement($, a))
        }
        return vod_list
    }

    async parseVodDetailFromDoc($) {
        let vodDetail = new VodDetail()
        let nodeElement = $("[class='dyxingq']")
        vodDetail.vod_pic = $(nodeElement).find("img")[0].attribs.src
        vodDetail.vod_name = $($(nodeElement).find("h1")[0]).text()
        vodDetail.vod_content = $($($("[class='yp_context']")).find("p")).text()
        let infoArray = $(nodeElement).find("[class='moviedteail_list']").find("li")
        let x = $(infoArray).text()
        for (const info of infoArray) {
            let content = $(info).text()
            if (content.indexOf("类型") > -1) {
                vodDetail.type_name = content.replaceAll("类型", "").replaceAll("：", "")
            } else if (content.indexOf("年份") > -1) {
                vodDetail.vod_year = content.replaceAll("年份", "").replaceAll("：", "")
            } else if (content.indexOf("地区") > -1) {
                vodDetail.vod_area = content.replaceAll("地区", "").replaceAll("：", "")
            } else if (content.indexOf("豆瓣") > -1) {
                vodDetail.vod_remarks = content.replaceAll("豆瓣", "").replaceAll("：", "")
            } else if (content.indexOf("主演") > -1) {
                vodDetail.vod_actor = content.replaceAll("主演", "").replaceAll("：", "")
            } else if (content.indexOf("导演") > -1) {
                vodDetail.vod_director = content.replaceAll("导演", "").replaceAll("：", "")
            } else if (content.indexOf("剧情") > -1) {
                vodDetail.vod_content = content.replaceAll("剧情", "").replaceAll("：", "")
            }
        }
        let vod_play_from_list = [this.getAppName()]

        let vodPlayList = $("[class='paly_list_btn']")
        let vod_play_list = []
        for (const v1 of vodPlayList) {
            let vodItems = []
            let aList = $(v1).find("a")
            for (const tA of aList) {
                let episodeUrl = tA.attribs.href
                let episodeName = $(tA).text().replaceAll("立即播放  (", "").replaceAll(")", "")
                vodItems.push(episodeName + "$" + episodeUrl)
            }
            vod_play_list.push(vodItems.join("#"))
        }
        let ciliPlayList = $("[class=\"ypbt_down_list\"]").find("li")
        let index = 0
        for (const ciliPlay of ciliPlayList) {
            index = index + 1
            vod_play_from_list.push("磁力线路" + index.toString())
            let vodItems = []
            for (const ciliPlayUrl of $(ciliPlay).find("a")) {
                let episodeUrl = ciliPlayUrl.attribs.href
                let episodeName = Utils.getStrByRegex(/\[(.*?)]/, $(ciliPlayUrl).text())
                vodItems.push(episodeName + "$" + episodeUrl)
            }
            vod_play_list.push(vodItems.join("#"))
        }

        vodDetail.vod_play_url = vod_play_list.join("$$$")
        vodDetail.vod_play_from = vod_play_from_list.join("$$$")
        return vodDetail
    }

    async parseVodShortListFromDocBySearch($) {
        const items = $('div.search_list > ul > li');
        return _.map(items, (item) => {
            const img = $(item).find('img:first')[0];
            const a = $(item).find('a:first')[0];
            const hdinfo = $($(item).find('div.hdinfo')[0]).text().trim();
            const jidi = $($(item).find('div.jidi')[0]).text().trim();
            return {
                vod_id: a.attribs.href.replace(/.*?\/movie\/(.*).html/g, '$1'),
                vod_name: img.attribs.alt,
                vod_pic: img.attribs['data-original'],
                vod_remarks: jidi || hdinfo || '',
            };
        })
    }

    async setClasses() {
        const $ = await this.getHtml(this.siteUrl + '/movie_bt');
        const series = $('div#beautiful-taxonomy-filters-tax-movie_bt_series > a[cat-url*=movie_bt_series]');
        const tags = $('div#beautiful-taxonomy-filters-tax-movie_bt_tags > a');
        let tag = {
            key: 'tag',
            name: '类型',
            value: _.map(tags, (n) => {
                let v = n.attribs['cat-url'] || '';
                v = v.substring(v.lastIndexOf('/') + 1);
                return {n: n.children[0].data, v: v};
            }),
        };
        tag['init'] = tag.value[0].v;
        let classes = _.map(series, (s) => {
            let typeId = s.attribs['cat-url'];
            typeId = typeId.substring(typeId.lastIndexOf('/') + 1);
            this.filterObj[typeId] = [tag];
            return {
                type_id: typeId,
                type_name: s.children[0].data,
            };
        });
        const sortName = ['电影', '电视剧', '国产剧', '美剧', '韩剧', '日剧', '海外剧（其他）', '华语电影', '印度电影', '日本电影', '欧美电影', '韩国电影', '动画', '俄罗斯电影', '加拿大电影'];
        this.classes = _.sortBy(classes, (c) => {
            const index = sortName.indexOf(c.type_name);
            return index === -1 ? sortName.length : index;
        });
    }

    async setHomeVod() {
        let $ = await this.getHtml()
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    async setCategory(tid, pg, filter, extend) {
        if (pg <= 0) pg = 1;
        const tag = extend.tag || '';
        const link = this.siteUrl + '/movie_bt' + (tag.length > 0 ? `/movie_bt_tags/${tag}` : '') + '/movie_bt_series/' + tid + (pg > 1 ? `/page/${pg}` : '');
        let $ = await this.getHtml(link)
        this.vodList = await this.parseVodShortListFromDocByCategory($)
    }

    async setDetail(id) {
        let $ = await this.getHtml(id)
        this.vodDetail = await this.parseVodDetailFromDoc($)
    }

    async setSearch(wd, quick) {
        // const $ = await this.getHtml(this.siteUrl + '/xssearch?q=' + wd);
        // this.vodList = await this.parseVodShortListFromDocBySearch($)

    }

    async setPlay(flag, id, flags) {
        if (id.indexOf("magnet") > -1) {
            this.playUrl = id
        } else {
            let $ = await this.getHtml(id)
            const iframe = $('body iframe[src*=https]');
            if (iframe.length > 0) {
                const iframeHtml = (
                    await req(iframe[0].attribs.src, {
                        headers: {
                            Referer: id,
                            'User-Agent': Utils.CHROME,
                        },
                    })
                ).content;
                let player = Utils.getStrByRegex(/var player = "(.*?)"/,iframeHtml)
                let rand = Utils.getStrByRegex(/var rand = "(.*?)"/,iframeHtml)
                let content = JSON.parse(cryptJs(player,"VFBTzdujpR9FWBhe",rand))
                this.playUrl = content["url"]
            } else {
                const js = $('script:contains(window.wp_nonce)').html();
                const group = js.match(/(var.*)eval\((\w*\(\w*\))\)/);
                const md5 = Crypto;
                const result = eval(group[1] + group[2]);
                this.playUrl = result.match(/url:.*?['"](.*?)['"]/)[1];
            }
        }
    }
}

let spider = new ChangZhangSpider()

async function init(cfg) {
    await spider.init(cfg)
}

async function home(filter) {
    return await spider.home(filter)
}

async function homeVod() {
    return await spider.homeVod()
}

async function category(tid, pg, filter, extend) {
    return await spider.category(tid, pg, filter, extend)
}

async function detail(id) {
    return await spider.detail(id)
}

async function play(flag, id, flags) {
    return await spider.play(flag, id, flags)
}

async function search(wd, quick) {
    return await spider.search(wd, quick)
}

async function proxy(segments, headers) {
    return await spider.proxy(segments, headers)
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        proxy: proxy,
        search: search,
    };
}