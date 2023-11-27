#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_douban.py
# @Author   : jade
# @Date     : 2023/11/24 10:46
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
from base.spider import Spider
from bs4 import BeautifulSoup
import requests
import time
import os
import logging
import logging.config
logging.getLogger("urllib3.connectionpool").setLevel(logging.ERROR)
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'default': {
            'format': '%(asctime)s - %(name)s - %(levelname)s: %(message)s',
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'default',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': os.path.join(os.environ.get("HOME"),"info.log"),
            'formatter': 'default',
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['console', 'file'],
    }
}
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("豆瓣")
LocalAddress = "http://192.168.29.156:8099/"

class Spider(Spider):
    tree = None
    headers = {"Host":"frodo.douban.com",
               "Connection":"Keep-Alive",
               "Referer":"https://servicewechat.com/wx2f9b06c1de1ccfca/84/page-frame.html",
               "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat"

    }
    session = requests.session()
    home_url = 'https://movie.douban.com/'

    def Vod(self,vodId, name, pic, remark):
        return {
                "vod_id": vodId,
                "vod_name": name,
                "vod_pic": pic,
                "vod_remarks": remark
            }
    def fetch(self, url):
        try:
            rsp = self.session.get(url, headers=self.headers)
            return rsp
        except Exception as e:
            logger.error("url地址为:{}访问失败,失败原因为:{}".format(e))
            return None

    def getName(self):
        return "豆瓣"

    def init(self, extend=""):
        logger.info("##################豆瓣爬虫脚本初始化完成##################")
        pass
    def parseVodListFromJSONArray(self,items):
        vod_list = []
        for item in items:
            vodId = "msearch:" + item["id"]
            name = item["title"]
            try:
                pic = item["pic"]["normal"]+ "@Referer=https://api.douban.com/@User-Agent=" + "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
            except:
                pic = ""
            try:
                remark = "评分：" + str(item["rating"]["value"])
            except Exception as e:
                remark = ""
            vod_list.append(self.Vod(vodId, name, pic, remark));

        return vod_list

    def Result(self,classes, vod_list,filters):
        result = {}
        result['class'] = classes
        result['list'] = vod_list
        if filters:
            result['filters'] = filters
        return result
    ## 分类
    def homeContent(self, filter):
        classes = []
        typeIds = ["hot_gaia", "tv_hot", "show_hot", "movie", "tv", "rank_list_movie", "rank_list_tv"]
        typeNames = ["热门电影", "热播剧集", "热播综艺", "电影筛选", "电视筛选", "电影榜单", "电视剧榜单"]
        for (type_id,type_name) in zip(typeIds,typeNames):
            classes.append({
                'type_name': type_name,
                'type_id': type_id
            })
        start_time = time.time()
        url = "http://api.douban.com/api/v2/subject_collection/subject_real_time_hotest/items?apikey=0ac44ae016490db2204ce0a042db2916"
        rsp = self.fetch(url)
        vod_list = []
        if rsp.status_code == 200:
            items = rsp.json()["subject_collection_items"]
            vod_list = self.parseVodListFromJSONArray(items)
            logger.info("获取豆瓣首页信息成功,耗时:{}s".format(("%.2f" % (time.time() - start_time))))
        else:
            logger.error("获取豆瓣首页信息失败,失败原因为:{}".format(rsp.text))
        filter = None
        try:
            filter = self.fetch(LocalAddress + "json/douban.json").json()
        except:pass
        return self.Result(classes,vod_list,filter)


    ## 首页界面
    def homeVideoContent(self):
        pass
    ## 分类详情
    def categoryContent(self, tid, pg, filter, extend):
        pass

    ## 详情界面
    def detailContent(self, array):
        pass

    def searchContent(self, key, quick=True):
        pass

    def playerContent(self, flag, id, vipFlags):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass


    def localProxy(self, param):
        return [200, "video/MP2T", action, ""]