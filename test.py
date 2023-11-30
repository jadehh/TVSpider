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
    # content_list = spider.homeContent(True)
    # so
    #content_list = spider.searchContent("莲花楼")["list"]
    content_list = spider.categoryContent(1,1,True,None)["list"]

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
        # vod_url_list = detail_content['list'][0]['vod_play_url'].split("$$$")[0].split("#")
        # print(content["vod_name"],content["vod_id"])
        # for vod_url in vod_url_list:
        #     id = vod_url.split("$")[-1]
        #     print(spider.playerContent("原画", id, [])["url"])
        # print("######################################################")

    print(time.time()-start_time)

def test_ali():
    from py.py_ali import Spider
    spider = Spider()
    dic = {'list': [{'vod_id': 'https://www.aliyundrive.com/s/hnWeeeNjbdq',
                     'vod_name': 'AI创世者 2023 tc 抢鲜版中字 动作 科幻 惊悚',
                     'vod_pic': 'https://img.aliyundrive.com/avatar/c584fe2ebb9e4792894241d5c4429b76.jpeg',
                     'vod_content': 'https://www.aliyundrive.com/s/hnWeeeNjbdq',
                     'vod_play_from': 'AliYun$$$AliYun原画',
                     'vod_play_url': 'AI 创世者 The.Creator.2023.mp4$hnWeeeNjbdq+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiaG5XZWVlTmpiZHFcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTY5OTk1ODM5NCwiaWF0IjoxNjk5OTUxMTM0fQ.F0l2-K_49mX5s_YFBQ6lqa9YF2u3LZh8Sw-93QE3GjnfZ5j39gtt0y7hfolNlVSUAubuRwz7d4gxAdehtqLnI-vTYaVOp6EkUNNh3vExBb_XfFynSTvQcPUNb0BOuI6RsWp0cUQdC4VKzBZ5kB2C5l9MYk6xqeid26DDyNS4bR0+6552f0ded3fb9e12d1944eb7a5a3bc8aa5dc3e9c+video#AI创世者2023.1080P.官方英语中字.mp4$hnWeeeNjbdq+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiaG5XZWVlTmpiZHFcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTY5OTk1ODM5NCwiaWF0IjoxNjk5OTUxMTM0fQ.F0l2-K_49mX5s_YFBQ6lqa9YF2u3LZh8Sw-93QE3GjnfZ5j39gtt0y7hfolNlVSUAubuRwz7d4gxAdehtqLnI-vTYaVOp6EkUNNh3vExBb_XfFynSTvQcPUNb0BOuI6RsWp0cUQdC4VKzBZ5kB2C5l9MYk6xqeid26DDyNS4bR0+6552f121a01865959eb143c490af2f6b9ace6b62+video#The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv$hnWeeeNjbdq+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiaG5XZWVlTmpiZHFcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTY5OTk1ODM5NCwiaWF0IjoxNjk5OTUxMTM0fQ.F0l2-K_49mX5s_YFBQ6lqa9YF2u3LZh8Sw-93QE3GjnfZ5j39gtt0y7hfolNlVSUAubuRwz7d4gxAdehtqLnI-vTYaVOp6EkUNNh3vExBb_XfFynSTvQcPUNb0BOuI6RsWp0cUQdC4VKzBZ5kB2C5l9MYk6xqeid26DDyNS4bR0+6552f246d7de3d3ca0294c289595b4f78bea5ec6+video#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv$hnWeeeNjbdq+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiaG5XZWVlTmpiZHFcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTY5OTk1ODM5NCwiaWF0IjoxNjk5OTUxMTM0fQ.F0l2-K_49mX5s_YFBQ6lqa9YF2u3LZh8Sw-93QE3GjnfZ5j39gtt0y7hfolNlVSUAubuRwz7d4gxAdehtqLnI-vTYaVOp6EkUNNh3vExBb_XfFynSTvQcPUNb0BOuI6RsWp0cUQdC4VKzBZ5kB2C5l9MYk6xqeid26DDyNS4bR0+6552e9df6b63813afc9741ecac6b8275d3bea1dc+video$$$AI 创世者 The.Creator.2023.mp4$hnWeeeNjbdq+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiaG5XZWVlTmpiZHFcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTY5OTk1ODM5NCwiaWF0IjoxNjk5OTUxMTM0fQ.F0l2-K_49mX5s_YFBQ6lqa9YF2u3LZh8Sw-93QE3GjnfZ5j39gtt0y7hfolNlVSUAubuRwz7d4gxAdehtqLnI-vTYaVOp6EkUNNh3vExBb_XfFynSTvQcPUNb0BOuI6RsWp0cUQdC4VKzBZ5kB2C5l9MYk6xqeid26DDyNS4bR0+6552f0ded3fb9e12d1944eb7a5a3bc8aa5dc3e9c+video#AI创世者2023.1080P.官方英语中字.mp4$hnWeeeNjbdq+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiaG5XZWVlTmpiZHFcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTY5OTk1ODM5NCwiaWF0IjoxNjk5OTUxMTM0fQ.F0l2-K_49mX5s_YFBQ6lqa9YF2u3LZh8Sw-93QE3GjnfZ5j39gtt0y7hfolNlVSUAubuRwz7d4gxAdehtqLnI-vTYaVOp6EkUNNh3vExBb_XfFynSTvQcPUNb0BOuI6RsWp0cUQdC4VKzBZ5kB2C5l9MYk6xqeid26DDyNS4bR0+6552f121a01865959eb143c490af2f6b9ace6b62+video#The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv$hnWeeeNjbdq+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiaG5XZWVlTmpiZHFcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTY5OTk1ODM5NCwiaWF0IjoxNjk5OTUxMTM0fQ.F0l2-K_49mX5s_YFBQ6lqa9YF2u3LZh8Sw-93QE3GjnfZ5j39gtt0y7hfolNlVSUAubuRwz7d4gxAdehtqLnI-vTYaVOp6EkUNNh3vExBb_XfFynSTvQcPUNb0BOuI6RsWp0cUQdC4VKzBZ5kB2C5l9MYk6xqeid26DDyNS4bR0+6552f246d7de3d3ca0294c289595b4f78bea5ec6+video#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv$hnWeeeNjbdq+eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0b21Kc29uIjoie1wiZG9tYWluX2lkXCI6XCJiajI5XCIsXCJzaGFyZV9pZFwiOlwiaG5XZWVlTmpiZHFcIixcImNyZWF0b3JcIjpcImUwYzhlZTZhYWYwZjQ5YzU5MDZhYWVmZWUzM2IzMDk2XCIsXCJ1c2VyX2lkXCI6XCJhbm9ueW1vdXNcIn0iLCJjdXN0b21UeXBlIjoic2hhcmVfbGluayIsImV4cCI6MTY5OTk1ODM5NCwiaWF0IjoxNjk5OTUxMTM0fQ.F0l2-K_49mX5s_YFBQ6lqa9YF2u3LZh8Sw-93QE3GjnfZ5j39gtt0y7hfolNlVSUAubuRwz7d4gxAdehtqLnI-vTYaVOp6EkUNNh3vExBb_XfFynSTvQcPUNb0BOuI6RsWp0cUQdC4VKzBZ5kB2C5l9MYk6xqeid26DDyNS4bR0+6552e9df6b63813afc9741ecac6b8275d3bea1dc+video'}]}
    play_url = dic["list"][0]["vod_play_url"]
    print(spider.playerContent("AliYun原画", play_url, None))


