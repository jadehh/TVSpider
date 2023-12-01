#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_yunpanshare.py
# @Author   : jade
# @Date     : 2023/11/30 14:09
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import os
import copy
import sys
import json
import time
import requests
from bs4 import BeautifulSoup,NavigableString

if os.environ.get("HOME") == "tmp":
    sys.path.append("py")
    from py_douban import Ali, VodDetail, VodShort, Logger,BaseSpider
else:
    sys.path.append(os.path.join(os.path.dirname(os.environ.get("HOME")), "cache", "py"))
    from douban import Ali, VodDetail, VodShort, Logger,BaseSpider

class Spider(BaseSpider):
    def init(self, extend=""):
        self.home_url = 'https://www.alypw.com/'
        self.init_logger()
        self.ali = Ali()


    def categoryContent(self, tid, pg, filter, extend):
        pass



    def getName(self):
        return "云盘分享"

    def homeContent(self, filter):
        start_time = time.time()
        rsp = self.fetch(self.home_url)
        #html_str = self.write_html(self.home_url,"云盘分享首页")
        # html_str = self.read_html("云盘分享首页")
        html_str = rsp.text
        self.logger.info("网盘分享首页打开成功,耗时:{}s".format("%.2f" % (time.time() - start_time)))
        soup = BeautifulSoup(html_str, 'lxml')
        category_elements = soup.select("[id^='navbar-category']")
        new_elements = soup.select(".hometab")[0].select(".img")

        classes = self.parase_classes(category_elements)
        vod_short_list = self.parase_vod_short_list(new_elements)
        result = {'jx': 0,
         'parse': 0,
         'class': classes,
         'list': vod_short_list,
         'filters':{}
         }
        self.logger.info("处理网盘分享首页信息成功,耗时:{}s".format(("%.2f" % (time.time() - start_time))))
        return result

    def detailContent(self, ids):
        tid = ids[0]
        start_time = time.time()
        rsp = self.fetch(tid)
        soup = BeautifulSoup(rsp.text, 'lxml')
        return self.parase_vod_detail_list(soup,tid)

    def homeVideoContent(self):
        pass

    def isVideoFormat(self, url):
        pass

    def localProxy(self, param):
        pass

    def manualVideoCheck(self):
        pass

    def playerContent(self, flag, id, vipFlags):
        return self.playerAliContent(flag,id,vipFlags)

    def searchContent(self, key, quick):
        pass


    def parase_classes(self, category_elements):
        key_list = ["影", "剧", "4K", "视", "音", "演", "动漫"]
        classes = []
        for element in category_elements:
            category_name = element.find("a").text
            category_id = element.find("a").get("href")
            is_show = False
            for key in key_list:
                if key in category_name:
                    is_show = True
            if is_show:
                classes.append({"type_name": category_name, "type_id": category_id})
        return classes




    def parase_vod_short_list(self,elements):
        vod_list = []
        vod_short = VodShort()
        a = elements
        for element in elements:
            vod_short.vod_id = element.find("a").get("href")
            vod_short.vod_name = element.find("a").get("title").replace("[免费在线观看][免费下载][夸克网盘][国产影视]","").replace("[阿里云盘]","")
            vod_short.vod_pic = element.find("img").get("src")
            vod_list.append(vod_short.to_dict())
        return vod_list



    def parase_vod_detail_list(self,soup,tid):
        key_list = ["www.alipan.com",'www.aliyundrive.com']
        start_time = time.time()
        vod_detail = VodDetail()
        vod_detail.vod_id = tid
        elements = soup.select(".article_content")
        all_elements = elements[0].find_all("p",recursive=True)
        vod_elements = elements[0].find_all("p")[5:-7]
        url_elements = vod_elements[1:3]
        share_url_list = []
        vod_text_list = []
        for vod_element in vod_elements:
            for text in vod_element.contents:
                if (type(text) == NavigableString):
                    if len(str(text).strip()) > 0:
                        text = str(text).replace("\xa0", "").replace("：", ":").replace("\n","/")
                        if ":" in text or "◎" in text:
                            if "◎" in text:
                                re_text = text.replace("◎","").strip().replace("　　","")
                                text = re_text[0:2].strip().replace(" ","") + ":" + re_text[2:].strip().replace(" ","")
                            vod_text_list.append(text)
                        else:
                            if len(vod_text_list) > 0:
                                if "http" not in vod_text_list[-1]:
                                    vod_text_list[-1] = vod_text_list[-1] + text
                else:
                    if "http" in text.text:
                        vod_text_list.append(text.text)


        for text in vod_text_list:
            if "名称" in text or "标题" in text or "又名" in text or "译名" in text or "片名" in text:
                vod_detail.vod_name = text.split(":")[-1]
            if "描述" in text or "简介" in text:
                vod_detail.vod_content = text.split(":")[-1]
            if "标签" in text or "类别" in text:
                vod_detail.vod_remarks = "标签: "+text.split(":")[-1]
            if "首播" in text or "上映日期" in text or "首播" in text or "上映" in text:
                vod_detail.vod_year = text.split(":")[-1]
            if "导演" in text:
                vod_detail.vod_director = text.split(":")[-1]
            if "主演" in text :
                vod_detail.vod_actor = text.split(":")[-1]
            if "https" in text:
                for key in key_list:
                    if key in text:
                        share_url_list.append({"name": self.getName(), "url": text})
            if "制片国家/地区" in text or "产地" in text:
                vod_detail.vod_area = text.split(":")[-1]
        vod_detail.vod_play_from, vod_detail.vod_play_url = self.ali.get_vod_name(share_url_list, vod_detail.vod_name)
        result = {
            'list': [
                vod_detail.to_dict()
            ]
        }
        return result

