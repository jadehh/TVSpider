#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_gitcafe.py.py
# @Author   : jade
# @Date     : 2023/11/28 17:15
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
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
    home_url = 'https://gh.con.sh/https://raw.githubusercontent.com/jadehh/Spider/main/json/xiaozhitiao.json'
    api_url = 'https://gitcafe.net/tool/alipaper/'
    def getName(self):
        return "阿里纸条"
    def init(self, extend=""):
        self.init_logger()
        rsp = self.fetch(self.home_url)
        self.xiaozhitiao_json = rsp.json()
        self.ali = Ali()
        self.token = None
        self.date = 0

    ## 分类
    ## 分类
    def homeContent(self, filter=True):
        result = {"jx": 0, "parse": 0}
        start_time = time.time()
        classes = []
        index = 0
        for category_dic in self.xiaozhitiao_json["class"]:
            type_name = category_dic["type_name"]
            classes.append({
                'type_name': type_name,
                'type_id': index
            })
            index = index + 1
        result["class"] = classes
        vod_list = self.parseVodListFromJson(self.xiaozhitiao_json["list"])
        result["list"] = vod_list
        return result

    def parseVodListFromJson(self,vod_detail_list):
        vod_list = []
        index = 0
        for vod_detail_dic in vod_detail_list:
            vod_detail = VodDetail()
            vod_detail.load_dic(vod_detail_dic)
            vod_detail.vod_id = "home-----{}".format(index)
            vod_list.append(vod_detail.to_short())
            index = index + 1
        return vod_list

    # 首页界面
    def homeVideoContent(self):
        pass

    ## 分类详情
    def categoryContent(self, tid, pg, filter, extend):
        self.logger.info("tid:{},pg:{},filter:{},extend:{}".format(tid,pg,filter,extend))
        result = {"jx": 0, "limit": int(pg), "page": int(pg), "pagecount": int(pg), "parse": 0, "total": int(pg)}
        vod_list = self.xiaozhitiao_json["class"][int(tid)]["list"]
        index = 0
        new_vod_list = []
        for vod_dic in vod_list:
            vod_detail = VodDetail()
            vod_detail.load_dic(vod_dic)
            vod_detail.vod_id = "{}-----{}".format(tid,index)
            index = index + 1
            new_vod_list.append(vod_detail.to_dict())
        result["list"] = new_vod_list
        return result

    ## 详情界面
    def detailContent(self, array):
        start_time = time.time()
        id = array[0]
        if "-----" in id:
            if "home" in id:
                vod_dic = self.xiaozhitiao_json["list"][int(id.split("-----")[-1])]
            else:
                vod_dic = self.xiaozhitiao_json["clasess"][int(id.split("-----")[0])]["list"][int(id.split("-----")[-1])]
        else:
            self.logger.info("这是搜索的array")
        vod_detail = VodDetail()
        vod_detail.load_dic(vod_dic)
        share_url_list = [{"name": self.getName(), "url":vod_detail.vod_id}]
        vod_detail.vod_play_from, vod_detail.vod_play_url = self.ali.get_vod_name(share_url_list, vod_detail.vod_name)
        self.logger.info("获取阿里云盘文件地址耗时:{}s".format("%.2f" % (time.time() - start_time)))
        result = {
            'list': [
                vod_detail.to_dict()
            ]
        }
        return result

    def searchContent(self, key, quick=True):
        params = {
            "action":"search",
            "from":"web",
            "token":self.get_token(),
            "keyword":key
        }
        response = self.post(self.api_url,json.dumps(params),self.header)
        print(response)

    def playerContent(self, flag, id, vipFlags):
        # flag指的是vod format
        # id 指定的 url share_id+file_id
        return self.playerAliContent(flag,id,vipFlags)


    def get_header(self):
        header = copy.copy(self.header)
        header["Host"] = "gitcafe.net"
        header["User-Agent"] = ""
        return header

    def get_token(self):
        if self.token is None:
            params = {
                "action": "get_token",
                "from": "web",
            }
            response = requests.post(self.api_url,params=params,headers=self.get_header())
            print(response.text)
        print("Done")



    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def localProxy(self, param):
        pass