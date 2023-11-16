#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : ali.py
# @Author   : jade
# @Date     : 2023/11/16 16:55
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import re
import json
import requests
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