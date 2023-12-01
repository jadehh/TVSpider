#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_wanou.py.py
# @Author   : jade
# @Date     : 2023/11/13 17:03
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import os
import copy
import sys
import json
import time
import requests
import re
from bs4 import BeautifulSoup
from lxml import etree,html
import math
if os.environ.get("HOME") == "tmp":
    sys.path.append("py")
    from py_douban import Ali, VodDetail, VodShort, Logger,BaseSpider
else:
    sys.path.append(os.path.join(os.path.dirname(os.environ.get("HOME")), "cache", "py"))
    from douban import Ali, VodDetail, VodShort, Logger,BaseSpider


class Spider(BaseSpider):
    home_url = 'https://tvfan.xxooo.cf'

    def getName(self):
        return "玩偶哥哥"

    def init(self, extend=""):
        # try:
        #     os.remove(os.path.join(os.environ["HOME"], "wanou.json"))
        #     self.logger.info("删除玩偶JSON配置成功")
        # except:
        #     pass
        self.init_logger()
        self.load_cache_config()
        self.ali = Ali()

    def load_cache_config(self):
        if os.path.exists(os.path.join(os.environ["HOME"], "wanou.json")):
            try:
                with open(os.path.join(os.environ["HOME"], "wanou.json"), "rb") as f:
                    self.category_extend_dic = json.load(f)
            except:
                os.remove(os.path.join(os.environ["HOME"], "wanou.json"))
                self.category_extend_dic = {}
                self.write_cache_config()
        else:
            self.category_extend_dic = {}
            self.write_cache_config()

    def write_cache_config(self):
        with open(os.path.join(os.environ["HOME"], "wanou.json"), "wb") as f:
            f.write(json.dumps(self.category_extend_dic, indent=4, ensure_ascii=False).encode("utf-8"))

    ## 分类
    ## 分类
    def homeContent(self, filter=True):
        result = {"jx": 0, "parse": 0}
        classes = []
        start_time = time.time()
        rsp = self.fetch(self.home_url)
        self.logger.info("玩偶哥哥首页打开成功,耗时:{}s".format("%.2f" % (time.time() - start_time)))
        self.tree = html.fromstring(rsp.text)
        start_time = time.time()
        elements = self.tree.xpath('//a[contains(@class,"nav-link")]')
        for element in elements:
            type_name = element.xpath('text()')[1].strip()
            url = element.xpath("@href")[0]
            classes.append({
                'type_name': type_name,
                'type_id': int(url.split(".html")[0].split("/")[-1])
            })
        result['class'] = classes
        vod_list = self.parseVodListFromDoc(self.tree)
        result["list"] = vod_list
        result["filters"] = self.category_extend_dic
        self.logger.info("处理玩偶哥哥首页信息成功,耗时:{}s".format(("%.2f" % (time.time() - start_time))))
        return result

    def parseVodListFromDoc(self, doc):
        vod_list = []
        elements = doc.xpath('//div[@class="module-item"]')
        for element in elements:
            vod_short = VodShort()
            module_item_pic = element.xpath('div/div[@class="module-item-pic"]')[0]
            vod_short.vod_id = module_item_pic.xpath('a/@href')[0]
            vod_short.vod_name = module_item_pic.xpath('a/@title')[0]
            vod_short.vod_pic = module_item_pic.find("img").get("data-src")
            if "/img.php?url=" in vod_short.vod_pic:
                vod_short.vod_pic = vod_short.vod_pic.split("/img.php?url=")[-1]
            vod_short.vod_remarks = element.findtext('div[@class="module-item-text"]')
            vod_list.append(vod_short.to_dict())
        return vod_list

    # 首页界面
    def homeVideoContent(self):
        pass

    ## 多级选项
    def getExtent(self, tree):
        elements = tree.xpath("//div[@class='scroll-content']")[1:]
        extend_list = []
        for i in range(len(elements)):
            extend_dic = {"key": str(i+1), "name": "", "value": []}
            if i < len(elements) - 1:
                extend_dic["name"] = elements[i].xpath("a/text()")[0]
                for ele in elements[i].xpath("div/a"):
                    extend_dic["value"].append({"n": ele.xpath("text()")[0], "v": ele.xpath("text()")[0]})
                extend_list.append(extend_dic)
            else:
                extend_dic["name"] = elements[i].xpath("div/a")[0].xpath("text()")[0]
                extend_dic["value"] = [{"n": elements[i].xpath("div/a")[1].xpath("text()")[0], "v":"hits"},
                                       {"n": elements[i].xpath("div/a")[2].xpath("text()")[0], "v":"score"}]

                extend_list.append(extend_dic)
        return extend_list



    def get_extend_sort_dic(self,tid):

        """
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
        """
        extend_dic = {}
        if tid < 4:
            extend_dic = {
                "1": 3,
                "2": 1,
                "3": 4,
                "4": 11,
                "5": 5,
                "6": 2
            }
        elif tid == 4:
            extend_dic = {
                "1": 1,
                "2": 11,
                "3": 5,
                "4": 2,
            }
        elif tid == 6:
            extend_dic = {
                "1": 3,
                "2": 1,
                "3": 11,
                "4": 5,
                "5": 2,
            }
        elif tid == 5:
            extend_dic = {
                "1": 5,
                "2": 2,
            }
        return extend_dic
    ## 分类详情
    def categoryContent(self, tid, pg, filter, extend):
        start_time = time.time()
        self.logger.info("tid:{},pg={},filter={},extend={},extend类型为:{}".format(tid,pg,filter,extend,type(extend)))
        urlParams = [str(tid), "", "", "", "", "", "", "", str(pg), "", "", ""]
        extend_dic = self.get_extend_sort_dic(int(tid))
        """
        """
        try:
            for key in list(extend.keys()):
                urlParams[extend_dic[key]] = extend[key]
        except:
            pass
        url = "{}/index.php/vodshow/{}.html".format(self.home_url, "-".join(urlParams))
        self.logger.info("分类URL为:{}".format(url))
        response = self.fetch(url)
        tree = html.fromstring(response.text)
        if str(tid) in self.category_extend_dic.keys():
            pass
        else:
            self.category_extend_dic[str(tid)] = self.getExtent(tree)
            self.logger.info("当前列表有新的二级分类,写入玩偶JSON:{}".format(json.dumps(self.category_extend_dic,indent=4,ensure_ascii=False)))
            self.write_cache_config()
        limit = 72  ## 一页有72条数据
        total = 0
        count = 0
        matcher = re.search("\\$\\(\"\\.mac_total\"\\)\\.text\\('(\\d+)'\\);", response.text).groups()
        if len(matcher) > 0:
            total = int(matcher[0])
        if total <= limit:
            count = 1
        else:
            count = math.ceil(total / limit)
        result = {"jx": 0, "limit": limit, "page": int(pg), "pagecount": count, "parse": 0, "total": total}
        vod_list = self.parseVodListFromDoc(tree)
        result["list"] = vod_list
        self.logger.info("分类详情界面获取成功,页数为:{},耗时为:{}s".format(pg, "%.2f" % (time.time() - start_time)))
        return result

    ## 详情界面
    def detailContent(self, array):
        ## 用lxml解析
        vod_detail = VodDetail()
        tid = array[0]
        vod_detail.vod_id = tid
        start_time = time.time()
        rsp = self.fetch(self.home_url + tid)
        soup = BeautifulSoup(rsp.text, 'lxml')
        vod_detail.vod_name = soup.find(attrs={"class": "page-title"}).text
        video_info_aux_list = soup.find(attrs={"class": "video-info-aux"}).contents
        for video_info_aux in video_info_aux_list[1:-2]:
            vod_detail.type_name = vod_detail.type_name + video_info_aux.text
        vod_detail.vod_area = video_info_aux_list[-1].text
        vod_detail.vod_pic = soup.find(attrs={"class": "mobile-play"}).find(attrs={"class": "lazyload"}).attrs[
            "data-src"]
        video_info_elements = soup.select(".video-info-item")
        vod_detail.vod_director = video_info_elements[0].text.replace("/", "")  ##导演
        vod_detail.vod_actor = video_info_elements[1].text[1:-1].replace("/", ",")
        vod_detail.vod_year = video_info_elements[2].text
        vod_detail.vod_remarks = "清晰度:{}, 制作人:Jade".format(video_info_elements[3].text)
        vod_detail.vod_content = (video_info_elements[4].text.replace("[收起部分]", "").replace("[展开全部]", ""))
        share_url_elements = soup.select('.module-row-title')
        share_url_list = []
        for element in share_url_elements:
            share_url_list.append({"name": element.find("h4").text, "url": element.find("p").text})
        # fileId = col[2]
        self.logger.info("获取视频详情成功,耗时:{}s".format("%.2f" % (time.time() - start_time)))
        start_time = time.time()
        vod_detail.vod_play_from, vod_detail.vod_play_url = self.ali.get_vod_name(share_url_list, vod_detail.vod_name)
        self.logger.info("获取阿里云盘文件地址耗时:{}s".format("%.2f" % (time.time() - start_time)))
        result = {
            'list': [
                vod_detail.to_dict()
            ]
        }
        return result

    def searchContent(self, key, quick=True):
        start_time = time.time()
        url = self.home_url + "/index.php/vodsearch/{}----------1---.html".format(key)
        rsp = self.fetch(url)
        soup = BeautifulSoup(rsp.text, 'lxml')
        results = {"jx": 0, "parse": 0}
        elements = soup.select(".module-search-item")
        vod_list = []
        for element in elements:
            vodId = element.select(".video-serial")[0].attrs["href"]
            vodName = element.select(".video-serial")[0].attrs["title"]
            vodPic = element.select(".module-item-pic > img")[0].attrs["data-src"]
            if "/img.php?url=" in vodPic:
                vodPic = vodPic.split("/img.php?url=")[-1]
            vodRemarks = element.select(".video-tag-icon")[0].text
            vod_list.append({"vod_id": vodId, "vod_name": vodName, "vod_pic": vodPic, "vod_remarks": vodRemarks})
        results["list"] = vod_list
        self.logger.info("搜索成功,耗时:{}s".format("%.2f" % (time.time() - start_time)))
        return results

    def playerContent(self, flag, id, vipFlags):
        return  self.playerAliContent(flag,id,vipFlags)

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def localProxy(self, param):
        return [200, "video/MP2T", action, ""]
