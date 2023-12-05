#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : test.py
# @Author   : jade
# @Date     : 2023/11/13 16:42
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
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
    # content_list = spider.homeContent(True)["list"]
    # content_list = spider.searchContent("王牌对王牌")["list"]
    content_list = spider.categoryContent("https://www.alypw.com/category-2.html",1,None,None)["list"]
    for content in [content_list[0]]:
        vod_url_list = spider.detailContent([content['vod_id']])['list'][0]['vod_play_url'].split("$$$")[0].split("#")
        print(content["vod_name"], content["vod_id"])
        for vod_url in vod_url_list:
            id = vod_url.split("$")[-1]
            print(spider.playerContent("原画", id, [])["url"])
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
    spider.searchContent("王牌对王牌")


def test_gitcafe():
    from py.py_gitcafe import Spider
    test_spider(Spider)





def test_pansou():
    from py.py_pansou import Spider
    test_spider(Spider)



if __name__ == '__main__':
    test_douban()
