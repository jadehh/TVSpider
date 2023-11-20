#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : test.py
# @Author   : jade
# @Date     : 2023/11/13 16:42
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
def test_kunyun77():
    from py.py_kunyu77 import Spider
    filter = ""
    spider = Spider()
    print(spider.homeVideoContent())
    array = [149031]
    print(spider.detailContent(array))

    spider.playerContent(None, 149031, None)


def test_wanou():
    from py.py_wanou import Spider,Ali
    import time
    filter = ""
    start_time = time.time()

    spider = Spider()
    print(spider.homeContent(None))
    print(spider.homeVideoContent())
    array = ['/index.php/voddetail/81973.html']
    print(spider.detailContent(array))

    print(spider.playerContent("原画", "H2oBHmnjymZ+654e150e8d6019d56b014c6488691fe37986eb7c", []))
    # print(time.time()-start_time)


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
        ret,frame = capture.read()
        cv2.namedWindow("result",0)
        cv2.imshow("result",frame)
        cv2.waitKey(1)

if __name__ == '__main__':
    test_wanou()
