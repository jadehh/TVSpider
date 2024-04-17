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

from jade import GetTimeStamp,CreateSavePath


def get_import_name(file_list,book_file_list, pan_file_list, video_file_list,is_18=False):
    write_router_content = ""
    spider_list = []
    if is_18:
        for video_file in file_list:
            js_name = video_file.split(".js")[0]
            spider_list.append(js_name)
            write_router_content = write_router_content + "import {} from './spider/18/{}.js';\n".format(js_name,js_name)
    else:
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
                with open("nodejs/src/spider/video/{}".format(video_file),"rb") as f:
                    content = f.read()
                if "已失效" in str(content,encoding="utf-8"):
                    pass
                else:
                    spider_list.append(js_name)
                    write_router_content = write_router_content + "import {} from './spider/video/{}.js';\n".format(js_name,
                                                                                                            js_name)
    return write_router_content + "const spiders = [{}];".format(",".join(spider_list)) + "\n"

def config_to_nodejs(ali_token,bili_token):
    write_content = ""
    with open("nodejs/src/index.config.txt","rb") as f:
        contentlist = f.readlines()
        for content in contentlist:
            write_content = write_content + str(content, encoding="utf-8").replace("temp",ali_token).replace("bilitmep",bili_token) + "\n"

    with open("nodejs/src/index.config.js","wb") as f:
        f.write(write_content.encode("utf-8"))
def js_to_nodejs(js_file_list, type="video"):
    CreateSavePath("nodejs/src/spider/video")
    CreateSavePath("nodejs/src/spider/book")
    CreateSavePath("nodejs/src/spider/pan")
    CreateSavePath("nodejs/src/spider/18")
    for js_file in js_file_list:
        jsMoudle = JSMoudle(os.path.join("js", js_file))
        modleName = jsMoudle.getName()
        write_content = ""
        print(jsMoudle.getAppName(),jsMoudle.getType(), jsMoudle.getJSName())
        with open("nodejs/src/spider/tmpSpider.txt", "rb") as f:
            contentlist = f.readlines()
            for content in contentlist:
                write_content = write_content + str(content, encoding="utf-8").replace("temp",
                                                                                       jsMoudle.getJSName()).replace(
                    "updateTime", GetTimeStamp())
        if jsMoudle.getType() == "3" :
            with open("nodejs/src/spider/{}/{}".format(type, js_file), "wb") as f:
                f.write(write_content.encode("utf-8"))
        elif jsMoudle.getType() == "10" or jsMoudle.getType() == "20":
            with open("nodejs/src/spider/{}/{}".format("book", js_file), "wb") as f:
                f.write(write_content.encode("utf-8"))

