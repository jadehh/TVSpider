#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_wanou.py.py
# @Author   : jade
# @Date     : 2023/11/13 17:03
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import sys
import json
import time
import hashlib
import requests
import re
from base.spider import Spider
from bs4 import BeautifulSoup


home_url = 'https://tvfan.xxooo.cf/'
header = {
    'User-Agent': 'okhttp/3.12.0'
}
class Spider(Spider):
    authorization = ''
    timeoutTick = 0
    localTime = 0
    expiresIn = 0
    shareTokenMap = {}
    expiresMap = {}
    localMedia = {}
    header = {
        "Referer": "https://www.aliyundrive.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36"
    }
    localProxyUrl = 'http://127.0.0.1:UndCover/proxy'
    def getName(self):
        return "玩偶哥哥"

    def init(self, extend=""):
        print("============{0}============".format(extend))
        pass

    def homeContent(self, filter):
        result = {}
        rsp = self.fetch(home_url, headers=header)
        soup = BeautifulSoup(rsp.text, 'html.parser')
        elements = soup.select('.nav-link')
        classes = []
        for element in elements:
            if element.text != "text":
                classes.append({
                    'type_name': element.text,
                    'type_id': element.attrs["href"]
                })
        result['class'] = classes
        if (filter):
            result['filters'] = self.config['filter']
        return result

    def homeVideoContent(self):
        rsp = self.fetch(home_url, headers=header)
        soup = BeautifulSoup(rsp.text, 'html.parser')
        elements = soup.select('.module-item')
        videos = []
        for element in elements:
            content_ele = element.select(".module-item-titlebox")[0]
            pic_ele = element.select(".module-item-pic")[0].contents[1]
            videos.append({
                "vod_id": content_ele.next_element.attrs['href'],
                "vod_name": content_ele.text,
                "vod_pic": pic_ele.attrs["data-src"],
                "vod_remarks": element.text
            })

        result = {
            'list': videos
        }
        return result

    def categoryContent(self, tid, pg, filter, extend):
        result = {}
        ts = int(time.time())
        if 'type_id' not in extend.keys():
            extend['type_id'] = tid
        extend['pagenum'] = pg
        extend = {
            'pcode': '010110002',
            'version': '2.1.6',
            'devid': hashlib.md5(str(time.time()).encode()).hexdigest(),
            'package': 'com.sevenVideo.app.android',
            'sys': 'android',
            'sysver': 13,
            'brand': 'Redmi',
            'model': 'M2104K10AC',
            'pagesize': 24
        }
        url = 'https://api.tyun77.cn/api.php/provide/searchFilter'
        header = self.header.copy()
        header['t'] = str(ts)
        header['TK'] = self.get_tk(url, extend, ts)
        rsp = requests.get(url, params=extend, headers=header, timeout=5)
        jo = json.loads(rsp.text)
        if jo['code'] == 1004:
            rsp = requests.get('http://api.tyun77.cn/api.php/provide/getDomain', params=extend, headers=header,
                               timeout=5)
            if rsp.json()['code'] != 1:
                rsp = requests.get(url, params=extend, headers=header, timeout=5)
                jo = json.loads(rsp.text)
            else:
                return {}
        vodList = jo['data']['result']
        videos = []
        for vod in vodList:
            videos.append({
                "vod_id": vod['id'],
                "vod_name": vod['title'],
                "vod_pic": vod['videoCover'],
                "vod_remarks": vod['msg']
            })
        result['list'] = videos
        result['page'] = pg
        result['pagecount'] = 9999
        result['limit'] = 90
        result['total'] = 999999
        return result

    def getToken(self, shareId, sharePwd):
        self.localTime = int(time.time())
        shareToken = ''
        if shareId in self.shareTokenMap:
            shareToken = self.shareTokenMap[shareId]
            # todo
            expire = self.expiresMap[shareId]
            if len(shareToken) > 0 and expire - self.localTime > 600:
                return shareToken
        params = {
            'share_id': shareId,
            'share_pwd': sharePwd
        }
        url = 'https://api.aliyundrive.com/v2/share_link/get_share_token'
        rsp = requests.post(url, json=params, headers=self.header)
        jo = json.loads(rsp.text)
        newShareToken = jo['share_token']
        self.expiresMap[shareId] = self.localTime + int(jo['expires_in'])
        self.shareTokenMap[shareId] = newShareToken

        print(self.expiresMap)
        print(self.shareTokenMap)

        return newShareToken

    def listFiles(self, map, shareId, shareToken, fileId):
        url = 'https://api.aliyundrive.com/adrive/v3/file/list'
        newHeader = self.header.copy()
        newHeader['x-share-token'] = shareToken
        params = {
            'image_thumbnail_process': 'image/resize,w_160/format,jpeg',
            'image_url_process': 'image/resize,w_1920/format,jpeg',
            'limit': 200,
            'order_by': 'updated_at',
            'order_direction': 'DESC',
            'parent_file_id': fileId,
            'share_id': shareId,
            'video_thumbnail_process': 'video/snapshot,t_1000,f_jpg,ar_auto,w_300'
        }
        maker = ''
        arrayList = []
        for i in range(1, 51):
            if i >= 2 and len(maker) == 0:
                break
            params['marker'] = maker
            rsp = requests.post(url, json=params, headers=newHeader)
            jo = json.loads(rsp.text)
            ja = jo['items']
            for jt in ja:
                if jt['type'] == 'folder':
                    arrayList.append(jt['file_id'])
                else:
                    if 'video' in jt['mime_type'] or 'video' in jt['category']:
                        repStr = jt['name'].replace("#", "_").replace("$", "_")
                        map[repStr] = shareId + "+" + shareToken + "+" + jt['file_id'] + "+" + jt['category']
                    # print(repStr,shareId + "+" + shareToken + "+" + jt['file_id'])
            maker = jo['next_marker']
            i = i + 1

        for item in arrayList:
            self.listFiles(map, shareId, shareToken, item)


    def detailContent(self, array):
        tid = array[0]
        rsp = self.fetch(home_url+tid, headers=header)
        soup = BeautifulSoup(rsp.text, 'html.parser')
        page_title = soup.find(attrs={"class":"page-title"}).text
        video_info_aux_list = soup.find(attrs={"class":"video-info-aux"}).contents
        video_info_aux_str = ""
        for video_info_aux in video_info_aux_list[1:-2]:
            video_info_aux_str = video_info_aux_str + video_info_aux.text
        video_info_area = video_info_aux_list[-1].text
        mobile_play =  soup.find(attrs={"class":"mobile-play"}).find(attrs={"class":"lazyload"}).attrs["data-src"]
        video_info_elements = soup.select(".video-info-item")
        video_info_director = video_info_elements[0].text.replace("/","") ##导演
        video_info_actor = video_info_elements[1].text[1:-1].replace("/",",")
        video_info_year = video_info_elements[2].text
        video_info_definition = video_info_elements[3].text
        video_info_content = (video_info_elements[4].text.replace("[收起部分]","").replace("[展开全部]",""))
        share_url_elements = soup.select('.module-row-title')
        share_url_list = []
        for element in share_url_elements:
            share_url_list.append({"name":element.contents[0].text,"url":element.contents[1].text})
        # shareId = self.regStr(href,'www.aliyundrive.com\\/s\\/([^\\/]+)(\\/folder\\/([^\\/]+))?')
        # todo =========================================================================================
        # m = re.search('www.aliyundrive.com\\/s\\/([^\\/]+)(\\/folder\\/([^\\/]+))?', tid)
        # col = m.groups()
        # shareId = col[0]
        # fileId = col[2]
        vod = {
            "vod_id": 1111,
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
        result = {
            'list': [
                vod
            ]
        }
        return result

    def searchContent(self, key, quick):
        url = 'http://api.tyun77.cn/api.php/provide/searchVideo?searchName={0}'.format(key)
        rsp = self.fetch(url, headers=self.header)
        jo = json.loads(rsp.text)
        vodList = jo['data']
        videos = []
        for vod in vodList:
            videos.append({
                "vod_id": vod['id'],
                "vod_name": vod['videoName'],
                "vod_pic": vod['videoCover'],
                "vod_remarks": vod['msg']
            })
        result = {
            'list': videos
        }
        return result

    config = {
        "player": {},
        "filter": {}
    }


    def playerContent(self, flag, id, vipFlags):
        result = {}
        result = {
            'parse': 0,
            'jx': 0,
            'playUrl': '',
            'url': id,
            'header': ''
        }
        if flag != 'ppayun':
            result['parse'] = 1
            result['jx'] = 1
        return result

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def get_tk(self, url, params, ts):
        keys = []
        for key in params:
            keys.append(key)
        keys.sort()
        src = urlparse(url).path
        for key in keys:
            src += str(params[key])
        src += str(ts)
        src += 'XSpeUFjJ'
        return hashlib.md5(src.encode()).hexdigest()

    def localProxy(self, param):
        return [200, "video/MP2T", action, ""]