def test_rtmp():
    import cv2
    capture = cv2.VideoCapture("http://192.168.40.215:7001/live/rfBd56ti2SMtYvSgD5xAV0YU99zampta7Z7S575KLkIZ9PYk.flv")
    print(capture.isOpened())
    while True:
        ret, frame = capture.read()
        cv2.namedWindow("result", 0)
        cv2.imshow("result", frame)
        cv2.waitKey(1)


def test_logger():
    from py.py_wanou import Ali
    ali = Ali()
    ali.logger.error("阿里")
    # logger_test = Logger()
    # logger_test.print()
    # ali = Ali()
    # ali.logger.error("阿里")

def test_douban():
    from py.py_douban import Spider
    spider = Spider()
    spider.homeContent(True)

    x = {"jx": 0, "limit": 72, "list": [
        {"vod_id": "/index.php/voddetail/82261.html", "vod_name": "那夜凌晨，我坐上了旺角开往大埔的红VAN",
         "vod_pic": "https://svip.picffzy.com/upload/vod/20230313-1/f803ec81df8d20baebdb3a15a3880ea6.jpg",
         "vod_remarks": "HD国语"}],
         "page": 1, "pagecount": 39, "parse": 0, "total": 2759}


def test_android_toast():
    from kivy.app import App  # 引入App库，App库是Kivy开发的核心，必须引入
    from kivy.uix.button import Button  # 引入Button（按钮）控件
    from kivy.uix.boxlayout import BoxLayout  # 引入布局

    class IndexPage(BoxLayout):  # 自定义根布局名称，并继承对应类型的布局
        def __init__(self, **kwargs):
            super().__init__(**kwargs)
            button = Button(text="Hello world")  # 实例化Button控件，并修改text属性
            self.add_widget(button)  # 通过add_widget函数将Button控件引入布局中

    class TestApp(App):  # 单独构建App导入框架
        def build(self):
            return IndexPage()  # 返回布局，相当于在软件中绘制布局及其中内容

    TestApp().run()  # 运行软件

def test_gitcafe():
    from py.py_gitcafe import Spider
    import time
    start_time = time.time()
    print(GetTimeStamp())

    spider = Spider()
    spider.init()
    content_list = spider.homeContent(True)
    # # content_list = spider.categoryContent(1,1,True,{'11': '2023'})["list"]
    #
    # for content in [content_list[1]]:
    #     vod_url_list = spider.detailContent([content['vod_id']])['list'][0]['vod_play_url'].split("$$$")[0].split("#")
    #     print(content["vod_name"], content["vod_id"])
    #     for vod_url in vod_url_list:
    #         id = vod_url.split("$")[-1]
    #         print(spider.playerContent("原画", id, [])["url"])
    #     print("######################################################")

    print(time.time() - start_time)


if __name__ == '__main__':
    test_wanou()
