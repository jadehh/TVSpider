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
        return "📜┃阿里纸条┃📜"
    def init(self, extend=""):
        self.init_logger()
        self.load_cache_config()
        self.ali = Ali()
        rsp = self.fetch(self.home_url)
        self.xiaozhitiao_json = rsp.json()
        self.logger.info(extend)




    def load_cache_config(self):
        try:
            self.token_dic = self.load_config(self.get_name())
        except Exception as e:
            self.logger.error("读取缓存失败,失败原因为:{}".format(e))
            self.token_dic = self.write_config({"token":"","date":""},self.get_name())


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

        self.logger.info("阿里纸条首页解析完成")
        return result

    def parseVodListFromJson(self,vod_detail_list):
        vod_list = []
        index = 0
        for vod_detail_dic in vod_detail_list:
            vod_detail = VodDetail()
            vod_detail.load_dic(vod_detail_dic)
            vod_list.append(vod_detail.to_dict())
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
            vod_detail.vod_id = "0"
            index = index + 1
            new_vod_list.append(vod_detail.to_dict())
        result["list"] = new_vod_list
        return result

    ## 详情界面
    def detailContent(self, array):
        start_time = time.time()
        vod_detail_dic = json.loads(array[0])
        vod_detail = VodDetail()
        vod_detail.load_dic(vod_detail_dic)
        share_url_list = [{"name": self.get_name(), "url": vod_detail.vod_id}]
        vod_detail.vod_play_from, vod_detail.vod_play_url = self.ali.get_vod_name(share_url_list, vod_detail.vod_name)
        self.logger.info("获取阿里云盘文件地址耗时:{}s".format("%.2f" % (time.time() - start_time)))
        result = {
            'list': [
                vod_detail.to_dict()
            ]
        }
        return result


    def searchContent(self, key, quick=False):
        if quick is False:
            self.getDoubanSearchStatus()
        self.vod_douban_detail = self.json_to_vod(key)
        params = {
            "action":"search",
            "from":"web",
            "token":self.get_token(),
            "keyword":key
        }
        results = {"jx": 0, "parse": 0,"list":[]}
        try:
            response = self.post(self.api_url,data=params,headers=self.header)
            if response.status_code == 200:
                if "无此关键词资源，试试其他关键词吧" in response.text:
                    self.logger.error("搜索失败,失败原因为:{}".format(response.text))
                else:
                    data_list = response.json()["data"]
                    vod_list = []
                    for data in data_list:
                        vodDetail = VodDetail()
                        if self.vod_douban_detail:
                            vodDetail = self.vod_douban_detail
                        else:
                            vodDetail.type_name = data["cat"]
                        vodDetail.vod_name = data["title"]
                        vodDetail.vod_id = "https://www.aliyundrive.com/s/" + data["alikey"]
                        vod_list.append(vodDetail.set_id_to_dic())
                    results["list"] = vod_list
                    self.logger.info("搜索成功")
            else:
                self.logger.error("搜索失败,失败原因为:{}".format("服务不可用"))
                time.sleep(2)
                return self.searchContent(key, quick=True)
        except Exception as e:
            self.logger.error("搜索失败,失败原因为:{}".format(e))
            time.sleep(2)
            return self.searchContent(key, quick=True)
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

    def get_token(self):
        is_get_token = False
        try:
            if len(self.token_dic["token"]) == 0 or time.time() - float(self.token_dic["date"]) > 24 * 60 * 60 * 1000:
                is_get_token = True
        except:
            is_get_token = True
        if is_get_token is True:
            params = {
                "action": "get_token",
                "from": "web",
            }
            try:
                response = requests.post(self.api_url,data=params,headers=self.get_header())
                self.token_dic["token"] = response.json()["data"]
                self.token_dic["date"] = str(time.time())
                self.write_config(self.token_dic,self.get_name())
                self.logger.info("请求小纸条Token成功")
            except Exception as e:
                self.logger.error("请求小纸条Token失败,失败原因为:{}".format(e))

        return self.token_dic["token"]



    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def localProxy(self, param):
        pass