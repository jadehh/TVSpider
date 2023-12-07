#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_douban.py
# @Author   : jade
# @Date     : 2023/11/24 10:46
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import shutil
import requests
import time
import os
import logging
import logging.config
import json
import re
import copy
import sys
from lxml import etree
from bs4 import BeautifulSoup
from abc import abstractmethod, ABCMeta
from importlib.machinery import SourceFileLoader
from datetime import datetime
from urllib import parse
import base64
import hmac
import hashlib
import urllib3
from urllib3.exceptions import InsecureRequestWarning
urllib3.disable_warnings(InsecureRequestWarning)
from random import choice
LocalAddress = "http://192.168.29.156:8099"
#LocalAddress = "https://gh.con.sh/https://raw.githubusercontent.com/jadehh/TV/py"

class VodShort(object):
    def __init__(self):
        self.vod_id = ""  ## id
        self.vod_name = ""  ## 名称
        self.vod_pic = "{}/jpg/ali.jpg".format(LocalAddress)  ## 图片
        self.vod_remarks = ""  ## 备注

    def to_dict(self):
        dic = {}
        for item in self.__dict__.items():
            dic[item[0]] = item[1]
        return dic

    def load_dic(self, dic):
        for key in list(dic.keys()):
            if key in list(self.to_dict().keys()):
                setattr(self, key, dic[key])


class VodDetail(VodShort):
    def __init__(self):
        super().__init__()
        self.type_name = ""  ## 类别
        self.vod_year = ""  ## 年份
        self.vod_area = ""  ## 地区
        self.vod_actor = ""  ## 导演
        self.vod_director = ""  ## 演员
        self.vod_content = ""  ## 剧情
        self.vod_play_from = ""  ## 播放格式
        self.vod_play_url = ""  ## 播放连接

    def to_short(self):
        vodShort = VodShort()
        vodShort.load_dic(self.to_dict())
        return vodShort.to_dict()
class Logger(object):
    def __init__(self, name):
        self.name = name
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

    def get_logger(self):
        return logging.getLogger(self.name)
