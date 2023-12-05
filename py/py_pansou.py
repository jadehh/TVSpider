#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_pansou.py
# @Author   : jade
# @Date     : 2023/12/4 14:44
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     : 盘搜
import os
import copy
import sys
import json
import time
import requests
from bs4 import BeautifulSoup
if os.environ.get("HOME") == "tmp":
    sys.path.append("py")
    from py_douban import Ali, VodDetail, VodShort, Logger,BaseSpider
else:
    sys.path.append(os.path.join(os.path.dirname(os.environ.get("HOME")), "cache", "py"))
    from douban import Ali, VodDetail, VodShort, Logger,BaseSpider

class Spider(BaseSpider):
    home_url = "https://www.alipansou.com"
    def getName(self):
        return "😺猫狸盘搜😺"
    def init(self, extend=""):
        self.init_logger()
        self.ali = Ali()
        self.pan_sou_list = []

    ## 首页
    def homeContent(self, filter=True):
        start_time = time.time()
        result = {"jx": 0, "parse": 0}
        rsp = self.fetch(self.home_url)
        soup = BeautifulSoup(rsp.text,"lxml")
        self.pan_sou_list = self.parseVodListAndCateGortListFromSoup(soup)
        classes = []
        for i in range(len(self.pan_sou_list)):
            type_name = self.pan_sou_list[i]["key"]
            if i == 2 or i == 4:
                pass
            else:
                classes.append({
                "type_name": type_name,
                "type_id":i
                })
        result["class"] = classes
        result["list"] = self.pan_sou_list[0]["vod_list"]
        return result

    def parseVodListAndCateGortListFromSoup(self,soup):
        category_elements =  soup.find_all("van-tab")
        pan_sou_list = []
        for (index,element) in enumerate(category_elements):
            vod_elements = (element.find_all("van-grid-item"))
            type_name = element.attrs["title"]
            pan_sou_list.append({"key": type_name,"vod_list":[]})
            vod_list = []
            for vod_element in vod_elements:
                vod_detail = VodDetail()
                con_element = vod_element.contents[0]
                vod_detail.vod_name = con_element.text.split(".")[-1].strip()
                vod_detail.vod_id = con_element.attrs["href"]
                vod_list.append(vod_detail.to_dict())
            pan_sou_list[index]["vod_list"] = vod_list

        return pan_sou_list

    def get_vod_url_by_search(self,search_url):
        rsp = self.fetch(search_url)
        soup = BeautifulSoup(rsp.text, "lxml")
        elements = (soup.find_all("a"))[1:7]
        search_vod_list = []
        for element in elements:
            search_vod_list.append(self.paraseDetailVodFromElement(element))
        return search_vod_list

    # 首页界面
    def homeVideoContent(self):
        pass

    ## 分类详情
    def categoryContent(self, tid, pg, filter, extend):
        self.logger.info("tid:{},pg:{},filter:{},extend:{}".format(tid,pg,filter,extend))
        result = {}
        result["list"] = []
        return result

    def paraseDetailVodFromElement(self,element,is_cv=True):
        try:
            vod_detail = VodDetail()
            if is_cv:
                vod_detail.vod_id = self.home_url + "/cv/" + element.attrs['href'].split("/")[-1]
            else:
                vod_detail.vod_id = element.attrs['href']
            vod_detail.vod_year = element.find_all("div")[1].contents[0].replace(" ", "")[4:-5]
            vod_detail.vod_remarks = vod_detail.vod_year
            span_elements = element.find_all("span")
            for span_element in span_elements:
                 vod_detail.vod_name = vod_detail.vod_name + span_element.string
            vod_detail.vod_name = vod_detail.vod_name
            return vod_detail
        except Exception  as e:
            return None


    def paraseDetailVodFromSoup(self,soup):
        elements = soup.find_all("van-cell")[:4]
        vod_detail = VodDetail()
        vod_detail.vod_name = elements[0].attrs["value"]
        vod_detail.vod_year = elements[3].text.strip()
        vod_detail.vod_remarks = vod_detail.vod_year
        return vod_detail

    ## 详情界面
    def detailContent(self, array):
        start_time = time.time()
        id = array[0]
        rsp = self.fetch(self.home_url + id)
        soup = BeautifulSoup(rsp.text, "lxml")
        if "search" in id:
            vod_detail = self.paraseDetailVodFromElement(soup.find_all("a")[3])
        else:
            vod_detail = self.paraseDetailVodFromSoup(soup)
            vod_detail.vod_id = self.home_url + "/cv/" + id.split("/")[-1]
        headers = {"referer": vod_detail.vod_id}
        rsp = requests.get(vod_detail.vod_id,headers=headers)
        share_url_list = [{"name": self.getName(), "url": rsp.url}]
        vod_detail.vod_play_from, vod_detail.vod_play_url = self.ali.get_vod_name(share_url_list, vod_detail.vod_name)
        self.logger.info("获取阿里云盘文件地址耗时:{}s".format("%.2f" % (time.time() - start_time)))
        result = {
            'list': [
                vod_detail.to_dict()
            ]
        }
        return result

    def searchContent(self, key, quick=True):
        url = "https://alipansou.com/search?k={}".format(key)
        rsp = self.fetch(url)
        soup = BeautifulSoup(rsp.text, "lxml")
        elements = (soup.find_all("a"))[1:-7]
        vod_detail_list = []
        for element in elements:
            vod_detail = self.paraseDetailVodFromElement(element,False)
            if vod_detail:
                vod_detail_list.append(vod_detail.to_dict())
        results = {"jx": 0, "parse": 0,"list":vod_detail_list}
        return results


    def playerContent(self, flag, id, vipFlags):
        # flag指的是vod format
        # id 指定的 url share_id+file_id
        return self.playerAliContent(flag,id,vipFlags)


    def get_header(self):
        header = copy.copy(self.header)
        header["Host"] = "gitcafe.net"
        header["User-Agent"] = ""
        return header




    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def localProxy(self, param):
        pass