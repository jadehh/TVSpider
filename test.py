#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_test.py
# @Author   : jade
# @Date     : 2023/11/13 16:42
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import json
import os

import requests

os.environ['HOME'] = "tmp"
if os.path.exists("tmp"):
    pass
else:
    os.mkdir("tmp")
import time



def test_ali():
    from py.py_douban import Ali
    ali = Ali()
    ali.getDriveId()


def test_spider(Spider):
    start_time = time.time()
    spider = Spider()
    spider.init()
    content_list = spider.homeContent(True)["list"]
    content_list = spider.searchContent("王牌对王牌")["list"]
    # content_list = spider.categoryContent("1",1,None,None)["list"]
    for content in [content_list[2]]:
        vod_url_list = spider.detailContent([content['vod_id']])['list'][0]['vod_play_url'].split("$$$")[0].split("#")
        print(content["vod_name"], content["vod_id"])
        for vod_url in vod_url_list:
            id = vod_url.split("$")[-1]
            print(spider.playerContent("原画", id, [])["url"])
            break
        print("######################################################")
    print(time.time() - start_time)


def test_wanou():
    from py.py_wanou import Spider
    test_spider(Spider)

def test_yunpanshare():
    from py.py_yunpanshare import Spider
    test_spider(Spider)



def test_douban():
    from py.py_douban import Spider
    spider = Spider()
    spider.init(False)
    # spider.homeContent(True)
    # spider.categoryContent("movie",1,True,{})
    content_list = spider.searchContent("王牌对王牌")["list"]
    # for content in [content_list[0]]:
    #     vod_url_list = spider.detailContent([content['vod_id']])['list'][0]['vod_play_url'].split("$$$")[0].split("#")


def test_gitcafe():
    from py.py_gitcafe import Spider
    test_spider(Spider)





def test_pansou():
    from py.py_pansou import Spider
    test_spider(Spider)


def test_test():
    from py.py_test import Spider
    test_spider(Spider)


def test_re():
    import re
    share_url_list = ["https://www.alipan.com/s/gS9SkxCHki9",
                      "https://www.alipan.com/s/gS9SkxCHki9/folder/657546c6661ec8b988924dc1945756a1f5e95e27"]
    for share_url in share_url_list:
        if "www.aliyundrive.com" in share_url:
            m = re.search('www.aliyundrive.com\\/s\\/([^\\/]+)(\\/folder\\/([^\\/]+))?',
                          share_url).groups()
        elif "www.alipan.com" in share_url:
            re_str = "https://www.alipan.com\\/s\\/([^\\/]+)(\\/folder\\/([^\\/]+))?"
            m = re.search(re_str, share_url).groups()
        else:
            print("不支持的URL")
        print(m[0])

def test_logging():
    from jade import JadeLogging
    JadeLog = JadeLogging()
    JadeLog.INFO("第一行输出")
    JadeLog.ERROR("第二行输出")

def test_js_log_to_txt():
    with open("tmp/js_log","rb") as f:
        js_log_dic = json.load(f)
    with open("tmp/log.txt","wb") as f:
        for value in js_log_dic.values():
            f.write((value + "\n").encode("utf-8"))
if __name__ == '__main__':
    test_pansou()
