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

from jade import GetTimeStamp


def get_import_name(book_file_list, pan_file_list, video_file_list):
    write_router_content = ""
    spider_list = []
    for book_file in book_file_list:
        js_name = book_file.split(".js")[0]
        spider_list.append(js_name)
        write_router_content = write_router_content + "import {} from './spider/book/{}.js';\n".format(js_name,
                                                                                                          js_name)
    for pan_file in pan_file_list:
        js_name = pan_file.split(".js")[0]
        spider_list.append(js_name)
        write_router_content = write_router_content + "import {} from './spider/pan/{}.js';\n".format(js_name,
                                                                                                          js_name)

    for video_file in video_file_list:
        js_name = video_file.split(".js")[0]
        spider_list.append(js_name)
        write_router_content = write_router_content + "import {} from './spider/video/{}.js';\n".format(js_name,
                                                                                                          js_name)

    return write_router_content + "const spiders = [{}];".format(",".join(spider_list)) + "\n"

def config_to_nodejs(ali_token):
    write_content = ""
    with open("nodejs/src/index.config.txt","rb") as f:
        contentlist = f.readlines()
        for content in contentlist:
            write_content = write_content + str(content, encoding="utf-8").replace("temp",ali_token) + "\n"

    with open("nodejs/src/index.config.js","wb") as f:
        f.write(write_content.encode("utf-8"))
def js_to_nodejs(js_file_list, type="video"):
    for js_file in js_file_list:
        jsMoudle = JSMoudle(os.path.join("js", js_file))
        modleName = jsMoudle.getName()
        write_content = ""
        print(jsMoudle.getAppName(), jsMoudle.getJSName())
        with open("nodejs/src/spider/tmpSpider.txt", "rb") as f:
            contentlist = f.readlines()
            for content in contentlist:
                write_content = write_content + str(content, encoding="utf-8").replace("temp",
                                                                                       jsMoudle.getJSName()).replace(
                    "updateTime", GetTimeStamp())
        with open("nodejs/src/spider/{}/{}".format(type, js_file), "wb") as f:
            f.write(write_content.encode("utf-8"))

def nodejs_config(ali_token):
    book_file_list = os.listdir("nodejs/src/spider/book")
    pan_file_list = os.listdir("nodejs/src/spider/pan")
    video_file_list = os.listdir("nodejs/src/spider/video")
    write_router_content = get_import_name(book_file_list, pan_file_list, video_file_list)
    with open("nodejs/src/router.txt", "rb") as f:
        contentlist = f.readlines()
        for content in contentlist:
            write_router_content = write_router_content + str(content, encoding="utf-8")
    with open("nodejs/src/router.js","wb") as f:
        f.write(write_router_content.encode("utf-8"))
    config_to_nodejs(ali_token)

class JSMoudle():
    def __init__(self, js_file):
        self.js_file = js_file
        self.getContent()

    def getContent(self):
        with open(self.js_file, "rb") as f:
            self.js_str = str(f.read(), encoding="utf-8")

    def getName(self):
        try:
            name = (self.js_str.split("getName()")[-1].split("}")[0].split("return")[-1].split('"')[1])
            return name
        except:
            return None

    def getAppName(self):
        try:
            name = (self.js_str.split("getAppName()")[-1].split("}")[0].split("return")[-1].split('"')[1])
            return name
        except:
            return None

    def getJSName(self):
        try:
            name = (self.js_str.split("getJSName()")[-1].split("}")[0].split("return")[-1].split('"')[1])
            return name
        except:
            return None

    def getType(self):
        try:
            name = (self.js_str.split("getType()")[-1].split("}")[0].split("return")[-1])
            return name.strip()
        except:
            return None


