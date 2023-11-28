#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_gitcafe.py.py
# @Author   : jade
# @Date     : 2023/11/28 17:15
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import os.path
import sys
import json
import time
import hashlib
import requests
import re
from base.spider import Spider
from bs4 import BeautifulSoup
from lxml import etree
from lxml import html
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
            'filename': os.path.join(os.environ.get("HOME"), "info.log"),
            'formatter': 'default',
        }
    },
    'root': {
        'level': 'DEBUG',
        'handlers': ['console', 'file'],
    }
}
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger("阿里纸条")
class Spider(Spider):
    tree = None
    header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"}
    session = requests.session()
    home_url = 'https://ali.gitcafe.ink'

    def fetch(self, url):
        try:
            rsp = self.session.get(url, headers=self.header)
            return rsp
        except Exception as e:
            logger.error("Get请求失败,失败原因为:{}".format(e))
            sys.exit()

    def getName(self):
        return "阿里纸条"

    def init(self, extend=""):
        logger.info("##################阿里纸条爬虫脚本初始化完成##################")
        pass

    ## 分类
    ## 分类
    def homeContent(self, filter=True):
        result = {"jx": 0, "parse": 0}
        classes = []
        start_time = time.time()
        rsp = self.fetch(self.home_url)
        logger.info("阿里纸条首页打开成功,耗时:{}s".format("%.2f" % (time.time() - start_time)))
        with open("html/gitcafe.html","wb") as f:
            f.write(rsp.text.encode("utf-8"))
        soup = BeautifulSoup(rsp.text, 'lxml')
        start_time = time.time()
        elements = soup.select('.tableizer-title')
        index = 0
        for element in elements[:4]:
            type_name = element.text
            classes.append({
                    'type_name': type_name,
                    'type_id': type_name
                })
        result['class'] = classes
        vod_list = self.parseVodListFromDoc(soup)
        result["list"] = vod_list
        logger.info("处理阿里纸条首页信息成功,耗时:{}s".format(("%.2f" % (time.time() - start_time))))
        return result

    def parseVodListFromDoc(self, doc):

        return vod_list

    # 首页界面
    def homeVideoContent(self):
        pass

    ## 分类详情
    def categoryContent(self, tid, pg, filter, extend):
        """
        String[] urlParams = new String[]{tid, "", "", "", "", "", "", "", pg, "", "", ""};
        if (extend != null && extend.size() > 0) {
            for (String key : extend.keySet()) {
                urlParams[Integer.parseInt(key)] = extend.get(key);
            }
        }
        String url = String.format("%s/index.php/vodshow/%s.html", siteUrl, String.join("-", urlParams));
        Document doc = Jsoup.parse(OkHttp.string(String.format("%s/index.php/vodshow/%s.html", siteUrl, String.join("-", urlParams)), getHeader()));
        int page = Integer.parseInt(pg), limit = 72, total = 0;
        Matcher matcher = regexPageTotal.matcher(doc.html());
        if (matcher.find()) total = Integer.parseInt(matcher.group(1));
        int count = total <= limit ? 1 : ((int) Math.ceil(total / (double) limit));
        return Result.get().vod(parseVodListFromDoc(doc)).page(page, count, limit, total).string();

        :param tid:
        :param pg:
        :param filter:
        :param extend:
        :return:
        {"jx": 0, "limit": 72, "list": [
            {"vod_id": "/index.php/voddetail/82261.html", "vod_name": "那夜凌晨，我坐上了旺角开往大埔的红VAN",
             "vod_pic": "https://svip.picffzy.com/upload/vod/20230313-1/f803ec81df8d20baebdb3a15a3880ea6.jpg",
             "vod_remarks": "HD国语"}],
         "page": 1, "pagecount": 39, "parse": 0, "total": 2759}
        """
        start_time = time.time()
        urlParams = [str(tid), "", "", "", "", "", "", "", str(pg), "", "", ""]
        try:
            for key in list(extend.keys()):
                urlParams[key] = extend[key]
        except:
            pass
        url = "{}/index.php/vodshow/{}.html".format(self.home_url, "-".join(urlParams))
        response = self.fetch(url)
        tree = html.fromstring(response.text)
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
        logger.info("分类详情界面获取成功,页数为:{},耗时为:{}s".format(pg, "%.2f" % (time.time() - start_time)))
        return result

    ## 详情界面
    def detailContent(self, array):
        ## 用lxml解析
        tid = array[0]
        start_time = time.time()
        rsp = self.fetch(self.home_url + tid)
        soup = BeautifulSoup(rsp.text, 'lxml')
        page_title = soup.find(attrs={"class": "page-title"}).text
        video_info_aux_list = soup.find(attrs={"class": "video-info-aux"}).contents
        video_info_aux_str = ""
        for video_info_aux in video_info_aux_list[1:-2]:
            video_info_aux_str = video_info_aux_str + video_info_aux.text
        video_info_area = video_info_aux_list[-1].text
        mobile_play = soup.find(attrs={"class": "mobile-play"}).find(attrs={"class": "lazyload"}).attrs["data-src"]
        video_info_elements = soup.select(".video-info-item")
        video_info_director = video_info_elements[0].text.replace("/", "")  ##导演
        video_info_actor = video_info_elements[1].text[1:-1].replace("/", ",")
        video_info_year = video_info_elements[2].text
        video_info_definition = video_info_elements[3].text
        video_info_content = (video_info_elements[4].text.replace("[收起部分]", "").replace("[展开全部]", ""))
        share_url_elements = soup.select('.module-row-title')
        share_url_list = []
        for element in share_url_elements:
            share_url_list.append({"name": element.contents[0].text, "url": element.contents[1].text})
        # fileId = col[2]
        logger.info("获取视频详情成功,耗时:{}s".format("%.2f" % (time.time() - start_time)))
        vod = {
            "vod_id": tid,
            "vod_name": page_title,
            "vod_pic": mobile_play,
            "type_name": video_info_aux_str,
            "vod_year": video_info_year,
            "vod_area": video_info_area,
            "vod_remarks": "清晰度:{}, 制作人:Jade".format(video_info_definition),
            "vod_actor": video_info_actor,
            "vod_director": video_info_director,
            "vod_content": video_info_content
        }
        start_time = time.time()
        share_url_list[0]["url"] = "https://www.aliyundrive.com/s/M7XgeZwKw2h"
        play_from, play_url = self.ali.get_vod_name(share_url_list, page_title)
        logger.info("获取阿里云盘文件地址耗时:{}s".format("%.2f" % (time.time() - start_time)))
        vod['vod_play_from'] = play_from
        vod['vod_play_url'] = play_url
        result = {
            'list': [
                vod
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
        logger.info("搜索成功,耗时:{}s".format("%.2f" % (time.time() - start_time)))
        return results

    def playerContent(self, flag, id, vipFlags):
        # flag指的是vod format
        # id 指定的 url share_id+file_id
        start_time = time.time()
        id_list = id.split("+++")
        file_name = id_list[0]
        size = id_list[1]
        share_id = id_list[2]
        sub_name = ""
        sub_type = ""
        sub_id = ""
        if "+" in id_list[3]:
            file_id = id_list[3].split("+++")[0]
            sub_id_list = id_list[3].split("+++")[1].split("@@@")
            sub_name = sub_id_list[0]
            sub_type = sub_id_list[1]
            sub_id = sub_id_list[2]
        else:
            file_id = id_list[3]
        if flag == "原画":
            url = self.ali.get_download_url(file_name, size, file_id, share_id)
        else:
            url = self.ali.get_video_preview_play_info(flag, file_name, size, file_id, share_id)
        result = {"format": "application/octet-stream",
                  "header": "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36\",\"Referer\":\"https://www.aliyundrive.com/\"}",
                  "jx": 0,
                  "parse": 0,
                  "url": url}
        logger.info("获取下载链接耗时:{}s,下载链接为:{}".format(('%.2f' % (time.time() - start_time)), url))
        return result

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def localProxy(self, param):
        pass