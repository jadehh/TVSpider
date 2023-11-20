#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_wanou.py.py
# @Author   : jade
# @Date     : 2023/11/13 17:03
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


class Ali():

    def __init__(self):
        self.APIUrl = "https://api.aliyundrive.com"
        self.PlayFromat = ["超清(720P)", "高清(1080P)", "超清(4k)"]
        self.ali_json = {"share_token": "",
                         "auth_token": "",
                         "qauth_token": ""}
        self.load_cache_config()

    def load_cache_config(self):
        if os.path.exists(os.path.join(os.environ["HOME"], "ali.json")):
            with open(os.path.join(os.environ["HOME"], "ali.json"), "rb") as f:
                self.ali_json = json.load(f)
        else:
            self.write_cache_config()

    def write_cache_config(self):
        with open(os.path.join(os.environ["HOME"], "ali.json"), "wb") as f:
            f.write(json.dumps(self.ali_json).encode("utf-8"))

    def get_download_url(self, file_id, share_id):
        if self.ali_json["qauth_token"]:
            pass
        else:
            self.get_ali_token()
        url = "https://open.aliyundrive.com/adrive/v1.0/openFile/getDownloadUrl"
        file_id = self.get_batch_file(file_id, share_id)
        params = {"file_id": file_id, "drive_id": "303583582"}
        headers = {
            "Content-Type": "application/json",
            "authorization": self.ali_json["qauth_token"],
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
            "Referer": "https://www.aliyundrive.com/"}
        response = requests.post(url, json.dumps(params), headers=headers)
        if response.status_code == 200:
            return response.json()["url"]
        else:
            print("获取下载链接失败,检查X-share-Token是否设置正确")

    def get_batch_file(self, file_id, share_id):
        params = {
            "requests": [
                {
                    "body": {
                        "file_id": file_id,
                        "share_id": share_id,
                        "auto_rename": True,
                        "to_parent_file_id": "root",
                        "to_drive_id": "303583582"
                    },
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "id": "0",
                    "method": "POST",
                    "url": "/file/copy"
                }
            ],
            "resource": "file"
        }
        if self.ali_json["share_token"]:
            pass
        else:
            self.get_share_token(share_id)
        if self.ali_json["auth_token"]:
            pass
        else:
            self.get_ali_logion()
        headers = {
            "Content-Type": "application/json",
            "x-share-token": self.ali_json["share_token"],
            "authorization": self.ali_json["auth_token"]
        }
        url = self.APIUrl + "/adrive/v2/batch"
        response = requests.post(url, json.dumps(params), headers=headers)
        if response.status_code == 200:
            return response.json()["responses"][0]["body"]["file_id"]
        else:
            print("转存文件失败")

    def get_ali_logion(self):
        url = "https://auth.aliyundrive.com/v2/account/token"
        params = {
            "refresh_token": "c2ddc8d762a94880a6112065f8ff0512",
            "grant_type": "refresh_token"
        }
        headers = {
            "Content-Type": "application/json"
        }
        response = requests.post(url, json.dumps(params), headers=headers)
        if response.status_code != 200:
            print("阿里登录失败,请更新阿里token")
        else:
            self.ali_json["auth_token"] = response.json()['token_type'] + " " + response.json()['access_token']
            self.write_cache_config()

    def get_share_file_id(self, share_id):
        url = self.APIUrl + "/adrive/v3/share_link/get_share_by_anonymous"
        params = {
            "share_id": share_id
        }
        headers = {'Content-Type': 'application/json'}
        respose = requests.post(url, data=json.dumps(params), headers=headers)
        if respose.status_code == 200:
            if (respose.json()["file_infos"][0]["type"]) == "file":
                return False, respose.json()["file_infos"][0]["file_id"]
            elif (respose.json()["file_infos"][0]["type"]) == "folder":
                return True, respose.json()["file_infos"][0]["file_id"]
        else:
            print("查看分享文件ID失败")

    def get_share_token(self, share_id):
        url = self.APIUrl + "/v2/share_link/get_share_token"
        params = {
            "share_id": share_id
        }
        headers = {'Content-Type': 'application/json'}
        respose = requests.post(url, data=json.dumps(params), headers=headers)
        if respose.status_code == 200:
            self.ali_json["share_token"] = respose.json()["share_token"]
            self.write_cache_config()
        else:
            print("查看分享文件Token失败,失败原因为:{}".format(respose.text))
            time.sleep(60)

    def get_all_files(self, share_id, file_id, video_file_list, sub_file_list, is_floder=False, parent=None):
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
        if self.ali_json["share_token"]:
            pass
        else:
            self.get_share_token(share_id)
        headers = {'Content-Type': 'application/json', "x-share-token": self.ali_json["share_token"]}
        respose = requests.post(url, data=json.dumps(params), headers=headers)
        if respose.status_code == 200:
            file_list = respose.json()["items"]
            for file_id in file_list:
                if file_id["type"] == 'folder':
                    self.get_all_files(share_id, file_id["file_id"], video_file_list, sub_file_list, is_floder=True,
                                       parent=file_id["name"])
                elif file_id["type"] == "file":
                    file_id["parent"] = parent
                    if file_id["category"] == "video" or file_id["category"] == "audio":
                        video_file_list.append(file_id)
                    elif file_id["file_extension"] in ["srt", "ass", "ssa", "vtt"]:
                        sub_file_list.append(file_id)
        else:
            self.ali_json["share_token"] = ""
            self.write_cache_config()
            self.get_share_token(share_id)
            self.get_all_files(share_id, file_id, video_file_list, sub_file_list, is_floder=False, parent=None)

    def get_size(self, size):
        if (size <= 0): return ""
        if (size > 1024 * 1024 * 1024 * 1024.0):
            size /= (1024 * 1024 * 1024 * 1024.0);
            return "%.2fTB" % size
        elif (size > 1024 * 1024 * 1024.0):
            size /= (1024 * 1024 * 1024.0);
            return "%.2fGB" % size
        elif (size > 1024 * 1024.0):
            size /= (1024 * 1024.0);
            return "%.2fMB" % size
        else:
            size /= 1024.0;
            return "%.2fKB" % size

    def get_alist_code(self):
        """
        通过Alist应用去访问阿里云盘
        """
        url = "https://open.aliyundrive.com/oauth/users/authorize?client_id=76917ccccd4441c39457a04f6084fb2f&redirect_uri=https://alist.nn.ci/tool/aliyundrive/callback&scope=user:base,file:all:read,file:all:write&state="
        params = {"authorize": 1, "scope": "user:base,file:all:read,file:all:write"}
        if self.ali_json["auth_token"]:
            pass
        else:
            self.get_ali_logion()
        headers = {'Content-Type': 'application/json', "authorization": self.ali_json["auth_token"]}
        respose = requests.post(url, data=json.dumps(params), headers=headers)
        if respose.status_code != 200:
            self.get_ali_logion()
            self.get_alist_code()
        else:
            return (respose.json()["redirectUri"].split("code=")[-1])

    def get_access_token(self, code):
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
        response = requests.post(url, data=json.dumps(params), headers={'Content-Type': 'application/json'})
        if response.status_code == 200:
            self.ali_json["qauth_token"] = response.json()['token_type'] + " " + response.json()['access_token']
            self.write_cache_config()
        else:
            print("Access Token获取失败,失败原因为:{}".format(response.text))
            time.sleep(60)
            self.get_access_token(self.get_alist_code())

    def get_ali_token(self):
        alist_code = self.get_alist_code()
        self.get_access_token(alist_code)

    def findSubs(self, name, sub_list):
        remove_ext = name = '.'.join(name.split('.')[:-1])
        sub_str = ""
        for sub_file in sub_list:
            if remove_ext in sub_file["name"]:
                sub_str = "+" + '.'.join(sub_file["name"].split('.')[:-1]) + "@@@" + sub_file[
                    'file_extension'] + "@@@" + sub_file["file_id"]
        return sub_str

    def sort_by_size(self, item):
        return item['size']

    def sort_by_name(self, item):
        return item['name']
    def get_vide_metadata(self, format):

        area = (format['width'] * format['height'])
        if area < 2073600:
            return self.PlayFromat[0]
        elif area > 2073600:
            return self.PlayFromat[2]
        else:
            return self.PlayFromat[1]

    def find_common_strings(self,string1,string2):
        set_1 = string1.split(".")
        set_2 = string2.split(".")
        return list(set(set_1).intersection(set(set_2)))

    def get_vod_name(self, share_url_list,page_title):
        video_file_list = []
        sub_file_list = []
        for share_url_dic in share_url_list:
            m = re.search('www.aliyundrive.com\\/s\\/([^\\/]+)(\\/folder\\/([^\\/]+))?', share_url_dic["url"]).groups()
            share_id = m[0]
            is_floder, file_id = self.get_share_file_id(share_id)
            self.Share_Token = None
            self.get_all_files(share_id, file_id, video_file_list, sub_file_list, is_floder)
        video_file_list = sorted(video_file_list, key=self.sort_by_name)
        episode = []
        repeat_list = []
        if len(video_file_list) > 10:
            repeat_list = self.find_common_strings(video_file_list[0]["name"], video_file_list[1]["name"])

        for video_file in video_file_list:
            video_name = video_file["name"]
            if len(repeat_list) > 5:
                for repeat_str in repeat_list:
                    video_name = video_name.replace(repeat_str, "").replace(".", "")
                video_name = page_title + " - " + (video_name)
            display_name = ""
            display_name = "[{}] ".format(self.get_vide_metadata(video_file['video_media_metadata'])) + display_name + \
                           video_name + " [{}]".format(self.get_size(video_file["size"]))
            sub_str = self.findSubs(video_file["name"], sub_file_list)
            epi_str = display_name + "$" + share_id + "+" + video_file["file_id"] + sub_str
            episode.append(epi_str)

        ## 自定义清晰度
        play_foramt_list = ["原画", "普画"]
        episode = ["#".join(episode)] * len(play_foramt_list)
        return "$$$".join(play_foramt_list), "$$$".join(episode)