class Build(object):
    def __init__(self, js_path, json_path, token_name, aliToken=""):
        self.js_path = js_path
        self.json_path = json_path
        self.ali_name = token_name
        self.ali_token = aliToken

    def getJsonFileList(self):
        json_file_list = os.listdir(self.json_path)
        return json_file_list

    def getJsFileList(self, case=0):
        new_js_file_list = []
        js_file_list = os.listdir(self.js_path)
        for js_file in js_file_list:
            js_file_name = js_file.split(".")[0]
            jsMoudle = JSMoudle(os.path.join(self.js_path, js_file))
            if case == 0:
                if jsMoudle.getName():
                    if "🔞" not in jsMoudle.getName() and "📚︎" not in jsMoudle.getName() and "🎵" not in jsMoudle.getName() and "推送" not in jsMoudle.getName():
                        new_js_file_list.append(js_file)
            elif case == 1:
                if jsMoudle.getName():
                    if "🔞" in jsMoudle.getName():
                        new_js_file_list.append(js_file)
            elif case == 2:
                if jsMoudle.getName():
                    if "📚︎" in jsMoudle.getName() or "🎵" in jsMoudle.getName():
                        new_js_file_list.append(js_file)
            elif case == 3:
                if jsMoudle.getName():
                    if "推送" in jsMoudle.getName():
                        new_js_file_list.append(js_file)
        return new_js_file_list

    def readJsonFile(self, json_file):
        with open(os.path.join(self.json_path, json_file), "rb") as f:
            return json.load(f)

    def write_config(self, ali_name, json_file_list, js_file_list, is_18=True):
        site_obj = {"key": "", "name": "", "playerType": 0, "type": 3, "api": "", "timeout": 30, "ext": {}}
        for json_file in json_file_list:
            json_file_name = json_file.split(".")[0]
            dic = self.readJsonFile(json_file)
            site_obj_copy_2 = None
            site_obj_list = []
            for js_file in js_file_list:
                js_file_name = js_file.split(".")[0]
                jsMoudle = JSMoudle(os.path.join(self.js_path, js_file))

                if jsMoudle.getName():
                    site_obj_copy = copy.copy(site_obj)
                    site_obj_copy["key"] = js_file_name
                    site_obj_copy["name"] = jsMoudle.getName()
                    site_obj_copy["ext"] = {"box": json_file_name, "danmu": False}
                    site_obj_copy["api"] = "./{}/{}".format(self.js_path, js_file)
                    print(js_file_name, jsMoudle.getAppName())
                    if "阿里" in jsMoudle.getAppName() or "厂长直连" in jsMoudle.getAppName():
                        site_obj_copy["ext"]["token"] = self.ali_token
                    elif jsMoudle.getAppName() == "泥视频":
                        site_obj_copy["name"] = jsMoudle.getName()
                        site_obj_copy["ext"]["code"] = 1
                    elif jsMoudle.getAppName() == "量子资源":
                        site_obj_copy["name"] = jsMoudle.getName()
                        site_obj_copy["ext"]["code"] = 1
                    site_obj_copy["ext"] = json.dumps(site_obj_copy["ext"])
                    site_obj_list.append(site_obj_copy)
            if site_obj_copy_2 is not None:
                site_obj_list.append(site_obj_copy_2)
            if json_file_name == "TVBox":
                dic["sites"] = site_obj_list
                if is_18:
                    with open("18_tv_config.json", "wb") as f:
                        f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))
                else:
                    if len(ali_name) > 0:
                        with open("{}_tv_config.json".format(ali_name), "wb") as f:
                            f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))
                    else:
                        with open("tv_config.json", "wb") as f:
                            f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))
            elif json_file_name == "CatOpen":
                dic["video"]["sites"] = site_obj_list
                if is_18:
                    with open("18_open_config.json", "wb") as f:
                        f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))
                else:
                    if len(ali_name) > 0:
                        with open("{}_open_config.json".format(ali_name), "wb") as f:
                            f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))
                    else:
                        with open("open_config.json", "wb") as f:
                            f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))

    def write_book_config(self, book_file_list):
        file_list = os.listdir(".")
        site_obj_list = []
        for book_file in book_file_list:
            js_file_name = book_file.split(".")[0]
            jsMoudle = JSMoudle(os.path.join(self.js_path, book_file))
            if "📚︎" in jsMoudle.getName():
                site_obj = {"key": "", "name": "", "type": 10, "api": "", "ext": "{\"box\": \"CatOpen\"}"}
            elif "🎵" in jsMoudle.getName():
                site_obj = {"key": "", "name": "", "type": 3, "api": "", "ext": "{\"box\": \"CatOpen\"}"}
            site_obj_copy = copy.copy(site_obj)
            site_obj_copy["key"] = js_file_name
            site_obj_copy["name"] = jsMoudle.getName()
            site_obj_copy["api"] = "./{}/{}".format(self.js_path, book_file)
            site_obj_list.append(site_obj_copy)

        for file_name in file_list:
            if "open_config.json" in file_name:
                with open(file_name, "rb") as f:
                    dic = json.load(f)
                dic["read"]["sites"] = site_obj_list
                with open(file_name, "wb") as f:
                    f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))

    def get_site_obj(self, push_file_list, site_obj_list, type):
        for book_file in push_file_list:
            js_file_name = book_file.split(".")[0]
            jsMoudle = JSMoudle(os.path.join(self.js_path, book_file))
            dic = {"box": type, "token": self.ali_token}
            site_obj = {"key": "", "name": "", "type": 3, "api": "", "ext": json.dumps(dic)}
            site_obj_copy = copy.copy(site_obj)
            site_obj_copy["key"] = js_file_name
            site_obj_copy["name"] = jsMoudle.getName()
            site_obj_copy["api"] = "./{}/{}".format(self.js_path, book_file)
            site_obj_list.append(site_obj_copy)
        return site_obj_list

    def write_push_config(self, push_file_list):
        file_list = os.listdir(".")
        for file_name in file_list:
            site_obj_list = []
            if "open_config.json" in file_name:
                with open(file_name, "rb") as f:
                    dic = json.load(f)
                site_obj_list = dic["video"]["sites"]
                self.get_site_obj(push_file_list, site_obj_list, "CatOpen")
                with open(file_name, "wb") as f:
                    f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))
            elif "tv_config.json" in file_name:
                with open(file_name, "rb") as f:
                    dic = json.load(f)
                site_obj_list = dic["sites"]
                self.get_site_obj(push_file_list, site_obj_list, "TVBox")
                with open(file_name, "wb") as f:
                    f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))

    def build(self):
        json_file_list = self.getJsonFileList()
        no_18_js_file_list = self.getJsFileList(case=0)
        y_js_file_list = self.getJsFileList(case=1)
        book_file_list = self.getJsFileList(case=2)
        push_file_list = self.getJsFileList(case=3)
        js_to_nodejs(no_18_js_file_list)  # self.write_config(self.ali_name,json_file_list,no_18_js_file_list,is_18=False)  # self.write_config(self.ali_name,json_file_list,y_js_file_list,is_18=True)  # self.write_book_config(book_file_list)  # self.write_push_config(push_file_list)

        nodejs_config(self.ali_token)


if __name__ == '__main__':
    build = Build("js", "json", token_name="", aliToken="302ef8e4b4d7430db6d82de284978359")
    build.build()
