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


class Ali():
    APIUrl = "https://api.aliyundrive.com"
    PlayFromat = ["超清(720P)", "高清(1080P)", "超清(4k)"]
    share_token = None
    def get_download_url(self):
        url = "https://open.aliyundrive.com/adrive/v1.0/openFile/getDownloadUrl"
        params = {"file_id": "6554339735f0f2ac9e3d4e5b8223d0ad89cb2be1", "drive_id": "303583582"}
        headers = {
            "Content-Type": "application/json",
            "authorization": "Bearer eyJraWQiOiJLcU8iLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJmMjBkYjViMmZmYzk0ZTA4YWRmZTA4Y2VlNzY5YmE3YSIsImF1ZCI6Ijc2OTE3Y2NjY2Q0NDQxYzM5NDU3YTA0ZjYwODRmYjJmIiwiaXNzIjoiaHR0cHM6Ly9vcGVuLmFsaXl1bmRyaXZlLmNvbSIsImV4cCI6MTcwMDAyMDg4NywiaWF0IjoxNzAwMDEzMDg3LCJqdGkiOiI1NTFiNzA2M2Y2ODI0MjM4YjliMzU2ZGNlMzA2YzFlYSJ9.U9Jii2I7i7LV4q-XXDnOMIA4OYiZH9c2NsXTeJDpFgo",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
            "Referer": "https://www.aliyundrive.com/"}
        results = requests.post(url)
        print(results)

    def get_ali_logion(self):
        url = "https://auth.aliyundrive.com/v2/account/token"
        params = {
            "refresh_token": "c2ddc8d762a94880a6112065f8ff0512",
            "grant_type": "refresh_token"
        }
        headers = {
            "Content-Type": "application/json"
        }
        response = requests.post(url,json.dumps(params),headers=headers)
        if response.status_code != 200:
            print("阿里登录失败")
            self.get_ali_logion()
        else:
            return response.json()

    def get_share_file_id(self,share_id):
        url = self.APIUrl + "/adrive/v3/share_link/get_share_by_anonymous"
        params = {
            "share_id": share_id
        }
        headers = {'Content-Type':'application/json'}
        respose = requests.post(url, data=json.dumps(params),headers=headers)
        if respose.status_code == 200:
            if (respose.json()["file_infos"][0]["type"]) == "file":
                return False,respose.json()["file_infos"][0]["file_id"]
            elif (respose.json()["file_infos"][0]["type"]) == "folder":
                return True,respose.json()["file_infos"][0]["file_id"]
        else:
            print("查看分享文件ID失败")

    def get_share_token(self,share_id):
        url = self.APIUrl + "/v2/share_link/get_share_token"
        params = {
            "share_id": share_id
        }
        headers = {'Content-Type':'application/json'}
        respose = requests.post(url, data=json.dumps(params),headers=headers)
        if respose.status_code == 200:
            return respose.json()["share_token"]
        else:
            print("查看分享文件Token失败")

    def get_all_files(self,share_id,file_id,video_file_list,sub_file_list,is_floder=False,parent=None):
        url = self.APIUrl + "/adrive/v3/file/list"
        if is_floder:
            params = {
                "limit": 200,
                "share_id": share_id,
                "parent_file_id": file_id,
                "order_by": "name",
                "order_direction": "ASC"
            }
        else:
            params = {
                "limit": 200,
                "share_id": share_id,
                "parent_file_id": "root",
                "order_by": "name",
                "order_direction": "ASC"
            }
        if self.share_token is None:
            self.share_token = self.get_share_token(share_id)
        headers = {'Content-Type': 'application/json', "x-share-token": "Bearer " + self.share_token}
        respose = requests.post(url, data=json.dumps(params), headers=headers)
        if respose.status_code == 200:
            file_list = respose.json()["items"]
            for file_id in file_list:
                if file_id["type"] == 'folder':
                    time.sleep(0.1)
                    self.get_all_files(share_id,file_id["file_id"],video_file_list,sub_file_list,is_floder=True,parent=file_id["name"])
                elif file_id["type"] == "file":
                    file_id["parent"] = parent
                    if file_id["category"] == "video" or file_id["category"] == "audio":
                        video_file_list.append(file_id)
                    elif file_id["file_extension"] in ["srt", "ass", "ssa", "vtt"]:
                        sub_file_list.append(file_id)
        else:
            print(respose.json())
            print("查看分享文件列表失败")


    def get_size(self,size):
        if (size <= 0): return ""
        if (size > 1024 * 1024 * 1024 * 1024.0):
            size /= (1024 * 1024 * 1024 * 1024.0);
            return "%.2fTB" %size
        elif (size > 1024 * 1024 * 1024.0):
            size /= (1024 * 1024 * 1024.0);
            return "%.2fGB" % size
        elif (size > 1024 * 1024.0):
            size /= (1024 * 1024.0);
            return "%.2fMB" % size
        else:
            size /= 1024.0;
            return "%.2fKB" % size


    def get_alist_code(self,login_json):
        """
        通过Alist应用去访问阿里云盘
        """
        authorization = login_json['token_type'] + " " + login_json['access_token']
        url = "https://open.aliyundrive.com/oauth/users/authorize?client_id=76917ccccd4441c39457a04f6084fb2f&redirect_uri=https://alist.nn.ci/tool/aliyundrive/callback&scope=user:base,file:all:read,file:all:write&state="
        params = {"authorize": 1, "scope": "user:base,file:all:read,file:all:write"}
        headers = {'Content-Type':'application/json',"authorization": authorization}
        respose = requests.post(url, data=json.dumps(params),headers=headers)
        if respose.status_code != 200:
            print("获取Alist Code失败")
            self.get_alist_code(self.get_ali_logion())
        else:
            return (respose.json()["redirectUri"].split("code=")[-1])

    def get_access_token(self,code):
        """
        Access Token 有效期较短,需要重新获取 Access Token
        token只有三个小时有效期，三个小时到期后，需要重复获取
        access_token的作用是什么？
        access_token的作用主要是用于API的授权和认证。
        在API的使用过程中，访问令牌可以保证API的安全性，
        防止未授权的访问以及恶意攻击。
        例如，在一些需要身份验证的应用中，用户必须提供正确的访问令牌才能访问API。
        在这种情况下，access_token就成为了身份认证的一种方式。
        """
        url = "https://api.xhofe.top/alist/ali_open/code"
        params = {"code": code, "grant_type": "authorization_code"}
        response = requests.post(url, data=json.dumps(params),headers = {'Content-Type':'application/json'})
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            print("Access Token获取失败")
            time.sleep(60)
            self.get_access_token(self.get_alist_code(self.get_ali_logion()))


    def findSubs(self,name,sub_list):
        remove_ext = name = '.'.join(name.split('.')[:-1])
        sub_str = ""
        for sub_file in sub_list:
            if remove_ext in sub_file["name"]:
                sub_str = "+" + '.'.join(sub_file["name"].split('.')[:-1])  +"@@@" + sub_file['file_extension'] + "@@@" + sub_file["file_id"]
        return sub_str

    def sort_by_size(self,item):
        return item['size']


    def get_vide_metadata(self,format):

        area = (format['width'] * format['height'])
        if area < 2073600:
            return self.PlayFromat[0]
        elif area > 2073600:
            return self.PlayFromat[2]
        else:
            return self.PlayFromat[1]

    def get_vod_name(self,share_url_list):
        video_file_list = []
        sub_file_list = []
        for share_url_dic in share_url_list:
            m = re.search('www.aliyundrive.com\\/s\\/([^\\/]+)(\\/folder\\/([^\\/]+))?', share_url_dic["url"]).groups()
            share_id = m[0]
            is_floder, file_id = self.get_share_file_id(share_id)
            self.share_token = None
            self.get_all_files(share_id,file_id, video_file_list, sub_file_list, is_floder)
        video_file_list = sorted(video_file_list, key=self.sort_by_size)
        episode = []
        for video_file in video_file_list:
            display_name = ""
            display_name = "[{}] ".format(self.get_vide_metadata(video_file['video_media_metadata']))+ display_name + video_file["name"]+ " [{}]".format(self.get_size(video_file["size"]))
            sub_str = "+The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs@@@ass@@@6553478b0f2bd0a40fd14b16b2c21791c017af30"
            sub_str = self.findSubs(video_file["name"],sub_file_list)
            epi_str = display_name + "$" + share_id + "+" + video_file["file_id"] + sub_str

            episode.append(epi_str)
        ## 自定义清晰度
        play_foramt_list = ["原画", "普画"]

        episode = episode*len(play_foramt_list)

        return "$$$".join(play_foramt_list),"$$$".join(episode)
