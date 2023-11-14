#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : test.py
# @Author   : jade
# @Date     : 2023/11/13 16:42
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
from py.py_wanou import *
def test_kunyun77():
    filter = ""
    spider = Spider()
    print(spider.homeContent(filter))
    print(spider.categoryContent("1","",filter,{}))
    print(spider.homeVideoContent())

def test_wanou():
    filter = ""
    spider = Spider()
    print(spider.homeContent(filter))
    print(spider.categoryContent("1","",filter,{}))
    print(spider.homeVideoContent())

if __name__ == '__main__':
    test_kunyun77()