class Spider(Spider):
    tree = None
    ali = Ali()
    header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.54 Safari/537.36"
    }
    session = requests.session()
    home_url = 'https://tvfan.xxooo.cf/'

    def fetch(self, url):
        rsp = self.session.get(url, headers=self.header)
        return rsp

    def getName(self):
        return "玩偶哥哥"

    def init(self, extend=""):
        print("============{0}============".format(extend))
        pass

    def homeContent(self, filter):
        result = {}
        classes = []
        start_time = time.time()
        rsp = self.fetch(self.home_url)
        classes.append({
            'type_name': str(time.time() - start_time),
            'type_id': ""
        })
        self.tree = html.fromstring(rsp.text)
        elements = self.tree.xpath('//a[contains(@class,"nav-link")]')
        for element in elements:
            type_name = element.xpath('text()')[0]
            if element.xpath('text()')[0] != "test":
                classes.append({
                    'type_name': type_name,
                    'type_id': element.xpath('@href')[0]
                })

        result['class'] = classes
        if (filter):
            result['filters'] = self.config['filter']
        return result

    def homeVideoContent(self):
        if self.tree is None:
            rsp = self.fetch(self.home_url)
            self.tree = html.fromstring(rsp.text)
        elements = self.tree.xpath('//div[@class="module-item"]')
        videos = []

        for element in elements:
            module_item_pic = element.xpath('div/div[@class="module-item-pic"]')[0]
            vod_id = module_item_pic.xpath('a/@href')[0]
            vod_name = module_item_pic.xpath('a/@title')[0]
            vod_pic = module_item_pic.find("img").get("data-src")
            if "/img.php?url=" in vod_pic:
                vod_pic = vod_pic.split("/img.php?url=")[-1]
            remarks = element.findtext('div[@class="module-item-text"]')
            videos.append({
                "vod_id": vod_id,
                "vod_name": vod_name,
                "vod_pic": vod_pic,
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

    def detailContent(self, array):
        tid = array[0]
        rsp = self.fetch(self.home_url + tid)
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
        play_from, play_url = self.ali.get_vod_name(share_url_list,page_title)
        print("获取阿里云盘文件地址:", time.time() - start_time)
        vod['vod_play_from'] = play_from
        vod['vod_play_url'] = play_url
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
        # flag指的是vod format
        # id 指定的 url share_id+file_id
        share_id = id.split("+")[0]
        file_id = id.split("+")[1]
        url = ""
        test_result = {"format": "application/octet-stream",
                       "header": "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36\",\"Referer\":\"https://www.aliyundrive.com/\"}",
                       "jx": 0, "parse": 0, "subs": [
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#AI 创世者 The.Creator.2023.mp4 [4.80GB]$hnWeeeNjbdq"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv [14.36GB]$hnWeeeNjbdq"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#[4K 高码版 24G] The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.mkv [23.37GB]$hnWeeeNjbdq"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30#[4K高码HDR[外挂字幕]] The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv [14.35GB]$hnWeeeNjbdq"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f$$$AI创世者2023.1080P.官方英语中字.mp4 [2.35GB]$hnWeeeNjbdq"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#AI 创世者 The.Creator.2023.mp4 [4.80GB]$hnWeeeNjbdq"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv [14.36GB]$hnWeeeNjbdq"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#[4K 高码版 24G] The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.mkv [23.37GB]$hnWeeeNjbdq"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30#[4K高码HDR[外挂字幕]] The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv [14.35GB]$hnWeeeNjbdq"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f$$$AI创世者2023.1080P.官方英语中字.mp4 [2.35GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#AI 创世者 The.Creator.2023.mp4 [4.80GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv [14.36GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#[4K 高码版 24G] The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.mkv [23.37GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30#[4K高码HDR[外挂字幕]] The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv [14.35GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f$$$AI创世者2023.1080P.官方英语中字.mp4 [2.35GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#AI 创世者 The.Creator.2023.mp4 [4.80GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv [14.36GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#[4K 高码版 24G] The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.mkv [23.37GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30#[4K高码HDR[外挂字幕]] The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv [14.35GB]$5FAdyanvsY1"},
                {"format": "text/x-ssa",
                 "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
                 "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f"}],
                       "url": "https://cn-beijing-data.aliyundrive.net/XWzYu4mA%2F254324%2F6552b5a291af7d9c47c04787a77e4c4a6ef00e82%2F6552b5a2724ef2b998b145be9ea47022c6e25871?di=bj29&dr=303583582&f=655b47ae90a31a338aa84489ab32177aeb79fc33&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27AI%25E5%2588%259B%25E4%25B8%2596%25E8%2580%25852023.1080P.%25E5%25AE%2598%25E6%2596%25B9%25E8%258B%25B1%25E8%25AF%25AD%25E4%25B8%25AD%25E5%25AD%2597.mp4&security-token=CAIS%2BgF1q6Ft5B2yfSjIr5f4c9CNrudV4omIcX%2FUs2I8QNl6gJXCljz2IHFPeHJrBeAYt%2FoxmW1X5vwSlq5rR4QAXlDfNXnHRFyAqFHPWZHInuDox55m4cTXNAr%2BIhr%2F29CoEIedZdjBe%2FCrRknZnytou9XTfimjWFrXWv%2Fgy%2BQQDLItUxK%2FcCBNCfpPOwJms7V6D3bKMuu3OROY6Qi5TmgQ41Uh1jgjtPzkkpfFtkGF1GeXkLFF%2B97DRbG%2FdNRpMZtFVNO44fd7bKKp0lQLukMWr%2Fwq3PIdp2ma447NWQlLnzyCMvvJ9OVDFyN0aKEnH7J%2Bq%2FzxhTPrMnpkSlacGoABmbw1up0Nj6jCE3tUCAaAHKOTesv65IXD0vWM8yif97zB7kCPRZoFEa8dcItcqQeIh9f9swsf4IE3JAZMCMnfhLJ%2BzlV2si9HmO1q8bCZWZlj2QBVhKNtK4518KVkZrT2HeFHIRefzSsYsUFy4k6Bo1J7m7cwKSqtkYqzZI4UFM0gAA%3D%3D&u=f20db5b2ffc94e08adfe08cee769ba7a&x-oss-access-key-id=STS.NTM8j9C8tUKcsYeWbiLVVoPit&x-oss-expires=1700481843&x-oss-signature=E1s6uCDMvqnri3cPqT98Z8cVYBJ0PWZaGIRgCFvzMCE%3D&x-oss-signature-version=OSS2"}
        if flag == "原画":
            url = self.ali.get_download_url(file_id, share_id)
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
