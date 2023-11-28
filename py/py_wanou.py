#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_wanou.py.py
# @Author   : jade
# @Date     : 2023/11/13 17:03
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import copy
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
import math

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
logger = logging.getLogger("阿里玩偶")


class Ali():

    def __init__(self):
        self.APIUrl = "https://api.aliyundrive.com"
        self.PlayFromat = ["超清(720P)", "高清(1080P)", "超清(4k)"]
        self.ali_json = {"auth_token": "test",
                         "qauth_token": "test"}
        self.drive_id = "303583582"
        self.headers = {'Content-Type': 'application/json',
                        "X-Canary": "client=Android,app=adrive,version=v4.3.1",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                        "Referer": "https://www.aliyundrive.com/"}

        # self.remove_config()
        self.root_file_json = {}
        self.load_cache_config()
        self.load_root_file_config()
        self.clear_root_file_json()
        self.definition_dic = {"高清": 'FHD', "超清": 'HD', "标清": 'SD'}

    def post(self, url, data, headers):
        try:
            rsp = requests.post(url, data=data, headers=headers)
            return rsp
        except Exception as e:
            logger.error("Post请求失败,失败原因为:{}".format(e))
            sys.exit()

    def clear_root_file_json(self):
        for file_name in list(self.root_file_json.keys()):
            try:
                delete_status = self.delete_file(file_name)
                if delete_status:
                    del self.root_file_json[file_name]
            except:
                logger.error("删除失败,失败原因为:名称为:{},无法找出file id".format(file_name))
                del self.root_file_json[file_name]
        self.write_root_file_config()
        logger.info("初始化阿里云盘,删除缓存的文件")

    def remove_config(self):
        try:
            os.remove(os.path.join(os.environ["HOME"], "ali.json"))
            logger.info("删除ali.json成功")
        except:
            pass
        try:
            os.remove(os.path.join(os.environ["HOME"], "root_file.json"))
            logger.info("删除root_file.json成功")
        except:
            pass

    def load_cache_config(self):
        if os.path.exists(os.path.join(os.environ["HOME"], "ali.json")):
            try:
                with open(os.path.join(os.environ["HOME"], "ali.json"), "rb") as f:
                    self.ali_json = json.load(f)
            except:
                os.remove(os.path.join(os.environ["HOME"], "ali.json"))
                self.write_cache_config()
        else:
            self.write_cache_config()

    def write_cache_config(self):
        with open(os.path.join(os.environ["HOME"], "ali.json"), "wb") as f:
            f.write(json.dumps(self.ali_json).encode("utf-8"))

    def load_root_file_config(self):
        if os.path.exists(os.path.join(os.environ["HOME"], "root_file.json")):
            try:
                with open(os.path.join(os.environ["HOME"], "root_file.json"), "rb") as f:
                    self.root_file_json = json.load(f)
            except:
                os.remove(os.path.join(os.environ["HOME"], "root_file.json"))
                self.write_root_file_config()
        else:
            self.write_root_file_config()

    def write_root_file_config(self):
        with open(os.path.join(os.environ["HOME"], "root_file.json"), "wb") as f:
            f.write(json.dumps(self.root_file_json).encode("utf-8"))

    def get_video_preview_play_info(self, play_info_type, file_name, size, file_id, share_id):
        url = "https://open.aliyundrive.com/adrive/v1.0/openFile/getVideoPreviewPlayInfo"
        file_id = self.get_batch_file(file_name, size, file_id, share_id)
        if file_id:
            headers = copy.copy(self.headers)
            headers["authorization"] = self.ali_json["qauth_token"]
            params = {"file_id": file_id, "drive_id": self.drive_id, "category": "live_transcoding",
                      "url_expire_sec": "14400"}
            response = self.post(url, json.dumps(params), headers=headers)
            if response.status_code == 200:
                video_preview_play_info = response.json()['video_preview_play_info']
                try:
                    definition = self.definition_dic[play_info_type]
                    for live_transcoding_task in video_preview_play_info['live_transcoding_task_list']:
                        if live_transcoding_task['template_id'] == definition:
                            logger.info("清晰度为:{}".format(play_info_type))
                            return live_transcoding_task["url"]
                except:
                    logger.warn("没有对应的清晰度,返回默认的清晰度")
                    return video_preview_play_info['live_transcoding_task_list'][-1]['url']
            else:
                if "AccessTokenInvalid" in response.text or "AccessTokenExpired" in response.text:
                    self.get_ali_token()
                    return self.get_video_preview_play_info(play_info_type, file_name, size, file_id, share_id)
                elif "NotFound.File" in response.text:
                    self.clear_root_file_json()
                    logger.error("获取普画下载链接失败,转存文件未找到,需要重新保存")
                    return self.get_video_preview_play_info(play_info_type, file_name, size, file_id, share_id)
                elif "This operation is forbidden for file in the recycle bin" in response.text:
                    self.clear_root_file_json()
                    logger.error("获取普画下载链接失败,转存文件被删除,需要重新保存")
                    return self.get_video_preview_play_info(play_info_type, file_name, size, file_id, share_id)
                else:
                    logger.error("获取普画下载链接失败,失败原因为:{}".format(response.text))

    def get_download_url(self, file_name, size, file_id, share_id):
        url = "https://open.aliyundrive.com/adrive/v1.0/openFile/getDownloadUrl"
        file_id = self.get_batch_file(file_name, size, file_id, share_id)
        if file_id:
            params = {"file_id": file_id, "drive_id": self.drive_id}
            headers = copy.copy(self.headers)
            headers["authorization"] = self.ali_json["qauth_token"]
            response = self.post(url, json.dumps(params), headers=headers)
            if response.status_code == 200:
                return response.json()["url"]
            else:
                if "AccessTokenInvalid" in response.text or "AccessTokenExpired" in response.text:
                    self.get_ali_token()
                    return self.get_download_url(file_name, size, file_id, share_id)
                elif "NotFound.File" in response.text:
                    self.clear_root_file_json()
                    logger.error("获取原画下载链接失败,转存文件未找到,需要重新保存")
                    return self.get_download_url(file_name, size, file_id, share_id)
                elif "This operation is forbidden for file in the recycle bin" in response.text:
                    self.clear_root_file_json()
                    logger.error("获取原画下载链接失败,转存文件被删除,需要重新保存")
                    return self.get_download_url(file_name, size, file_id, share_id)
                else:
                    logger.error("获取原画下载链接失败,失败原因为:{}".format(response.text))

    def delete_file(self, file_name):
        url = "https://api.aliyundrive.com/v2/recyclebin/trash"
        params = {"drive_id": self.drive_id, "file_id": self.root_file_json[file_name]["file_id"]}
        headers = copy.copy(self.headers)
        headers["authorization"] = self.ali_json["auth_token"]
        response = self.post(url, json.dumps(params), headers=headers)
        if response.status_code == 204:
            logger.info("删除成功,file id为:{}".format(self.root_file_json[file_name]["file_id"]))
            return True
        else:
            if "AccessTokenInvalid" in response.text:
                logger.error(
                    "删除失败,file id为:{},Token失效,重新登录".format(self.root_file_json[file_name]["file_id"],
                                                                      response.text))
                self.get_ali_login()
                self.delete_file(file_name)
            elif "NotFound.FileId" in response.text:
                del self.root_file_json[file_name]
                self.write_root_file_config()
            else:
                logger.error("删除失败,file id为:{},失败原因为:{}".format(file_id, response.text))

    def get_root_files(self):
        url = "https://api.aliyundrive.com/adrive/v3/file/list?jsonmask=next_marker%2Citems(name%2Cfile_id%2Cdrive_id%2Ctype%2Csize%2Ccreated_at%2Cupdated_at%2Ccategory%2Cfile_extension%2Cparent_file_id%2Cmime_type%2Cstarred%2Cthumbnail%2Curl%2Cstreams_info%2Ccontent_hash%2Cuser_tags%2Cuser_meta%2Ctrashed%2Cvideo_media_metadata%2Cvideo_preview_metadata%2Csync_meta%2Csync_device_flag%2Csync_flag%2Cpunish_flag)"
        params = {"all": True, "drive_id": self.drive_id, "fields": "*",
                  "image_thumbnail_process": "image/resize,w_256/format,avif",
                  "image_url_process": "image/resize,w_1920/format,avif", "limit": 200,
                  "order_by": "updated_at", "order_direction": "DESC",
                  "parent_file_id": "root", "url_expire_sec": 14400,
                  "video_thumbnail_process": "video/snapshot,t_120000,f_jpg,m_lfit,w_256,ar_auto,m_fast"
                  }
        headers = copy.copy(self.headers)
        headers["authorization"] = self.ali_json["auth_token"]
        response = self.post(url, json.dumps(params), headers=headers)
        if response.status_code == 200:
            res_json = response.json()
            for file in res_json["items"]:
                if file["type"] == "file":
                    self.root_file_json[file["name"]] = {}
                    self.root_file_json[file["name"]]["size"] = str(file["size"])
                    self.root_file_json[file["name"]]["file_id"] = file["file_id"]
                    self.write_root_file_config()
            logger.info("获取资源盘文件成功")
        elif "AccessTokenInvalid" in response.text:
            logger.error("获取资源盘文件失败,失败原因为:{},重新登录".format(response.text))
            self.get_ali_login()
            self.get_root_files()

    def get_batch_file(self, file_name, size, file_id, share_id):
        ## 如果文件存在就无需在保存
        is_exists = False
        try:
            if size == self.root_file_json[file_name]["size"]:
                is_exists = True
                logger.info("文件名称为:{},已存在,无需转存".format(file_name))
                return self.root_file_json[file_name]["file_id"]
        except:
            pass
        if is_exists is False:
            params = {
                "requests": [
                    {
                        "body": {
                            "file_id": file_id,
                            "share_id": share_id,
                            "auto_rename": True,
                            "to_parent_file_id": "root",
                            "to_drive_id": self.drive_id
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

            headers = copy.copy(self.headers)
            if share_id in list(self.ali_json.keys()):
                pass
            else:
                self.get_share_token(share_id)
            headers["x-share-token"] = self.ali_json[share_id]["share_token"]
            headers["authorization"] = self.ali_json["auth_token"]
            url = self.APIUrl + "/adrive/v2/batch"
            response = self.post(url, json.dumps(params), headers=headers)
            if response.status_code == 200:
                try:
                    res_json = response.json()["responses"][0]["body"]
                    self.root_file_json[file_name] = {}
                    self.root_file_json[file_name]["size"] = size
                    self.root_file_json[file_name]["file_id"] = res_json["file_id"]
                    logger.info("转存文件成功,文件名称为:{},file id为:{}".format(file_name, res_json["file_id"]))
                    self.write_root_file_config()
                    return res_json["file_id"]
                except:
                    if "QuotaExhausted.Drive" in response.text:
                        logger.error("转存文件失败,检查网盘容量是否已满")
                    else:
                        logger.error(
                            "转存文件失败,file id为:{},share id为:{},失败原因为:{}".format(file_id, share_id,
                                                                                           response.text))
                    return None
            else:
                logger.error("转存文件失败,失败原因为:{}".format(response.text))
                try:
                    res_json = response.json()
                    if res_json["message"] == "token expired" or res_json[
                        "message"] == "AccessToken is invalid. ErrValidateTokenFailed":
                        self.get_ali_token()
                        return self.get_batch_file(file_name, size, file_id, share_id)
                except:
                    pass

    def get_ali_login(self):
        url = "https://auth.aliyundrive.com/v2/account/token"
        params = {
            "refresh_token": "4636d4629ba44a68b207a2d2f4139298",
            "grant_type": "refresh_token"
        }
        response = self.post(url, json.dumps(params), headers=self.headers)
        if response.status_code != 200:
            logger.error("获取阿里登录失败,请尝试重新扫码获取Token,程序退出")
            sys.exit()
        else:
            self.ali_json["auth_token"] = response.json()['token_type'] + " " + response.json()['access_token']
            self.write_cache_config()

    def get_share_file_id(self, share_id):
        url = self.APIUrl + "/adrive/v3/share_link/get_share_by_anonymous"
        params = {
            "share_id": share_id
        }
        respose = self.post(url, data=json.dumps(params), headers=self.headers)
        if respose.status_code == 200:
            if (respose.json()["file_infos"][0]["type"]) == "file":
                return False, respose.json()["file_infos"][0]["file_id"]
            elif (respose.json()["file_infos"][0]["type"]) == "folder":
                return True, respose.json()["file_infos"][0]["file_id"]
        else:
            logger.error("获取分享文件ID失败,失败原因为:{}".format(respose.text))

    def get_share_token(self, share_id):
        url = self.APIUrl + "/v2/share_link/get_share_token"
        params = {
            "share_id": share_id
        }
        respose = self.post(url, data=json.dumps(params), headers=self.headers)
        if respose.status_code == 200:
            if share_id in list(self.ali_json.keys()):
                self.ali_json[share_id]["share_token"] = respose.json()["share_token"]
            else:
                self.ali_json[share_id] = {}
                self.ali_json[share_id]["share_token"] = respose.json()["share_token"]
            self.write_cache_config()
            logger.info("获取分享文件Token成功")
        else:
            logger.error("取分享文件Token失败,失败原因为:{}".format(respose.text))
            self.get_share_token(share_id)

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
        headers = copy.copy(self.headers)
        if share_id in list(self.ali_json.keys()):
            pass
        else:
            self.get_share_token(share_id)
        headers["x-share-token"] = self.ali_json[share_id]["share_token"]
        respose = self.post(url, data=json.dumps(params), headers=headers)
        if respose.status_code == 200:
            file_list = respose.json()["items"]
            for file_id in file_list:
                if file_id["type"] == 'folder':
                    is_floder = True
                    self.get_all_files(share_id, file_id["file_id"], video_file_list, sub_file_list, is_floder,
                                       parent=file_id["name"])
                elif file_id["type"] == "file":
                    file_id["parent"] = parent
                    if file_id["category"] == "video" or file_id["category"] == "audio":
                        video_file_list.append(file_id)
                    elif file_id["file_extension"] in ["srt", "ass", "ssa", "vtt"]:
                        sub_file_list.append(file_id)
        else:
            logger.error(
                "获取文件列表失败,在网页中确认分享链接是否存在:https://www.aliyundrive.com/s/{}/folder/{},失败原因为:{}".format(
                    share_id, file_id, respose.text))
            if respose.status_code == 429:
                time.sleep(10)
                self.get_all_files(share_id, file_id, video_file_list, sub_file_list, is_floder=is_floder, parent=None)
            elif respose.status_code == 401:
                self.get_share_token(share_id)
                self.get_all_files(share_id, file_id, video_file_list, sub_file_list, is_floder=is_floder, parent=None)
            elif respose.status_code == 400:
                self.get_share_token(share_id)
                self.get_all_files(share_id, file_id, video_file_list, sub_file_list, is_floder=is_floder, parent=None)
                # self.get_share_token(share_id)
                # self.get_all_files(share_id, file_id, video_file_list, sub_file_list, is_floder=is_floder, parent=None)
            else:
                pass

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
        headers = copy.copy(self.headers)
        headers["authorization"] = self.ali_json["auth_token"]
        respose = self.post(url, data=json.dumps(params), headers=headers)
        if respose.status_code != 200:
            if "not login" in respose.text:
                logger.error("获取Alist Code失败,失败原因为:{}".format("还未登录,请先登录"))
                self.get_ali_login()
                self.get_alist_code()
            elif "token expired" in respose.text:
                logger.error("获取Alist Code失败,失败原因为:{}".format("Token失效"))
                self.get_ali_login()
                self.get_alist_code()
            else:
                logger.error("获取Alist Code失败,失败原因为:{},重新获取Alist Code".format(respose.text))
                time.sleep(60)
                self.get_alist_code()
        else:
            self.alist_code = respose.json()["redirectUri"].split("code=")[-1]
            logger.info("Alist Code获取成功,Alist Code为:{}".format(self.alist_code))

    def get_ali_token(self):
        self.get_alist_code()
        try:
            self.get_access_token(self.alist_code)
        except:
            pass

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
        response = self.post(url, data=json.dumps(params), headers=self.headers)
        if response.status_code == 200:
            self.ali_json["qauth_token"] = response.json()['token_type'] + " " + response.json()['access_token']
            self.write_cache_config()
            logger.info("Access Token 获取成功")
        else:
            if "code not found" in response.text:
                logger.error("Access Token获取失败,失败原因为:{}".format("Alis Code获取失败,重新获取Alist Code"))
                self.get_ali_token()
            elif "Too Many Requests" in response.text:
                logger.error("Access Token获取失败,失败原因为:{},稍后重试".format("太多请求"))
                time.sleep(60)
                self.get_ali_token()

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
        try:
            area = (format['width'] * format['height'])
            if area < 2073600:
                return self.PlayFromat[0]
            elif area > 2073600:
                return self.PlayFromat[2]
            else:
                return self.PlayFromat[1]
        except:
            return "未知"

    def find_common_strings(self, string1, string2):
        set_1 = string1.split(".")
        set_2 = string2.split(".")
        return list(set(set_1).intersection(set(set_2)))

    def get_vod_name(self, share_url_list, page_title):
        video_file_list = []
        sub_file_list = []
        for share_url_dic in share_url_list:
            m = []
            if "www.aliyundrive.com" in share_url_dic["url"]:
                m = re.search('www.aliyundrive.com\\/s\\/([^\\/]+)(\\/folder\\/([^\\/]+))?',
                              share_url_dic["url"]).groups()
            elif "www.alipan.com" in share_url_dic["url"]:
                m = re.search('www.alipan.com\\/s\\/([^\\/]+)(\\/folder\\/([^\\/]+))?', share_url_dic["url"]).groups()
            else:
                logger.error("获取分享链接失败,暂不支持此分享链接:{}".format(share_url_dic["url"]))
            if len(m) > 0:
                share_id = m[0]
                is_floder, file_id = self.get_share_file_id(share_id)
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
            epi_str = display_name + "$" + video_file["name"] + "+++" + str(video_file["size"]) + "+++" + video_file[
                "share_id"] + "+++" + video_file["file_id"] + sub_str
            episode.append(epi_str)

        ## 自定义清晰度
        play_foramt_list = ["原画", "超清", "高清", "标清"]
        episode = ["#".join(episode)] * len(play_foramt_list)
        return "$$$".join(play_foramt_list), "$$$".join(episode)


class Spider(Spider):
    tree = None
    header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"}
    session = requests.session()
    home_url = 'https://tvfan.xxooo.cf'

    def fetch(self, url):
        try:
            rsp = self.session.get(url, headers=self.header)
            return rsp
        except Exception as e:
            logger.error("Get请求失败,失败原因为:{}".format(e))
            sys.exit()

    def getName(self):
        return "玩偶哥哥"

    def init(self, extend=""):
        logger.info("##################阿里玩偶爬虫脚本初始化完成##################")
        self.ali = Ali()
        pass

    ## 分类
    ## 分类
    def homeContent(self, filter=True):
        result = {"jx": 0, "parse": 0}
        classes = []
        start_time = time.time()
        rsp = self.fetch(self.home_url)
        logger.info("玩偶哥哥首页打开成功,耗时:{}s".format("%.2f" % (time.time() - start_time)))
        self.tree = html.fromstring(rsp.text)
        start_time = time.time()
        elements = self.tree.xpath('//a[contains(@class,"nav-link")]')
        index = 0
        for element in elements:
            type_name = element.xpath('text()')[0]
            index = index + 1
            if type_name != "test":
                classes.append({
                    'type_name': type_name,
                    'type_id': index
                })
        result['class'] = classes
        vod_list = self.parseVodListFromDoc(self.tree)
        result["list"] = vod_list
        result["filters"] = {
            "1": [
                {
                    "key": "3",
                    "name": "剧情",
                    "value": [
                        {
                            "n": "喜剧",
                            "v": "喜剧"
                        },
                        {
                            "n": "爱情",
                            "v": "爱情"
                        },
                        {
                            "n": "恐怖",
                            "v": "恐怖"
                        },
                        {
                            "n": "动作",
                            "v": "动作"
                        },
                        {
                            "n": "科幻",
                            "v": "科幻"
                        },
                        {
                            "n": "剧情",
                            "v": "剧情"
                        },
                        {
                            "n": "战争",
                            "v": "战争"
                        },
                        {
                            "n": "警匪",
                            "v": "警匪"
                        },
                        {
                            "n": "犯罪",
                            "v": "犯罪"
                        },
                        {
                            "n": "动画",
                            "v": "动画"
                        },
                        {
                            "n": "奇幻",
                            "v": "奇幻"
                        },
                        {
                            "n": "武侠",
                            "v": "武侠"
                        },
                        {
                            "n": "冒险",
                            "v": "冒险"
                        },
                        {
                            "n": "枪战",
                            "v": "枪战"
                        },
                        {
                            "n": "恐怖",
                            "v": "恐怖"
                        },
                        {
                            "n": "悬疑",
                            "v": "悬疑"
                        },
                        {
                            "n": "惊悚",
                            "v": "惊悚"
                        },
                        {
                            "n": "经典",
                            "v": "经典"
                        },
                        {
                            "n": "青春",
                            "v": "青春"
                        },
                        {
                            "n": "文艺",
                            "v": "文艺"
                        },
                        {
                            "n": "古装",
                            "v": "古装"
                        },
                        {
                            "n": "历史",
                            "v": "历史"
                        },
                        {
                            "n": "微电影",
                            "v": "微电影"
                        }
                    ]
                },
                {
                    "key": "1",
                    "name": "地区",
                    "value": [
                        {
                            "n": "大陆",
                            "v": "大陆"
                        },
                        {
                            "n": "香港",
                            "v": "香港"
                        },
                        {
                            "n": "台湾",
                            "v": "台湾"
                        },
                        {
                            "n": "美国",
                            "v": "美国"
                        },
                        {
                            "n": "法国",
                            "v": "法国"
                        },
                        {
                            "n": "英国",
                            "v": "英国"
                        },
                        {
                            "n": "日本",
                            "v": "日本"
                        },
                        {
                            "n": "韩国",
                            "v": "韩国"
                        },
                        {
                            "n": "德国",
                            "v": "德国"
                        },
                        {
                            "n": "泰国",
                            "v": "泰国"
                        },
                        {
                            "n": "印度",
                            "v": "印度"
                        },
                        {
                            "n": "意大利",
                            "v": "意大利"
                        },
                        {
                            "n": "西班牙",
                            "v": "西班牙"
                        },
                        {
                            "n": "加拿大",
                            "v": "加拿大"
                        },
                        {
                            "n": "其他",
                            "v": "其他"
                        }
                    ]
                },
                {
                    "key": "11",
                    "name": "年份",
                    "value": [
                        {
                            "n": "2023",
                            "v": "2023"
                        },
                        {
                            "n": "2022",
                            "v": "2022"
                        },
                        {
                            "n": "2021",
                            "v": "2021"
                        },
                        {
                            "n": "2020",
                            "v": "2020"
                        },
                        {
                            "n": "2019",
                            "v": "2019"
                        },
                        {
                            "n": "2018",
                            "v": "2018"
                        },
                        {
                            "n": "2017",
                            "v": "2017"
                        },
                        {
                            "n": "2016",
                            "v": "2016"
                        },
                        {
                            "n": "2015",
                            "v": "2015"
                        },
                        {
                            "n": "2014",
                            "v": "2014"
                        },
                        {
                            "n": "2013",
                            "v": "2013"
                        },
                        {
                            "n": "2012",
                            "v": "2012"
                        },
                        {
                            "n": "2011",
                            "v": "2011"
                        },
                        {
                            "n": "2010",
                            "v": "2010"
                        }
                    ]
                },
                {
                    "key": "5",
                    "name": "字母",
                    "value": [
                        {
                            "n": "A",
                            "v": "A"
                        },
                        {
                            "n": "B",
                            "v": "B"
                        },
                        {
                            "n": "C",
                            "v": "C"
                        },
                        {
                            "n": "D",
                            "v": "D"
                        },
                        {
                            "n": "E",
                            "v": "E"
                        },
                        {
                            "n": "F",
                            "v": "F"
                        },
                        {
                            "n": "G",
                            "v": "G"
                        },
                        {
                            "n": "H",
                            "v": "H"
                        },
                        {
                            "n": "I",
                            "v": "I"
                        },
                        {
                            "n": "J",
                            "v": "J"
                        },
                        {
                            "n": "K",
                            "v": "K"
                        },
                        {
                            "n": "L",
                            "v": "L"
                        },
                        {
                            "n": "M",
                            "v": "M"
                        },
                        {
                            "n": "N",
                            "v": "N"
                        },
                        {
                            "n": "O",
                            "v": "O"
                        },
                        {
                            "n": "P",
                            "v": "P"
                        },
                        {
                            "n": "Q",
                            "v": "Q"
                        },
                        {
                            "n": "R",
                            "v": "R"
                        },
                        {
                            "n": "S",
                            "v": "S"
                        },
                        {
                            "n": "T",
                            "v": "T"
                        },
                        {
                            "n": "U",
                            "v": "U"
                        },
                        {
                            "n": "V",
                            "v": "V"
                        },
                        {
                            "n": "W",
                            "v": "W"
                        },
                        {
                            "n": "X",
                            "v": "X"
                        },
                        {
                            "n": "Y",
                            "v": "Y"
                        },
                        {
                            "n": "Z",
                            "v": "Z"
                        },
                        {
                            "n": "0-9",
                            "v": "0-9"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "排序",
                    "value": [
                        {
                            "n": "时间",
                            "v": "time"
                        },
                        {
                            "n": "人气",
                            "v": "hits"
                        },
                        {
                            "n": "评分",
                            "v": "score"
                        }
                    ]
                }
            ],
            "20": [
                {
                    "key": "1",
                    "name": "地区",
                    "value": [
                        {
                            "n": "大陆",
                            "v": "大陆"
                        },
                        {
                            "n": "香港",
                            "v": "香港"
                        },
                        {
                            "n": "台湾",
                            "v": "台湾"
                        },
                        {
                            "n": "美国",
                            "v": "美国"
                        },
                        {
                            "n": "法国",
                            "v": "法国"
                        },
                        {
                            "n": "英国",
                            "v": "英国"
                        },
                        {
                            "n": "日本",
                            "v": "日本"
                        },
                        {
                            "n": "韩国",
                            "v": "韩国"
                        },
                        {
                            "n": "德国",
                            "v": "德国"
                        },
                        {
                            "n": "泰国",
                            "v": "泰国"
                        },
                        {
                            "n": "印度",
                            "v": "印度"
                        },
                        {
                            "n": "意大利",
                            "v": "意大利"
                        },
                        {
                            "n": "西班牙",
                            "v": "西班牙"
                        },
                        {
                            "n": "加拿大",
                            "v": "加拿大"
                        },
                        {
                            "n": "其他",
                            "v": "其他"
                        }
                    ]
                },
                {
                    "key": "4",
                    "name": "语言",
                    "value": [
                        {
                            "n": "国语",
                            "v": "国语"
                        },
                        {
                            "n": "英语",
                            "v": "英语"
                        },
                        {
                            "n": "粤语",
                            "v": "粤语"
                        },
                        {
                            "n": "闽南语",
                            "v": "闽南语"
                        },
                        {
                            "n": "韩语",
                            "v": "韩语"
                        },
                        {
                            "n": "日语",
                            "v": "日语"
                        },
                        {
                            "n": "法语",
                            "v": "法语"
                        },
                        {
                            "n": "德语",
                            "v": "德语"
                        },
                        {
                            "n": "其它",
                            "v": "其它"
                        }
                    ]
                },
                {
                    "key": "11",
                    "name": "年份",
                    "value": [
                        {
                            "n": "2023",
                            "v": "2023"
                        },
                        {
                            "n": "2022",
                            "v": "2022"
                        },
                        {
                            "n": "2021",
                            "v": "2021"
                        },
                        {
                            "n": "2020",
                            "v": "2020"
                        },
                        {
                            "n": "2019",
                            "v": "2019"
                        },
                        {
                            "n": "2018",
                            "v": "2018"
                        },
                        {
                            "n": "2017",
                            "v": "2017"
                        },
                        {
                            "n": "2016",
                            "v": "2016"
                        },
                        {
                            "n": "2015",
                            "v": "2015"
                        },
                        {
                            "n": "2014",
                            "v": "2014"
                        },
                        {
                            "n": "2013",
                            "v": "2013"
                        },
                        {
                            "n": "2012",
                            "v": "2012"
                        },
                        {
                            "n": "2011",
                            "v": "2011"
                        },
                        {
                            "n": "2010",
                            "v": "2010"
                        }
                    ]
                },
                {
                    "key": "5",
                    "name": "字母",
                    "value": [
                        {
                            "n": "A",
                            "v": "A"
                        },
                        {
                            "n": "B",
                            "v": "B"
                        },
                        {
                            "n": "C",
                            "v": "C"
                        },
                        {
                            "n": "D",
                            "v": "D"
                        },
                        {
                            "n": "E",
                            "v": "E"
                        },
                        {
                            "n": "F",
                            "v": "F"
                        },
                        {
                            "n": "G",
                            "v": "G"
                        },
                        {
                            "n": "H",
                            "v": "H"
                        },
                        {
                            "n": "I",
                            "v": "I"
                        },
                        {
                            "n": "J",
                            "v": "J"
                        },
                        {
                            "n": "K",
                            "v": "K"
                        },
                        {
                            "n": "L",
                            "v": "L"
                        },
                        {
                            "n": "M",
                            "v": "M"
                        },
                        {
                            "n": "N",
                            "v": "N"
                        },
                        {
                            "n": "O",
                            "v": "O"
                        },
                        {
                            "n": "P",
                            "v": "P"
                        },
                        {
                            "n": "Q",
                            "v": "Q"
                        },
                        {
                            "n": "R",
                            "v": "R"
                        },
                        {
                            "n": "S",
                            "v": "S"
                        },
                        {
                            "n": "T",
                            "v": "T"
                        },
                        {
                            "n": "U",
                            "v": "U"
                        },
                        {
                            "n": "V",
                            "v": "V"
                        },
                        {
                            "n": "W",
                            "v": "W"
                        },
                        {
                            "n": "X",
                            "v": "X"
                        },
                        {
                            "n": "Y",
                            "v": "Y"
                        },
                        {
                            "n": "Z",
                            "v": "Z"
                        },
                        {
                            "n": "0-9",
                            "v": "0-9"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "排序",
                    "value": [
                        {
                            "n": "时间",
                            "v": "time"
                        },
                        {
                            "n": "人气",
                            "v": "hits"
                        },
                        {
                            "n": "评分",
                            "v": "score"
                        }
                    ]
                }
            ],
            "24": [
                {
                    "key": "1",
                    "name": "地区",
                    "value": [
                        {
                            "n": "大陆",
                            "v": "大陆"
                        },
                        {
                            "n": "香港",
                            "v": "香港"
                        },
                        {
                            "n": "台湾",
                            "v": "台湾"
                        },
                        {
                            "n": "美国",
                            "v": "美国"
                        },
                        {
                            "n": "法国",
                            "v": "法国"
                        },
                        {
                            "n": "英国",
                            "v": "英国"
                        },
                        {
                            "n": "日本",
                            "v": "日本"
                        },
                        {
                            "n": "韩国",
                            "v": "韩国"
                        },
                        {
                            "n": "德国",
                            "v": "德国"
                        },
                        {
                            "n": "泰国",
                            "v": "泰国"
                        },
                        {
                            "n": "印度",
                            "v": "印度"
                        },
                        {
                            "n": "意大利",
                            "v": "意大利"
                        },
                        {
                            "n": "西班牙",
                            "v": "西班牙"
                        },
                        {
                            "n": "加拿大",
                            "v": "加拿大"
                        },
                        {
                            "n": "其他",
                            "v": "其他"
                        }
                    ]
                },
                {
                    "key": "4",
                    "name": "语言",
                    "value": [
                        {
                            "n": "国语",
                            "v": "国语"
                        },
                        {
                            "n": "英语",
                            "v": "英语"
                        },
                        {
                            "n": "粤语",
                            "v": "粤语"
                        },
                        {
                            "n": "闽南语",
                            "v": "闽南语"
                        },
                        {
                            "n": "韩语",
                            "v": "韩语"
                        },
                        {
                            "n": "日语",
                            "v": "日语"
                        },
                        {
                            "n": "法语",
                            "v": "法语"
                        },
                        {
                            "n": "德语",
                            "v": "德语"
                        },
                        {
                            "n": "其它",
                            "v": "其它"
                        }
                    ]
                },
                {
                    "key": "11",
                    "name": "年份",
                    "value": [
                        {
                            "n": "2023",
                            "v": "2023"
                        },
                        {
                            "n": "2022",
                            "v": "2022"
                        },
                        {
                            "n": "2021",
                            "v": "2021"
                        },
                        {
                            "n": "2020",
                            "v": "2020"
                        },
                        {
                            "n": "2019",
                            "v": "2019"
                        },
                        {
                            "n": "2018",
                            "v": "2018"
                        },
                        {
                            "n": "2017",
                            "v": "2017"
                        },
                        {
                            "n": "2016",
                            "v": "2016"
                        },
                        {
                            "n": "2015",
                            "v": "2015"
                        },
                        {
                            "n": "2014",
                            "v": "2014"
                        },
                        {
                            "n": "2013",
                            "v": "2013"
                        },
                        {
                            "n": "2012",
                            "v": "2012"
                        },
                        {
                            "n": "2011",
                            "v": "2011"
                        },
                        {
                            "n": "2010",
                            "v": "2010"
                        }
                    ]
                },
                {
                    "key": "5",
                    "name": "字母",
                    "value": [
                        {
                            "n": "A",
                            "v": "A"
                        },
                        {
                            "n": "B",
                            "v": "B"
                        },
                        {
                            "n": "C",
                            "v": "C"
                        },
                        {
                            "n": "D",
                            "v": "D"
                        },
                        {
                            "n": "E",
                            "v": "E"
                        },
                        {
                            "n": "F",
                            "v": "F"
                        },
                        {
                            "n": "G",
                            "v": "G"
                        },
                        {
                            "n": "H",
                            "v": "H"
                        },
                        {
                            "n": "I",
                            "v": "I"
                        },
                        {
                            "n": "J",
                            "v": "J"
                        },
                        {
                            "n": "K",
                            "v": "K"
                        },
                        {
                            "n": "L",
                            "v": "L"
                        },
                        {
                            "n": "M",
                            "v": "M"
                        },
                        {
                            "n": "N",
                            "v": "N"
                        },
                        {
                            "n": "O",
                            "v": "O"
                        },
                        {
                            "n": "P",
                            "v": "P"
                        },
                        {
                            "n": "Q",
                            "v": "Q"
                        },
                        {
                            "n": "R",
                            "v": "R"
                        },
                        {
                            "n": "S",
                            "v": "S"
                        },
                        {
                            "n": "T",
                            "v": "T"
                        },
                        {
                            "n": "U",
                            "v": "U"
                        },
                        {
                            "n": "V",
                            "v": "V"
                        },
                        {
                            "n": "W",
                            "v": "W"
                        },
                        {
                            "n": "X",
                            "v": "X"
                        },
                        {
                            "n": "Y",
                            "v": "Y"
                        },
                        {
                            "n": "Z",
                            "v": "Z"
                        },
                        {
                            "n": "0-9",
                            "v": "0-9"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "排序",
                    "value": [
                        {
                            "n": "时间",
                            "v": "time"
                        },
                        {
                            "n": "人气",
                            "v": "hits"
                        },
                        {
                            "n": "评分",
                            "v": "score"
                        }
                    ]
                }
            ],
            "28": [
                {
                    "key": "1",
                    "name": "地区",
                    "value": [
                        {
                            "n": "国产",
                            "v": "国产"
                        },
                        {
                            "n": "日韩",
                            "v": "日韩"
                        },
                        {
                            "n": "欧美",
                            "v": "欧美"
                        }
                    ]
                },
                {
                    "key": "11",
                    "name": "年份",
                    "value": [
                        {
                            "n": "2023",
                            "v": "2023"
                        },
                        {
                            "n": "2022",
                            "v": "2022"
                        },
                        {
                            "n": "2021",
                            "v": "2021"
                        },
                        {
                            "n": "2020",
                            "v": "2020"
                        },
                        {
                            "n": "2019",
                            "v": "2019"
                        },
                        {
                            "n": "2018",
                            "v": "2018"
                        },
                        {
                            "n": "2017",
                            "v": "2017"
                        },
                        {
                            "n": "2016",
                            "v": "2016"
                        },
                        {
                            "n": "2015",
                            "v": "2015"
                        },
                        {
                            "n": "2014",
                            "v": "2014"
                        },
                        {
                            "n": "2013",
                            "v": "2013"
                        },
                        {
                            "n": "2012",
                            "v": "2012"
                        },
                        {
                            "n": "2011",
                            "v": "2011"
                        },
                        {
                            "n": "2010",
                            "v": "2010"
                        }
                    ]
                },
                {
                    "key": "5",
                    "name": "字母",
                    "value": [
                        {
                            "n": "A",
                            "v": "A"
                        },
                        {
                            "n": "B",
                            "v": "B"
                        },
                        {
                            "n": "C",
                            "v": "C"
                        },
                        {
                            "n": "D",
                            "v": "D"
                        },
                        {
                            "n": "E",
                            "v": "E"
                        },
                        {
                            "n": "F",
                            "v": "F"
                        },
                        {
                            "n": "G",
                            "v": "G"
                        },
                        {
                            "n": "H",
                            "v": "H"
                        },
                        {
                            "n": "I",
                            "v": "I"
                        },
                        {
                            "n": "J",
                            "v": "J"
                        },
                        {
                            "n": "K",
                            "v": "K"
                        },
                        {
                            "n": "L",
                            "v": "L"
                        },
                        {
                            "n": "M",
                            "v": "M"
                        },
                        {
                            "n": "N",
                            "v": "N"
                        },
                        {
                            "n": "O",
                            "v": "O"
                        },
                        {
                            "n": "P",
                            "v": "P"
                        },
                        {
                            "n": "Q",
                            "v": "Q"
                        },
                        {
                            "n": "R",
                            "v": "R"
                        },
                        {
                            "n": "S",
                            "v": "S"
                        },
                        {
                            "n": "T",
                            "v": "T"
                        },
                        {
                            "n": "U",
                            "v": "U"
                        },
                        {
                            "n": "V",
                            "v": "V"
                        },
                        {
                            "n": "W",
                            "v": "W"
                        },
                        {
                            "n": "X",
                            "v": "X"
                        },
                        {
                            "n": "Y",
                            "v": "Y"
                        },
                        {
                            "n": "Z",
                            "v": "Z"
                        },
                        {
                            "n": "0-9",
                            "v": "0-9"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "排序",
                    "value": [
                        {
                            "n": "时间",
                            "v": "time"
                        },
                        {
                            "n": "人气",
                            "v": "hits"
                        },
                        {
                            "n": "评分",
                            "v": "score"
                        }
                    ]
                }
            ],
            "32": [
                {
                    "key": "5",
                    "name": "字母",
                    "value": [
                        {
                            "n": "A",
                            "v": "A"
                        },
                        {
                            "n": "B",
                            "v": "B"
                        },
                        {
                            "n": "C",
                            "v": "C"
                        },
                        {
                            "n": "D",
                            "v": "D"
                        },
                        {
                            "n": "E",
                            "v": "E"
                        },
                        {
                            "n": "F",
                            "v": "F"
                        },
                        {
                            "n": "G",
                            "v": "G"
                        },
                        {
                            "n": "H",
                            "v": "H"
                        },
                        {
                            "n": "I",
                            "v": "I"
                        },
                        {
                            "n": "J",
                            "v": "J"
                        },
                        {
                            "n": "K",
                            "v": "K"
                        },
                        {
                            "n": "L",
                            "v": "L"
                        },
                        {
                            "n": "M",
                            "v": "M"
                        },
                        {
                            "n": "N",
                            "v": "N"
                        },
                        {
                            "n": "O",
                            "v": "O"
                        },
                        {
                            "n": "P",
                            "v": "P"
                        },
                        {
                            "n": "Q",
                            "v": "Q"
                        },
                        {
                            "n": "R",
                            "v": "R"
                        },
                        {
                            "n": "S",
                            "v": "S"
                        },
                        {
                            "n": "T",
                            "v": "T"
                        },
                        {
                            "n": "U",
                            "v": "U"
                        },
                        {
                            "n": "V",
                            "v": "V"
                        },
                        {
                            "n": "W",
                            "v": "W"
                        },
                        {
                            "n": "X",
                            "v": "X"
                        },
                        {
                            "n": "Y",
                            "v": "Y"
                        },
                        {
                            "n": "Z",
                            "v": "Z"
                        },
                        {
                            "n": "0-9",
                            "v": "0-9"
                        }
                    ]
                },
                {
                    "key": "2",
                    "name": "排序",
                    "value": [
                        {
                            "n": "时间",
                            "v": "time"
                        },
                        {
                            "n": "人气",
                            "v": "hits"
                        },
                        {
                            "n": "评分",
                            "v": "score"
                        }
                    ]
                }
            ]
        }
        logger.info("处理玩偶哥哥首页信息成功,耗时:{}s".format(("%.2f" % (time.time() - start_time))))
        return result

    def parseVodListFromDoc(self, doc):
        vod_list = []
        elements = doc.xpath('//div[@class="module-item"]')
        for element in elements:
            module_item_pic = element.xpath('div/div[@class="module-item-pic"]')[0]
            vod_id = module_item_pic.xpath('a/@href')[0]
            vod_name = module_item_pic.xpath('a/@title')[0]
            vod_pic = module_item_pic.find("img").get("data-src")
            if "/img.php?url=" in vod_pic:
                vod_pic = vod_pic.split("/img.php?url=")[-1]
            remarks = element.findtext('div[@class="module-item-text"]')
            vod_list.append({
                "vod_id": vod_id,
                "vod_name": vod_name,
                "vod_pic": vod_pic,
                "vod_remarks": remarks
            })
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
            file_id = id_list[3].split("+")[0]
            sub_id_list = id_list[3].split("+")[1].split("@@@")
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
        return [200, "video/MP2T", action, ""]