home_url = 'https://tvfan.xxooo.cf/'
header = {
    'User-Agent': 'okhttp/3.12.0'
}


class Spider(Spider):
    soup = None
    authorization = ''
    timeoutTick = 0
    localTime = 0
    expiresIn = 0
    shareTokenMap = {}
    expiresMap = {}
    localMedia = {}
    ali = Ali()
    header = {
        "Connection":"keep-alive",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36"
    }
    localProxyUrl = 'http://127.0.0.1:UndCover/proxy'
    session = requests.session()

    def getName(self):
        return "玩偶哥哥"

    def init(self, extend=""):
        print("============{0}============".format(extend))
        pass

    def homeContent(self, filter):
        result = {}
        classes = []
        start_time = time.time()
        rsp = self.session.get(home_url,headers=self.header)
        classes.append({"type_name":str(time.time()-start_time),"type_id":"1"})
        start_time = time.time()
        self.soup = BeautifulSoup(rsp.text, 'lxml') ## 这一步耗时
        elements = self.soup.select('.nav-link')
        classes.append({"type_name":str(time.time()-start_time),"type_id":"1"})

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
        if self.soup is None:
            rsp = self.fetch(home_url, headers=header)
            self.soup = BeautifulSoup(rsp.text, 'html.parser')
        elements = self.soup.select('.module-item')
        videos = []
        for element in elements:
            content_ele = element.select(".module-item-titlebox")[0]
            pic_ele = element.select(".module-item-pic")[0].contents[1]
            remarks = element.select(".module-item-text")[0].text
            videos.append({
                "vod_id": content_ele.next_element.attrs['href'],
                "vod_name": content_ele.text,
                "vod_pic": pic_ele.attrs["data-src"],
                "vod_remarks": remarks
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
        rsp = self.fetch(home_url + tid, headers=header)
        soup = BeautifulSoup(rsp.text, 'html.parser')
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
        play_from,play_url = self.ali.get_vod_name(share_url_list)
        vod['vod_play_from'] = play_from
        vod['vod_play_url'] =play_url
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
        url = "https://cn-beijing-data.aliyundrive.net/j6lhN83P%2F90610381%2F6552be0374ea2b60c5d34f4cbb32091655c788ae%2F6552be038996baa822084040b38a58797d2bc743?callback=eyJjYWxsYmFja1VybCI6Imh0dHA6Ly9iajI5LmFwaS1ocC5hbGl5dW5wZHMuY29tL3YyL2ZpbGUvZG93bmxvYWRfY2FsbGJhY2siLCJjYWxsYmFja0JvZHkiOiJodHRwSGVhZGVyLnJhbmdlPSR7aHR0cEhlYWRlci5yYW5nZX1cdTAwMjZidWNrZXQ9JHtidWNrZXR9XHUwMDI2b2JqZWN0PSR7b2JqZWN0fVx1MDAyNmRvbWFpbl9pZD0ke3g6ZG9tYWluX2lkfVx1MDAyNnVzZXJfaWQ9JHt4OnVzZXJfaWR9XHUwMDI2ZHJpdmVfaWQ9JHt4OmRyaXZlX2lkfVx1MDAyNmZpbGVfaWQ9JHt4OmZpbGVfaWR9IiwiY2FsbGJhY2tCb2R5VHlwZSI6ImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCIsImNhbGxiYWNrU3RhZ2UiOiJiZWZvcmUtZXhlY3V0ZSIsImNhbGxiYWNrRmFpbHVyZUFjdGlvbiI6Imlnbm9yZSJ9&callback-var=eyJ4OmRvbWFpbl9pZCI6ImJqMjkiLCJ4OnVzZXJfaWQiOiJmMjBkYjViMmZmYzk0ZTA4YWRmZTA4Y2VlNzY5YmE3YSIsIng6ZHJpdmVfaWQiOiIyMjg5NDQiLCJ4OmZpbGVfaWQiOiI2NTUyZjBkZWQzZmI5ZTEyZDE5NDRlYjdhNWEzYmM4YWE1ZGMzZTljIn0%3D&di=bj29&dr=228944&f=6552f0ded3fb9e12d1944eb7a5a3bc8aa5dc3e9c&pds-params=%7B%22ap%22%3A%22pJZInNHN2dZWk8qg%22%7D&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27AI%2520%25E5%2588%259B%25E4%25B8%2596%25E8%2580%2585%2520The.Creator.2023.mp4&security-token=CAIS%2BgF1q6Ft5B2yfSjIr5aHCOPSvKZVwoPaO0vwsVgvbcUaoqvvhzz2IHFPeHJrBeAYt%2FoxmW1X5vwSlq5rR4QAXlDfNTGHOlaCqFHPWZHInuDox55m4cTXNAr%2BIhr%2F29CoEIedZdjBe%2FCrRknZnytou9XTfimjWFrXWv%2Fgy%2BQQDLItUxK%2FcCBNCfpPOwJms7V6D3bKMuu3OROY6Qi5TmgQ41Uh1jgjtPzkkpfFtkGF1GeXkLFF%2B97DRbG%2FdNRpMZtFVNO44fd7bKKp0lQLukMWr%2Fwq3PIdp2ma447NWQlLnzyCMvvJ9OVDFyN0aKEnH7J%2Bq%2FzxhTPrMnpkSlacGoABY5llIAVXpLMZtFQdjv5WMK4tyykU6ZoBsc0eW27iM5f9M%2FGcxVMFieSeqVKwFEh384TZCm%2Fz4Qu7HujPNI57YUkDXztMTjYHXRgZ2QoAIO1OX6CJ73kWTt4bXhAYJK%2FjeBg%2FZX3ANe7gC23zSgIhqFjSK7%2F37gN7DOG3LUMwEpMgAA%3D%3D&sl=hnWeeeNjbdq&u=f20db5b2ffc94e08adfe08cee769ba7a&x-oss-access-key-id=STS.NU2CYfQytuA19mAUXzaJ6MnDe&x-oss-expires=1699972890&x-oss-signature=%2Fbb0ZruNf1AvEjqBYNfvfQedS4575vFx4ZFPkG6UtTk%3D&x-oss-signature-version=OSS2"
        result = {"format": "application/octet-stream",
                  "header": "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36\",\"Referer\":\"https://www.aliyundrive.com/\"}",
                  "jx": 0,
                  "parse": 0,
                  "url": url}

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