def nodejs_config(ali_token,is_18,bili_cokie):
    book_file_list = os.listdir("nodejs/src/spider/book")
    pan_file_list = os.listdir("nodejs/src/spider/pan")
    video_file_list = os.listdir("nodejs/src/spider/video")
    if is_18:
        file_list = os.listdir("nodejs/src/spider/18")
    else:
        file_list = []
    write_router_content = get_import_name(file_list,book_file_list, pan_file_list, video_file_list,is_18)
    with open("nodejs/src/router.txt", "rb") as f:
        contentlist = f.readlines()
        for content in contentlist:
            write_router_content = write_router_content + str(content, encoding="utf-8")
    with open("nodejs/src/router.js","wb") as f:
        f.write(write_router_content.encode("utf-8"))
    config_to_nodejs(ali_token,bili_cokie)

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
        except Exception as e:
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
    def __init__(self, js_path, json_path, token_name, aliToken="",biliCookie=""):
        self.js_path = js_path
        self.json_path = json_path
        self.ali_name = token_name
        self.ali_token = aliToken
        self.bili_cookie = biliCookie

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
                    if "🔞" not in jsMoudle.getName() and "📚︎" not in jsMoudle.getName() and "🎵" not in jsMoudle.getName() and "推送" not in jsMoudle.getName() and jsMoudle.getType() == "3":
                        new_js_file_list.append(js_file)
            elif case == 1:
                if jsMoudle.getName():
                    if "🔞" in jsMoudle.getName():
                        new_js_file_list.append(js_file)
            elif case == 2:
                if jsMoudle.getName():
                    if "📚︎" in jsMoudle.getName() or "🎵" in jsMoudle.getName() or jsMoudle.getType() == "20":
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
                    if "阿里" in jsMoudle.getAppName() or "厂长直连" in jsMoudle.getAppName():
                        site_obj_copy["ext"]["token"] = self.ali_token
                    elif jsMoudle.getAppName() == "泥视频":
                        site_obj_copy["name"] = jsMoudle.getName()
                        site_obj_copy["ext"]["code"] = 1
                    elif jsMoudle.getAppName() == "量子资源":
                        site_obj_copy["name"] = jsMoudle.getName()
                        site_obj_copy["ext"]["code"] = 1
                    elif jsMoudle.getAppName() == "哔哩哔哩":
                        site_obj_copy["ext"]["cookie"] = self.bili_cookie
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

    def build(self,no_18=False):
        json_file_list = self.getJsonFileList()
        no_18_js_file_list = self.getJsFileList(case=0)
        y_js_file_list = self.getJsFileList(case=1)

        book_file_list = self.getJsFileList(case=2)
        push_file_list = self.getJsFileList(case=3)
        self.write_config(self.ali_name, json_file_list, no_18_js_file_list, is_18=False)
        self.write_config(self.ali_name, json_file_list, y_js_file_list, is_18=True)
        self.write_book_config(book_file_list)
        self.write_push_config(push_file_list)

        no_18_js_file_list.extend(book_file_list)
        no_18_js_file_list.extend(push_file_list)

        if no_18 is False:
            js_to_nodejs(no_18_js_file_list)
            nodejs_config(self.ali_token,no_18,self.bili_cookie)
        else:
            js_to_nodejs(y_js_file_list,"18")
            nodejs_config(self.ali_token,no_18,self.bili_cookie)




if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--aliToken', type=str,
                            default="6827db23e5474d02a07fd7431d3d5a5a")  ## 添加环境变量
    parser.add_argument('--is_18', type=bool,
                            default=False)  ## 添加

    parser.add_argument('--biliCookie', type=str,
                            default="buvid3=02675249-8ED3-C418-87F5-59E18316459714816infoc; b_nut=1704421014; _uuid=5D435F74-F574-D9AB-62C1-B9294DE465D913102infoc; buvid_fp=e8c5650c749398e9b5cad3f3ddb5081e; buvid4=007E85D1-52C1-7E6E-07CF-837FFBC9349516677-024010502-J5vTDSZDCw4fNnXRejbSVg%3D%3D; rpdid=|()kYJmulRu0J'u~|RRJl)JR; PVID=1; SESSDATA=3be091d3%2C1720332009%2C699ed%2A11CjAcCdwXG5kY1umhCOpQHOn_WP7L9xFBfWO7KKd4BPweodpR6VyIfeNyPiRmkr5jCqsSVjg0R0dZOVVHRUo3RnhPRTZFc3JPbGdiUjFCdHpiRDhiTkticmdKTjVyS1VhbDdvNjFMSDJlbUJydUlRdjFUNGFBNkJlV2ZTa0N1Q1BEVi1QYTQzTUh3IIEC; bili_jct=b0ee7b5d3f27df893545d811d95506d4; DedeUserID=78014638; DedeUserID__ckMd5=4c8c5d65065e468a; enable_web_push=DISABLE; header_theme_version=CLOSE; home_feed_column=5; CURRENT_BLACKGAP=0; CURRENT_FNVAL=4048; b_lsid=75E916AA_18EA1A8D995; bsource=search_baidu; FEED_LIVE_VERSION=V_HEADER_LIVE_NO_POP; browser_resolution=1507-691; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTIzNjk5MTMsImlhdCI6MTcxMjExMDY1MywicGx0IjotMX0.8zQW_fNTCSBlK_JkHnzu3gDw62wuTK1qgKcbGec3swM; bili_ticket_expires=171236985")  ## 添加
    args = parser.parse_args()
    build = Build("js", "json", token_name="", aliToken=args.aliToken,biliCookie=args.biliCookie)
    build.build(args.is_18)
