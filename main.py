#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : main.py
# @Author   : jade
# @Date     : 2023/12/5 9:13
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import os
from importlib.machinery import SourceFileLoader

import json
from py.py_douban import LocalAddress

os.environ['HOME'] = "tmp"
if os.path.exists("tmp"):
    pass
else:
    os.mkdir("tmp")
def sort_by_name(item):
    return item["key"]

def generate_json():
    with open("json/spider.json", "rb") as f:
        spider_json = json.load(f)
    file_list = os.listdir("py")
    site_list = []
    for file_name in file_list:
        if "192.168" in LocalAddress:
            condition = "py_" in file_name
        else:
            condition = "py_" in file_name and "test" not in file_name
        if condition :
            Spider = SourceFileLoader("Spider", os.path.join("py", file_name)).load_module().Spider
            spider = Spider()
            name = (spider.getName())
            site_dic = {
                "key": file_name.split(".py")[0],
                "name": name,
                "type": 3,
                "api": file_name.split(".py")[0],
                "ext":"{}/py/{}".format(LocalAddress,file_name),
                # "ext": {
                #     "py_url":"{}/py/{}".format(LocalAddress,file_name),
                #      "token":"test"}
            }
            if "douban" in file_name:
                pass
            else:
                site_dic["playerType"] = 1 ## 阿里使用LJK

            site_list.append(site_dic)
    site_list = sorted(site_list,key=sort_by_name)
    print(site_list)
    spider_json["sites"] = site_list
    with open("config.json","wb") as f:
        f.write(json.dumps(spider_json,indent=4,ensure_ascii=False).encode("utf-8"))

if __name__ == '__main__':
    generate_json()
