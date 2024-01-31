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
    def __init__(self, js_path, json_path,token_name,aliToken=""):
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
                    if "🔞" not in jsMoudle.getName() and "📚︎" not in jsMoudle.getName() and "🎵" not in jsMoudle.getName():
                        new_js_file_list.append(js_file)
            elif case  == 1:
                if jsMoudle.getName():
                    if "🔞" in jsMoudle.getName():
                        new_js_file_list.append(js_file)
            elif case == 2:
                if jsMoudle.getName():
                    if "📚︎" in jsMoudle.getName() or "🎵" in jsMoudle.getName():
                        new_js_file_list.append(js_file)
        return new_js_file_list

    def readJsonFile(self, json_file):
        with open(os.path.join(self.json_path, json_file), "rb") as f:
            return json.load(f)


    def write_config(self,ali_name,json_file_list,js_file_list,is_18=True):
        site_obj = {"key": "", "name": "", "type": 3, "api": "","timeout":30 ,"ext": {}, }
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
                    site_obj_copy["ext"] = {"box": json_file_name}
                    site_obj_copy["api"] = "./{}/{}".format(self.js_path, js_file)
                    if "阿里" in jsMoudle.getAppName():
                        site_obj_copy["ext"]["token"] = self.ali_token
                    elif jsMoudle.getAppName() == "泥视频":
                        site_obj_copy["name"] = jsMoudle.getName()
                        site_obj_copy["ext"]["code"] = 1
                    elif jsMoudle.getAppName() == "量子资源":
                        site_obj_copy["name"] = jsMoudle.getName()
                        site_obj_copy["ext"]["code"] = 1
                    site_obj_copy["ext"] = json.dumps(site_obj_copy["ext"])
                    site_obj_list.append(site_obj_copy)
                    print(site_obj_list)
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

    def write_book_config(self,book_file_list):
        file_list = os.listdir(".")
        site_obj_list = []
        for book_file in book_file_list:
            js_file_name = book_file.split(".")[0]
            jsMoudle = JSMoudle(os.path.join(self.js_path, book_file))
            if "📚︎" in jsMoudle.getName():
                site_obj = {"key": "", "name": "", "type": 10, "api": "", "ext": "{\"box\": \"CatOpen\"}"}
            elif "🎵" in jsMoudle.getName():
                site_obj = {"key": "", "name": "", "type": 10, "api": "", "ext": "{\"box\": \"CatOpen\"}"}
            site_obj_copy = copy.copy(site_obj)
            site_obj_copy["key"] = js_file_name
            site_obj_copy["name"] = jsMoudle.getName()
            site_obj_copy["api"] = "./{}/{}".format(self.js_path, book_file)
            site_obj_list.append(site_obj_copy)



        for file_name in file_list:
            if "open_config.json" in file_name:
                with open(file_name,"rb") as f:
                    dic = json.load(f)
                dic["read"]["sites"] = site_obj_list
                with open(file_name,"wb") as f:
                    f.write(json.dumps(dic, indent=4, ensure_ascii=False).encode("utf-8"))

    def build(self):
        json_file_list = self.getJsonFileList()
        no_18_js_file_list = self.getJsFileList(case=0)
        y_js_file_list = self.getJsFileList(case=1)
        book_file_list = self.getJsFileList(case=2)
        self.write_config(self.ali_name,json_file_list,no_18_js_file_list,is_18=False)
        self.write_config(self.ali_name,json_file_list,y_js_file_list,is_18=True)
        self.write_book_config(book_file_list)




if __name__ == '__main__':
    build = Build("js", "json",token_name="he",aliToken="3d3c5c67581e4db188e753a56ea5829a")
    build.build()
    build = Build("js", "json",token_name="",aliToken="58950fc2475f49fc8788355c83594177")
    build.build()
