#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : test.py
# @Author   : jade
# @Date     : 2023/11/13 16:42
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import os

os.environ['HOME'] = "tmp"
if os.path.exists("tmp"):
    pass
else:
    os.mkdir("tmp")
import logging
import logging.config


def test_kunyun77():
    from py.py_kunyu77 import Spider
    filter = ""
    spider = Spider()
    print(spider.homeVideoContent())
    array = [149031]
    print(spider.detailContent(array))

    spider.playerContent(None, 149031, None)


def test_wanou():
    from py.py_wanou import Spider
    import time
    start_time = time.time()
    spider = Spider()
    spider.init()
    #content_list = spider.homeContent(True)
    content_list = spider.searchContent("莲花楼")["list"]
    #content_list = spider.categoryContent(5,1,True,{"2":"score"})["list"]

    for content in [content_list[1]]:
        vod_url_list = spider.detailContent([content['vod_id']])['list'][0]['vod_play_url'].split("$$$")[0].split("#")
        print(content["vod_name"],content["vod_id"])
        for vod_url in vod_url_list:
            id = vod_url.split("$")[-1]
            print(spider.playerContent("原画", id, [])["url"])
        print("######################################################")

    print(time.time()-start_time)

def test_yunpanshare():
    from py.py_yunpanshare import Spider
    import time
    start_time = time.time()
    spider = Spider()
    spider.init()
    content_list = spider.homeContent(True)["list"]
    #content_list = spider.searchContent("莲花楼")["list"]
    #content_list = spider.categoryContent(1,1,True,{'11': '2023'})["list"]
    for content in content_list:
        detail_content = spider.detailContent([content['vod_id']])
        vod_url_list = detail_content['list'][0]['vod_play_url'].split("$$$")[0].split("#")
        print(content["vod_name"],content["vod_id"])
        for vod_url in vod_url_list:
            id = vod_url.split("$")[-1]
            print(spider.playerContent("原画", id, [])["url"])
        print("######################################################")

    print(time.time()-start_time)

def test_ali():
    from py.py_douban import Ali
    ali = Ali()
    ali.getDriveId()



def test_douban():
    from py.py_douban import Spider
    spider = Spider()
    spider.init(False)
    spider.homeContent(True)


def test_gitcafe():
    from py.py_gitcafe import Spider
    spider = Spider()
    spider.init()
    content_list = spider.searchContent("阿凡达")["list"]
    # content_list = spider.homeContent(True)["list"]
    # #content_list = spider.categoryContent(0,1,True,{'11': '2023'})["list"]
    for content in [content_list[1]]:
        vod_url_list = spider.detailContent([content['vod_id']])['list'][0]['vod_play_url'].split("$$$")[0].split("#")
        print(content["vod_name"], content["vod_id"])
        for vod_url in vod_url_list:
            id = vod_url.split("$")[-1]
            print(spider.playerContent("原画", id, [])["url"])
        print("######################################################")



if __name__ == '__main__':
    test_wanou()
