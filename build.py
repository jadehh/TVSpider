#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : build.py
# @Author   : jade
# @Date     : 2023/12/15 17:23
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     : 自动生成config.json文件
import copy

import json
import os


class JSMoudle():
    def __init__(self, js_file):
        self.js_file = js_file
        self.getContent()

    def getContent(self):
        with open(self.js_file, "rb") as f:
            self.js_str = str(f.read(), encoding="utf-8")

    def getName(self):
        try:
            name = (self.js_str.split("getName")[-1].split("}")[0].split("return")[-1].split('"')[1])
            return name
        except:
            return None

    def getAppName(self):
        try:
            name = (self.js_str.split("getAppName")[-1].split("}")[0].split("return")[-1].split('"')[1])
            return name
        except:
            return None


class Build(object):
    def __init__(self, js_path, json_path):
        self.js_path = js_path
        self.json_path = json_path
        self.ali_token = "86c442348ffa42e882506502c557cd34"

    def getJsonFileList(self):
        json_file_list = os.listdir(self.json_path)
        return json_file_list

    def getJsFileList(self):
        js_file_list = os.listdir(self.js_path)
        return js_file_list

    def readJsonFile(self, json_file):
        with open(os.path.join(self.json_path, json_file), "rb") as f:
            return json.load(f)

    def build(self):
        json_file_list = self.getJsonFileList()
        js_file_list = self.getJsFileList()
        site_obj = {
            "key": "",
            "name": "",
            "type": 3,
            "api": "",
            "ext": "",
        }
        for json_file in json_file_list:
            json_file_name = json_file.split(".")[0]
            dic = self.readJsonFile(json_file)
            site_obj_list = []
            for js_file in js_file_list:
                js_file_name = js_file.split(".")[0]
                jsMoudle = JSMoudle(os.path.join(self.js_path, js_file))
                if jsMoudle.getName():
                    site_obj_copy = copy.copy(site_obj)
                    site_obj_copy["key"] = js_file_name
                    site_obj_copy["name"] = jsMoudle.getName()
                    site_obj_copy["api"] = "./{}/{}".format(self.js_path, js_file)
                    if "阿里" in jsMoudle.getAppName():
                        site_obj_copy["ext"] = json.dumps({"token": self.ali_token, "box": json_file_name})
                    elif jsMoudle.getAppName() == "泥视频":
                        site_obj_copy_2 = copy.copy(site_obj_copy)
                        site_obj_copy_2["name"] = "泥巴"
                        site_obj_copy_2["ext"] = json.dumps({"code": 1, "box": json_file_name})
                        site_obj_list.append(site_obj_copy_2)
                        site_obj_copy["name"] = jsMoudle.getName()
                        site_obj_copy["ext"] = json.dumps({"code": 2, "box": json_file_name})
                    site_obj_list.append(site_obj_copy)
                    print(site_obj_list)

            if json_file_name == "TVBox":
                dic["sites"] = site_obj_list
                with open("tv_config.json", "wb") as f:
                    f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))
            elif json_file_name == "CatOpen":
                dic["video"]["sites"] = site_obj_list
                with open("open_config.json", "wb") as f:
                    f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))


if __name__ == '__main__':
    build = Build("js", "json")
    build.build()
