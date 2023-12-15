#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : build.py
# @Author   : jade
# @Date     : 2023/12/15 17:23
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     : 自动生成config.json文件
import os
class JSMoudle():
    def __init__(self,js_file):
        self.js_file = js_file
        self.getContent()
    def getContent(self):
        with open(self.js_file, "rb") as f:
            self.js_str = str(f.read(),encoding="utf-8")
    def getName(self):
        name = (self.js_str.split("getName")[-1].split("}")[0].split("return")[-1].split('"')[1])
        print(name)

    def getAppName(self):
        name = (self.js_str.split("getAppName")[-1].split("}")[0].split("return")[-1].split('"')[1])
        print(name)


if __name__ == '__main__':
    jsMoudle = JSMoudle("js/wogg.js")
    jsMoudle.getName()
    jsMoudle.getAppName()