class Ali():
    def __init__(self):
        self.logger = Logger("阿里云盘").get_logger()
        self.APIUrl = "https://api.aliyundrive.com"
        self.PlayFromat = ["超清(720P)", "高清(1080P)", "超清(4k)"]
        self.ali_json = {"auth_token": "test",
                         "qauth_token": "test",
                         "drive_id": "test"}
        self.headers = {'Content-Type': 'application/json',
                        "X-Canary": "client=Android,app=adrive,version=v4.3.1",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
                        "Referer": "https://www.aliyundrive.com/"}
        self.max_free_size = 500  ## 云盘剩余容量
        self.root_file_json = {}
        self.load_cache_config()
        self.load_root_file_config()
        self.clear_root_file_json()
        self.definition_dic = {"高清": 'FHD', "超清": 'HD', "标清": 'SD'}
        # self.clear_file_by_size()

    def getDriveId(self):
        headers = copy.copy(self.headers)
        url = "https://user.aliyundrive.com/v2/user/get"
        headers["authorization"] = self.ali_json["auth_token"]
        response = self.post(url, json.dumps({}), headers=headers)
        if response.status_code == 200:
            self.ali_json["drive_id"] = response.json()["default_drive_id"]
            self.write_cache_config()
            self.logger.info("获取drive ID成功")
        else:
            self.logger.error("获取drive ID失败:失败原因为:{}".format(response.text))

    def post(self, url, data, headers):
        try:
            rsp = requests.post(url, data=data, headers=headers)
            return rsp
        except Exception as e:
            self.logger.error("Post请求失败,失败原因为:{}".format(e))
            sys.exit()

    def clear_root_file_json(self):
        for file_name in list(self.root_file_json.keys()):
            try:
                delete_status = self.delete_by_file_id(self.root_file_json[file_name]["file_id"])
            except Exception as e:
                self.logger.error("删除失败,失败原因为:名称为:{},无法找出file id".format(file_name))
            del self.root_file_json[file_name]
        self.write_root_file_config()
        self.logger.info("初始化阿里云盘,删除缓存的文件")

    def remove_config(self):
        try:
            os.remove(os.path.join(os.environ["HOME"], "ali.json"))
            self.logger.info("删除ali.json成功")
        except:
            pass
        try:
            os.remove(os.path.join(os.environ["HOME"], "root_file.json"))
            self.logger.info("删除root_file.json成功")
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
            f.write(json.dumps(self.ali_json, indent=True, ensure_ascii=False).encode("utf-8"))

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
            f.write(json.dumps(self.root_file_json, indent=4, ensure_ascii=False).encode("utf-8"))

    ## 获取云盘容量
    def get_drive_free_space(self):
        url = "https://api.aliyundrive.com/adrive/v1/user/driveCapacityDetails"
        headers = copy.copy(self.headers)
        headers["authorization"] = self.ali_json["auth_token"]
        response = self.post(url, json.dumps({}), headers=headers)
        if response.status_code == 200:
            rsp_json = response.json()
            drive_total_size = rsp_json['drive_total_size']
            drive_used_size = rsp_json['drive_used_size']
            drive_free_size = int((drive_total_size - drive_used_size) / 1024 / 1024 / 1024)
            self.logger.info("云盘剩余容量为:{}GB".format(drive_free_size))
            if drive_free_size < self.max_free_size:
                self.logger.warning("云盘剩余容量不足:{}GB,需要清理云盘容量".format(self.max_free_size))
                return True
            else:
                self.logger.info("云盘剩余容量还充足,无需清理")
                return False
        else:
            self.logger.error("访问云盘容量失败,失败原因为:{}".format(response.text))
            return False

    ## 通过文件大小去及时清空缓存
    def clear_file_by_size(self):
        status = self.get_drive_free_space()
        if status:
            url = "https://api.aliyundrive.com/adrive/v3/file/list?jsonmask=next_marker%2Citems(name%2Cfile_id%2Cdrive_id%2Ctype%2Csize%2Ccreated_at%2Cupdated_at%2Ccategory%2Cfile_extension%2Cparent_file_id%2Cmime_type%2Cstarred%2Cthumbnail%2Curl%2Cstreams_info%2Ccontent_hash%2Cuser_tags%2Cuser_meta%2Ctrashed%2Cvideo_media_metadata%2Cvideo_preview_metadata%2Csync_meta%2Csync_device_flag%2Csync_flag%2Cpunish_flag"
            headers = copy.copy(self.headers)
            params = {"all": False,
                      "drive_id": self.ali_json["drive_id"],
                      "fields": "*",
                      "image_thumbnail_process": "image/resize,w_256/format,avif",
                      "image_url_process": "image/resize,w_1920/format,avif",
                      "limit": 100,
                      "order_by": "updated_at",
                      "order_direction": "DESC",
                      "parent_file_id": "root",
                      "url_expire_sec": 14400,
                      "video_thumbnail_process": "video/snapshot,t_120000,f_jpg,m_lfit,w_256,ar_auto,m_fast"}
            headers["authorization"] = self.ali_json["auth_token"]
            response = self.post(url, json.dumps(params), headers=headers)
            if response.status_code == 200:
                rsp_json = response.json()
                self.delete_video_file(rsp_json["items"])
                self.root_file_json = {}
                self.write_root_file_config()
            else:
                self.logger.error("清除文件失败,失败原因为:{}".format(response.text))

    def delete_video_file(self,items):
        for item in items:
            if item["type"] == "file":
                if item["category"] == "video" or item["category"] == "audio":
                    self.delete_by_file_id(item["file_id"])

    def get_download_url(self, file_name, size, file_id, share_id):
        url = "https://open.aliyundrive.com/adrive/v1.0/openFile/getDownloadUrl"
        file_id = self.get_batch_file(file_name, size, file_id, share_id)
        if file_id:
            params = {"file_id": file_id, "drive_id": self.ali_json["drive_id"]}
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
                    self.logger.error("获取原画下载链接失败,转存文件未找到,需要重新保存")
                    return self.get_download_url(file_name, size, file_id, share_id)
                elif "This operation is forbidden for file in the recycle bin" in response.text:
                    self.clear_root_file_json()
                    self.logger.error("获取原画下载链接失败,转存文件被删除,需要重新保存")
                    return self.get_download_url(file_name, size, file_id, share_id)
                elif "Failed to invoke the method" in response.text:
                    self.logger.error("获取原画下载链接失败,重新获取")
                    return self.get_download_url(file_name, size, file_id, share_id)
                else:
                    self.logger.error("获取原画下载链接失败,失败原因为:{}".format(response.text))

    def get_video_preview_play_info(self, play_info_type, file_name, size, file_id, share_id):
        url = "https://open.aliyundrive.com/adrive/v1.0/openFile/getVideoPreviewPlayInfo"
        file_id = self.get_batch_file(file_name, size, file_id, share_id)
        if file_id:
            headers = copy.copy(self.headers)
            headers["authorization"] = self.ali_json["qauth_token"]
            params = {"file_id": file_id, "drive_id": self.ali_json["drive_id"], "category": "live_transcoding",
                      "url_expire_sec": "14400"}
            response = self.post(url, json.dumps(params), headers=headers)
            if response.status_code == 200:
                video_preview_play_info = response.json()['video_preview_play_info']
                try:
                    definition = self.definition_dic[play_info_type]
                    for live_transcoding_task in video_preview_play_info['live_transcoding_task_list']:
                        if live_transcoding_task['template_id'] == definition:
                            self.logger.info("清晰度为:{}".format(play_info_type))
                            return live_transcoding_task["url"]
                except:
                    self.logger.warn("没有对应的清晰度,返回默认的清晰度")
                    return video_preview_play_info['live_transcoding_task_list'][-1]['url']
            else:
                if "AccessTokenInvalid" in response.text or "AccessTokenExpired" in response.text:
                    self.get_ali_token()
                    return self.get_video_preview_play_info(play_info_type, file_name, size, file_id, share_id)
                elif "NotFound.File" in response.text:
                    self.clear_root_file_json()
                    self.logger.error("获取普画下载链接失败,转存文件未找到,需要重新保存")
                    return self.get_video_preview_play_info(play_info_type, file_name, size, file_id, share_id)
                elif "This operation is forbidden for file in the recycle bin" in response.text:
                    self.clear_root_file_json()
                    self.logger.error("获取普画下载链接失败,转存文件被删除,需要重新保存")
                    return self.get_video_preview_play_info(play_info_type, file_name, size, file_id, share_id)
                else:
                    self.logger.error("获取普画下载链接失败,失败原因为:{}".format(response.text))

    def delete_by_file_id(self,file_id):
        url = "https://api.aliyundrive.com/v2/recyclebin/trash"
        params = {"drive_id": self.ali_json["drive_id"], "file_id": file_id}
        headers = copy.copy(self.headers)
        headers["authorization"] = self.ali_json["auth_token"]
        response = self.post(url, json.dumps(params), headers=headers)
        if response.status_code == 204:
            self.logger.info("删除成功,file id为:{}".format(file_id))
        else:
            if "AccessTokenInvalid" in response.text:
                self.logger.error(
                    "删除失败,file id为:{},Token失效,重新登录".format(file_id))
                self.get_ali_login()
                self.delete_by_file_id(file_id)
            else:
                self.logger.error( "删除失败,file id为:{},失败原因为:{}".format(file_id,response.text))

    def get_root_files(self):
        url = "https://api.aliyundrive.com/adrive/v3/file/list?jsonmask=next_marker%2Citems(name%2Cfile_id%2Cdrive_id%2Ctype%2Csize%2Ccreated_at%2Cupdated_at%2Ccategory%2Cfile_extension%2Cparent_file_id%2Cmime_type%2Cstarred%2Cthumbnail%2Curl%2Cstreams_info%2Ccontent_hash%2Cuser_tags%2Cuser_meta%2Ctrashed%2Cvideo_media_metadata%2Cvideo_preview_metadata%2Csync_meta%2Csync_device_flag%2Csync_flag%2Cpunish_flag)"
        params = {"all": True, "drive_id": self.ali_json["drive_id"], "fields": "*",
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
            self.logger.info("获取资源盘文件成功")
        elif "AccessTokenInvalid" in response.text:
            self.logger.error("获取资源盘文件失败,失败原因为:{},重新登录".format(response.text))
            self.get_ali_login()
            self.get_root_files()

    def get_batch_file(self, file_name, size, file_id, share_id):
        ## 如果文件存在就无需在保存
        is_exists = False
        try:
            if size == self.root_file_json[file_name]["size"]:
                is_exists = True
                self.logger.info("文件名称为:{},已存在,无需转存".format(file_name))
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
                            "to_drive_id": self.ali_json["drive_id"]
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
                    self.logger.info("转存文件成功,文件名称为:{},file id为:{}".format(file_name, res_json["file_id"]))
                    self.write_root_file_config()
                    return res_json["file_id"]
                except:
                    if "QuotaExhausted.Drive" in response.text:
                        self.logger.error("转存文件失败,检查网盘容量是否已满")
                        self.clear_file_by_size()
                    else:
                        if "No Permission to access resource File" in response.text or "The resource drive cannot be found" in response.text:
                            self.getDriveId()
                            self.clear_root_file_json()
                            return self.get_batch_file(file_name, size, file_id, share_id)
                        else:
                            self.logger.error(
                                "转存文件失败,file id为:{},share id为:{},失败原因为:{}".format(file_id, share_id,
                                                                                               response.text))
                            return None
            else:
                self.logger.error("转存文件失败,失败原因为:{}".format(response.text))
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
            "refresh_token": "86c442348ffa42e882506502c557cd34",
            "grant_type": "refresh_token"
        }
        response = self.post(url, json.dumps(params), headers=self.headers)
        if response.status_code != 200:
            self.logger.error("获取阿里登录失败,请尝试重新扫码获取Token,程序退出")
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
        share_url = "https://www.aliyundrive.com/s/{}".format(share_id)

        if respose.status_code == 200:
            self.logger.info("获取分享文件成功,分享链接为:{}".format(share_url))
            if (respose.json()["file_infos"][0]["type"]) == "file":
                return False, respose.json()["file_infos"][0]["file_id"]
            elif (respose.json()["file_infos"][0]["type"]) == "folder":
                return True, respose.json()["file_infos"][0]["file_id"]
        else:
            if "share_link is forbidden" in respose.text:
                self.logger.error("获取分享文件ID失败,分享链接为:{},分享被禁掉啦!!!".format(share_url, respose.text))
            else:
                self.logger.error("获取分享文件ID失败,分享链接为:{},失败原因为:{}".format(share_url, respose.text))
            return False, None

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
            self.logger.info("获取分享文件Token成功")
        else:
            self.logger.error("获取分享文件Token失败,失败原因为:{}".format(respose.text))
            if "TooManyRequests" in respose.text:
                time.sleep(10)
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
            self.logger.error(
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
                self.logger.error("获取Alist Code失败,失败原因为:{}".format("还未登录,请先登录"))
                self.get_ali_login()
                self.get_alist_code()
            elif "token expired" in respose.text:
                self.logger.error("获取Alist Code失败,失败原因为:{}".format("Token失效"))
                self.get_ali_login()
                self.get_alist_code()
            else:
                self.logger.error("获取Alist Code失败,失败原因为:{},重新获取Alist Code".format(respose.text))
                time.sleep(60)
                self.get_alist_code()
        else:
            self.alist_code = respose.json()["redirectUri"].split("code=")[-1]
            self.logger.info("Alist Code获取成功,Alist Code为:{}".format(self.alist_code))

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
            self.logger.info("Access Token 获取成功")
        else:
            if "code not found" in response.text:
                self.logger.error("Access Token获取失败,失败原因为:{}".format("Alis Code获取失败,重新获取Alist Code"))
                self.get_ali_token()
            elif "Too Many Requests" in response.text:
                self.logger.error("Access Token获取失败,失败原因为:{},稍后重试".format("太多请求"))
                time.sleep(60)
                self.get_ali_token()

    def findSubs(self, name, sub_list):
        remove_ext = name = '.'.join(name.split('.')[:-1])
        sub_str = ""
        for sub_file in sub_list:
            if remove_ext in sub_file["name"]:
                sub_str = "+++" + '.'.join(sub_file["name"].split('.')[:-1]) + "@@@" + sub_file[
                    'file_extension'] + "@@@" + sub_file["file_id"]
        if len(sub_str) == 0:
            for sub_file in sub_list:
                sub_str = sub_str + "+++" + '.'.join(sub_file["name"].split('.')[:-1]) + "@@@" + sub_file[
                    'file_extension'] + "@@@" + sub_file["file_id"]
        return sub_str

    def sort_by_size(self, item):
        return item['size']



    def sort_by_name(self, item):
        try:
            pattern = r'\d+'
            name = "".join(item["name"].split(".")[:-1])
            number = int(re.findall(pattern, name)[0])
        except:
            number = item['size']
        return number

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
                self.logger.error("获取分享链接失败,暂不支持此分享链接:{}".format(share_url_dic["url"]))
            if len(m) > 0:
                share_id = m[0]
                is_floder, file_id = self.get_share_file_id(share_id)
                if file_id:
                    self.get_all_files(share_id, file_id, video_file_list, sub_file_list, is_floder)
        episode = []
        episode_no_sub = []
        repeat_list = []
        if len(video_file_list) > 10:
            repeat_list = self.find_common_strings(video_file_list[0]["name"], video_file_list[1]["name"])
        video_file_list = sorted(video_file_list, key=self.sort_by_name)
        for video_file in video_file_list:
            video_name = video_file["name"].split(".")[0]
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
            epi_str_no_sub = display_name + "$" + video_file["name"] + "+++" + str(video_file["size"])  + "+++" + video_file["file_id"]
            if epi_str_no_sub not in episode_no_sub:
                episode_no_sub.append(epi_str_no_sub)
                episode.append(epi_str)
            else:
                self.logger.warn("分享链接中出现相同的文件,只保留一种")

        if len(episode) > 0:
            ## 自定义清晰度
            play_foramt_list = ["原画", "超清", "高清", "标清"]
            episode_str = ["#".join(episode)] * len(play_foramt_list)
            return "$$$".join(play_foramt_list), "$$$".join(episode_str)
        else:
            self.logger.error("获取视频链接失败,请检查分享链接")
            return "",""
class BaseSpider(metaclass=ABCMeta):
    _instance = None
    tree = None
    header = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"}
    session = requests.session()
    search_index = 0
    index = 1
    _user_agents = [
        "api-client/1 com.douban.frodo/7.22.0.beta9(231) Android/23 product/Mate 40 vendor/HUAWEI model/Mate 40 brand/HUAWEI  rom/android  network/wifi  platform/AndroidPad"
        "api-client/1 com.douban.frodo/7.18.0(230) Android/22 product/MI 9 vendor/Xiaomi model/MI 9 brand/Android  rom/miui6  network/wifi  platform/mobile nd/1",
        "api-client/1 com.douban.frodo/7.1.0(205) Android/29 product/perseus vendor/Xiaomi model/Mi MIX 3  rom/miui6  network/wifi  platform/mobile nd/1",
        "api-client/1 com.douban.frodo/7.3.0(207) Android/22 product/MI 9 vendor/Xiaomi model/MI 9 brand/Android  rom/miui6  network/wifi platform/mobile nd/1"]
    vod_douban_detail = None

    def __new__(cls, *args, **kwargs):
        if cls._instance:
            return cls._instance
        else:
            cls._instance = super().__new__(cls)
            return cls._instance

    @abstractmethod
    def init(self, extend=""):
        pass

    @abstractmethod
    def homeContent(self, filter):
        pass

    @abstractmethod
    def homeVideoContent(self):
        pass

    @abstractmethod
    def categoryContent(self, tid, pg, filter, extend):
        pass

    @abstractmethod
    def detailContent(self, ids):
        pass

    @abstractmethod
    def searchContent(self, key, quick):
        pass

    @abstractmethod
    def playerContent(self, flag, id, vipFlags):
        pass

    @abstractmethod
    def localProxy(self, param):
        pass

    @abstractmethod
    def isVideoFormat(self, url):
        pass

    @abstractmethod
    def manualVideoCheck(self):
        pass

    @abstractmethod
    def getName(self):
        pass

    def get_name(self):
        name = self.getName().split('┃')[1]
        return name
    def init_logger(self):
        # self.clear()
        self.logger = Logger(self.get_name()).get_logger()
        self.logger.info("##################{}爬虫脚本初始化完成##################".format(self.get_name()))

    def num2cn(self, num):
        """
        将阿拉伯数字转换为中文数字
        :param num: 阿拉伯数字
        :return: 中文数字
        """
        cn_num = {
            "0": '零',
            "1": '一',
            "2": '二',
            "3": '三',
            "4": '四',
            "5": '五',
            "6": '六',
            "7": '七',
            "8": '八',
            "9": '九'
        }
        new_str = ""
        status = False
        for i in num:
            if i in cn_num.keys():
                new_str = new_str + cn_num[i]
                status = True
            else:
                new_str = new_str + i
        return status, new_str

    def write_config(self, dic, name):
        if os.path.exists(os.path.join(os.environ.get("HOME"))):
            pass
        else:
            os.mkdir(os.path.join(os.environ.get("HOME")))
        with open(os.path.join(os.environ.get("HOME"), "{}.json".format(name)), "wb") as f:
            f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))
        return dic

    def load_config(self, name):
        try:
            with open(os.path.join(os.environ.get("HOME"), "{}.json".format(name)), "rb") as f:
                return json.load(f)
        except:
            return None

    def fetch(self, url, header=None):
        try:
            if header:
                rsp = self.session.get(url, headers=self.header)
            else:
                rsp = self.session.get(url, headers=header)
            return rsp
        except Exception as e:
            self.logger.error("url地址为:{},访问失败,失败原因为:{}".format(url, e))
            sys.exit()
            return None

    def getDependence(self):
        return []

    def setExtendInfo(self, extend):
        self.extend = extend

    def regStr(self, src, reg, group=1):
        m = re.search(reg, src)
        src = ''
        if m:
            src = m.group(group)
        return src

    def str2json(self, str):
        return json.loads(str)

    def cleanText(self, src):
        clean = re.sub('[\U0001F600-\U0001F64F\U0001F300-\U0001F5FF\U0001F680-\U0001F6FF\U0001F1E0-\U0001F1FF]', '',
                       src)
        return clean

    def getDoubanSearchStatus(self):
        while True:
            douban_search = self.load_config("douban_search")
            if douban_search["douban_search"]:
                break
            time.sleep(0.1)

    def paraseVodDetailFromJson(self, dic):
        vodDetail = VodDetail()
        vodDetail.vod_name = dic["title"]
        vodDetail.vod_year = dic["year"]
        vodDetail.vod_pic = dic["pic"]["large"]
        vodDetail.vod_remarks = "评分:{}".format(dic["rating"]["value"])
        vodDetail.vod_content = dic["intro"]
        vodDetail.vod_area = " / ".join(dic["countries"])
        director_list = []
        for director_dic in dic["directors"]:
            director_list.append(director_dic["name"])
        actor_list = []
        for actor_dic in dic["actors"]:
            actor_list.append(actor_dic["name"])
        vodDetail.vod_director = " / ".join(director_list)
        vodDetail.vod_actor = " / ".join(actor_list)
        vodDetail.type_name = " / ".join(dic["genres"])
        return vodDetail

    def paraseVodShortFromJson(self,key,dic):
        items = dic["items"]
        if len(items) > 0:
            vod_detail = VodDetail()
            target = items[0]["target"]
            vod_detail.vod_name = key
            vod_detail.vod_id = "/" + "/".join(target["uri"].split("/")[-2:])
            vod_detail.vod_pic = target["cover_url"]
            vod_detail.vod_remarks = "评分:{}".format(target["rating"]["value"])
            vod_detail.type_name = target["card_subtitle"]
            vod_detail.vod_year = target["year"]
            return vod_detail
        else:
            self.logger.error("豆瓣搜索失败,名称为:{},失败原因为:{}".format(key, "没有搜索到该名称"))
            return None

    def vod_to_json(self,vod_detail:VodDetail):
        vod_json = vod_detail.to_dict()
        self.write_config(vod_json,"vod_json")

    def json_to_vod(self,key):
        vod_json = self.load_config("vod_json")
        if vod_json:
            vodDetail = VodDetail()
            vodDetail.load_dic(vod_json)
            if vodDetail.vod_name == key:
                return vodDetail
            else:
                return None
        else:
            return None

    def sign(self, url: str, ts: int, method='GET') -> str:
        """
        签名
        """
        _api_secret_key = "bf7dddc7c9cfe6f7"
        url_path = parse.urlparse(url).path
        raw_sign = '&'.join([method.upper(), parse.quote(url_path, safe=''), str(ts)])
        return base64.b64encode(
            hmac.new(
                _api_secret_key.encode(),
                raw_sign.encode(),
                hashlib.sha1
            ).digest()
        ).decode()



    def getDoubanShort(self,key):
        time.sleep(3)
        self.logger.info("开始豆瓣搜索爬虫,搜索名称为:{},次数为:{}".format(key, self.index))
        api_url = "https://frodo.douban.com/api/v2"
        _api_key = "0dad551ec0f84ed02907ff5c42e8ec70"
        url = api_url + "/search/movie"
        ts = datetime.strftime(datetime.now(), '%Y%m%d')
        params = {'_sig': self.sign(url, ts), '_ts': ts, 'apiKey': _api_key,
                  'count': 1, 'os_rom': 'android', 'q': key, 'start': 0}
        headers = {
            'User-Agent': choice(self._user_agents),
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': None, 'referer': None}
        try:
            search_rsp = self.session.get(url, params=params, headers=headers, verify=False, timeout=20,
                                          allow_redirects=True, stream=False)
            if search_rsp.status_code == 200:
                self.index = self.index + 1
                search_json = search_rsp.json()
                vod_short = self.paraseVodShortFromJson(key,search_json)
                self.logger.info("豆瓣搜索爬虫成功,搜索名称为:{}".format(key))
                return vod_short
            else:
                if "search_access_rate_limit" in search_rsp.text:
                    self.logger.error("豆瓣搜索爬虫失败,名称为:{},失败原因为:{}".format(key, "访问频率太快"))
                    time.sleep(60*10) ## 10分钟后重试
                    return self.getDoubanShort(key)
                else:
                    self.logger.error("豆瓣搜索爬虫失败,名称为:{},失败原因为:{}".format(key, search_rsp.text))
        except Exception as e:
            self.logger.error("豆瓣搜索爬虫失败,名称为:{},失败原因为:{}".format(key, e))

    def getDoubanDetail(self, key):
        time.sleep(3)
        api_url = "https://frodo.douban.com/api/v2"
        _api_key = "0dad551ec0f84ed02907ff5c42e8ec70"
        vod_short = self.getDoubanShort(key)
        if vod_short:
            search_url = api_url + vod_short.vod_id
            ts = datetime.strftime(datetime.now(), '%Y%m%d')
            params = {'_sig': self.sign(search_url, ts), '_ts': ts, 'apiKey': _api_key, 'os_rom': 'android'}
            headers = {
                'User-Agent': choice(self._user_agents),
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Accept': None,
                'referer': None}
            try:
                detail_rsp = self.session.get(search_url, params=params, headers=headers, verify=False,
                                              timeout=20,
                                              allow_redirects=True, stream=False)
                if detail_rsp.status_code == 200:
                    self.index = self.index + 1
                    detail_json = detail_rsp.json()
                    vodDetail = self.paraseVodDetailFromJson(detail_json)
                    self.logger.info("豆瓣详情爬虫成功,名称为:{}".format(key))
                    return vodDetail
                else:
                    self.logger.error("豆瓣详情爬虫失败,名称为:{}".format(key, detail_rsp.text))
            except Exception as e:
                self.logger.error("豆瓣详情爬虫失败,名称为:{},失败原因为:{}".format(key, e))

    def playerAliContent(self, flag, id, vipFlags):
        result = {"format": "application/octet-stream",
                  "header": "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36\",\"Referer\":\"https://www.aliyundrive.com/\"}",
                  "jx": 0,
                  "parse": 0,
                  "url": ""}
        try:
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
            result["url"] = url
            self.logger.info("获取下载链接耗时:{}s,下载链接为:{}".format(('%.2f' % (time.time() - start_time)), url))
            return result
        except:
            return result

    def clear(self):
        try:
            file_list = os.listdir(os.environ.get("HOME"))
            for file_name in file_list:
                if os.path.isfile(os.path.join(os.environ.get("HOME"), file_name)):
                    os.remove(os.path.join(os.environ.get("HOME"), file_name))
                    print("文件名称为:{},删除成功".format(file_name))
        except Exception as e:
            print("删除失败,失败原因为:{}".format(e))
            pass

    def write_html(self, url, html_name):
        rsp = self.fetch(url)
        with open("html/{}.html".format(html_name), "wb") as f:
            f.write(rsp.text.encode("utf-8"))
        return self.read_html(html_name)

    def read_html(self, html_name):
        with open("html/{}.html".format(html_name), "rb") as f:
            html_str = f.read()
        return html_str

    def post(self, url, data, headers={}, cookies={}):
        rsp = requests.post(url, data=data, headers=headers, cookies=cookies)
        rsp.encoding = 'utf-8'
        return rsp

    def postJson(self, url, json, headers={}, cookies={}):
        rsp = requests.post(url, json=json, headers=headers, cookies=cookies)
        rsp.encoding = 'utf-8'
        return rsp

    def html(self, content):
        return etree.HTML(content)

    def xpText(self, root, expr):
        ele = root.xpath(expr)
        if len(ele) == 0:
            return ''
        else:
            return ele[0]

    def loadModule(self, name, fileName):
        return SourceFileLoader(name, fileName).load_module()


class Spider(BaseSpider):
    header = {"Host": "frodo.douban.com",
              "Connection": "Keep-Alive",
              "Referer": "https://servicewechat.com/wx2f9b06c1de1ccfca/84/page-frame.html",
              "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat"
              }
    session = requests.session()
    api_url = 'https://frodo.douban.com/api/v2'
    home_url = 'https://m.douban.com'
    api_key = "?apikey=0ac44ae016490db2204ce0a042db2916"


    def getName(self):
        return "🍥┃豆瓣┃🍥"

    def init(self, extend=""):
        self.init_logger()
        self.write_config({"douban_search":False},"douban_search")


    def parseVodListFromJSONArray(self, items):
        vod_list = []
        for item in items:
            vod_short = VodShort()
            vod_short.vod_id = "msearch:" + item["id"]
            vod_short.vod_name = item["title"]
            try:
                vod_short.vod_pic = item["pic"][
                                        "normal"] + "@Referer=https://api.douban.com/@User-Agent=" + "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
            except:
                vod_short.vod_pic = ""
            try:
                vod_short.vod_remarks = "评分：" + str(item["rating"]["value"])
            except Exception as e:
                vod_short.vod_remarks = ""
            vod_list.append(vod_short.to_dict());
        return vod_list

    def Result(self, classes, vod_list, filters):
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
        for (type_id, type_name) in zip(typeIds, typeNames):
            classes.append({
                'type_name': type_name,
                'type_id': type_id
            })
        start_time = time.time()
        url = "{}/subject_collection/subject_real_time_hotest/items{}".format(self.api_url,self.api_key)
        rsp = self.fetch(url, header=self.header)
        vod_list = []
        if rsp.status_code == 200:
            items = rsp.json()["subject_collection_items"]
            vod_list = self.parseVodListFromJSONArray(items)
            self.logger.info("获取豆瓣首页信息成功,耗时:{}s".format(("%.2f" % (time.time() - start_time))))
        else:
            self.logger.error("获取豆瓣首页信息失败,失败原因为:{}".format(rsp.text))
        filter = None
        try:
            filter = self.fetch(LocalAddress + "/json/douban.json").json()
        except:
            pass
        return self.Result(classes, vod_list, filter)

    ## 首页界面
    def homeVideoContent(self):
        pass


    def get_tags(self,extend):
        tag_list = []
        for key in list(extend.keys()):
            if key != "sort":
                tag_list.append(extend[key])
        return ",".join(tag_list)
    ## 分类详情
    def categoryContent(self, tid, pg, filter, extend:dict):
        sort = extend["sort"] if "sort" in extend.keys() else "show_hot"
        tags = self.get_tags(extend)
        start_time = time.time()
        self.logger.info("tid:{},pg={},filter={},extend={}".format(tid, pg, filter, extend))
        start = (int(pg) - 1) * 20
        itemKey = "items"
        if tid == "hot_gaia":
            sort = extend["sort"] if "sort" in extend.keys() else "recommend"
            area = extend["area"] if "area" in extend.keys() else "全部"
            sort = sort + "&area=" + area
            cateUrl = self.api_url + "/movie/hot_gaia" + self.api_key + "&sort=" + sort
        elif tid == "tv_hot":
            type =  extend["type"] if "type" in extend.keys() else "tv_hot"
            cateUrl = self.api_url + "/subject_collection/" + type + "/items" + self.api_key
            itemKey = "subject_collection_items"
        elif tid ==  "show_hot":
            showType = extend["type"] if "type" in extend.keys() else "show_hot"
            cateUrl = self.api_url + "/subject_collection/" + showType + "/items" + self.api_key
            itemKey = "subject_collection_items";
        elif tid == "movie":
            cateUrl = self.api_url + "/movie/recommend" + self.api_key + "&sort=" + sort + "&tags=" + tags
        elif tid == "tv":
            cateUrl = self.api_url + "/tv/recommend" + self.api_key + "&sort=" + sort + "&tags=" + tags
        elif tid == "rank_list_movie":
            rankMovieType = extend["榜单"] if "榜单" in extend.keys() else "movie_real_time_hotest"
            cateUrl = self.api_url + "/subject_collection/" + rankMovieType + "/items" + self.api_key
            itemKey = "subject_collection_items"
        elif tid == "rank_list_tv":
            rankTVType = extend["榜单"] if "榜单" in extend.keys() else "tv_real_time_hotest"
            cateUrl = self.api_url + "/subject_collection/" + rankTVType + "/items" + self.api_key
            itemKey = "subject_collection_items"
        rsp = self.fetch(cateUrl+ "&start=" + str(start) + "&count=20",self.header)
        if rsp.status_code == 200:
            items = rsp.json()[itemKey]
            vod_list = self.parseVodListFromJSONArray(items)
            result = {"jx": 0, "limit": 20, "page": int(pg), "pagecount": 2147483647, "parse": 0, "total": 2147483647}
            result["list"] = vod_list
            self.logger.info("获取豆瓣首页信息成功,耗时:{}s".format(("%.2f" % (time.time() - start_time))))
            return result
        else:
            self.logger.error("获取豆瓣首页信息失败,失败原因为:{}".format(rsp.text))
            return None



    ## 详情界面
    def detailContent(self, array):
        vod_detail_dic = self.douban_detail(array[0])
        result = {
            'list': [
                vod_detail_dic
            ]
        }
        return result






    def searchContent(self, key, quick=True):
        self.write_config({"douban_search":False},"douban_search")
        vod_short = self.getDoubanShort(key)
        self.vod_to_json(vod_short)
        self.write_config({"douban_search":True},"douban_search")
        return {"jx": 0, "parse": 0,"list":[]}


    def playerContent(self, flag, id, vipFlags):
        pass

    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def localProxy(self, param):
        return [200, "video/MP2T", action, ""]
