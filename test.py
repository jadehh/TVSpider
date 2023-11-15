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
    from py.py_wanou import Spider
    filter = ""
    spider = Spider()
    print(spider.homeVideoContent())
    array = ['/index.php/voddetail/81437.html']
    print(spider.detailContent(array))
    a = {"format": "application/octet-stream",
         "header": "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36\",\"Referer\":\"https://www.aliyundrive.com/\"}",
         "jx": 0, "parse": 0, "subs": [
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#AI 创世者 The.Creator.2023.mp4 [4.80GB]$hnWeeeNjbdq"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv [14.36GB]$hnWeeeNjbdq"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#[4K 高码版 24G] The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.mkv [23.37GB]$hnWeeeNjbdq"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30#[4K高码HDR[外挂字幕]] The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv [14.35GB]$hnWeeeNjbdq"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f$$$AI创世者2023.1080P.官方英语中字.mp4 [2.35GB]$hnWeeeNjbdq"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#AI 创世者 The.Creator.2023.mp4 [4.80GB]$hnWeeeNjbdq"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv [14.36GB]$hnWeeeNjbdq"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#[4K 高码版 24G] The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.mkv [23.37GB]$hnWeeeNjbdq"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30#[4K高码HDR[外挂字幕]] The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv [14.35GB]$hnWeeeNjbdq"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f$$$AI创世者2023.1080P.官方英语中字.mp4 [2.35GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#AI 创世者 The.Creator.2023.mp4 [4.80GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv [14.36GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#[4K 高码版 24G] The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.mkv [23.37GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30#[4K高码HDR[外挂字幕]] The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv [14.35GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f$$$AI创世者2023.1080P.官方英语中字.mp4 [2.35GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#AI 创世者 The.Creator.2023.mp4 [4.80GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#The.Creator.2023.2160p.WEB-DL.DDP5.1.SDR.H265-AOC.mkv [14.36GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f#[4K 高码版 24G] The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.mkv [23.37GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa", "name": "The.Creator.2023.2160p.MA.WEB-DL.DDP5.1.Atmos.DV.HDR.H.265-FLUX.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6553478b0f2bd0a40fd14b16b2c21791c017af30#[4K高码HDR[外挂字幕]] The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.mkv [14.35GB]$5FAdyanvsY1"},
            {"format": "text/x-ssa",
             "name": "The.Creator.2023.2160p.AMZN.WEB-DL.DDP5.1.HDR.H.265-BasicallyMandalorian.chs",
             "url": "http://127.0.0.1:-1/proxy?do=ali&type=sub&shareId=hnWeeeNjbdq&fileId=6552f246e413941b16564e39817cd1252694e51f"}],
         "url": "https://cn-beijing-data.aliyundrive.net/XWzYu4mA%2F254324%2F6552b5a291af7d9c47c04787a77e4c4a6ef00e82%2F6552b5a2724ef2b998b145be9ea47022c6e25871?di=bj29&dr=303583582&f=65538281e8f99b75b6c245149399e0dc8e031f72&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27AI%25E5%2588%259B%25E4%25B8%2596%25E8%2580%25852023.1080P.%25E5%25AE%2598%25E6%2596%25B9%25E8%258B%25B1%25E8%25AF%25AD%25E4%25B8%25AD%25E5%25AD%2597.mp4&security-token=CAIS%2BgF1q6Ft5B2yfSjIr5DNJY%2FTjqx45rjTTnXXqXQYY7kUuJCajTz2IHFPeHJrBeAYt%2FoxmW1X5vwSlq5rR4QAXlDfNSvKWVaCqFHPWZHInuDox55m4cTXNAr%2BIhr%2F29CoEIedZdjBe%2FCrRknZnytou9XTfimjWFrXWv%2Fgy%2BQQDLItUxK%2FcCBNCfpPOwJms7V6D3bKMuu3OROY6Qi5TmgQ41Uh1jgjtPzkkpfFtkGF1GeXkLFF%2B97DRbG%2FdNRpMZtFVNO44fd7bKKp0lQLukMWr%2Fwq3PIdp2ma447NWQlLnzyCMvvJ9OVDFyN0aKEnH7J%2Bq%2FzxhTPrMnpkSlacGoABBtr6qYLcLke%2Bl07T6m0CBHTpVK3KURAFi73QfTL%2FoRWa4zcs33O6XUDLUPuko%2F7IJby%2Ffdg9IYggtYteBm%2B5fbHOUbSQwwYQoKARTOTlE66iEoAzZJEuqR98CwCoayeNWAObtfAHNtMiU%2Bn309ilaz0LGod7Uh3veYBu00jj5ycgAA%3D%3D&u=f20db5b2ffc94e08adfe08cee769ba7a&x-oss-access-key-id=STS.NSxn5gcsYQz8LSfMtMo68WU1o&x-oss-expires=1699972613&x-oss-signature=5CgZAije31eIvA1FlDA4eKAFisL9ORGYzdBkZjGdqaw%3D&x-oss-signature-version=OSS2"}


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


if __name__ == '__main__':
    test_kunyun77()
