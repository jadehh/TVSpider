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


def generate_json():
    with open("json/spider.json", "rb") as f:
        spider_json = json.load(f)
    file_list = os.listdir("py")
    site_list = []
    for file_name in file_list:
        if "py_" in file_name:
            Spider = SourceFileLoader("Spider", os.path.join("py", file_name)).load_module().Spider
            spider = Spider()
            name = (spider.getName())
            site_dic = {
                "key": file_name.split(".py")[0],
                "name": name,
                "type": 3,
                "api": file_name.split(".py")[0],
                "ext": "{}/py/{}".format(LocalAddress,file_name)
            }
            if "douban" in name:
                site_dic["searchable"] = 1
                site_dic["changeable"] = 1
            else:
                site_dic["searchable"] = 1
                site_dic["quickSearch"] = 1
                site_dic["filterable"] = 1
            site_list.append(site_dic)
    spider_json["sites"] = site_list
    with open("config.json","wb") as f:
        f.write(json.dumps(spider_json,indent=4,ensure_ascii=False).encode("utf-8"))

if __name__ == '__main__':
    generate_json()
