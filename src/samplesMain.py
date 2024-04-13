#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : samplesMain.py
# @Author   : jade
# @Date     : 2024/4/13 11:13
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :

from src.samplesHttpServer import SamplesHttpServer
def main():
    samplesHttpService = SamplesHttpServer(8099)
    samplesHttpService.StartServerThread()