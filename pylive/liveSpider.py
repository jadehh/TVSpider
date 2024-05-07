#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : liveSpider.py
# @Author   : jade
# @Date     : 2024/5/7 13:59
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     : 直播爬虫
import os
import time

import m3u8
import requests
from lxml import etree
from jade import JadeLogging, CreateSavePath
from m3u8 import M3U8
from pylive.mp4Info import Mp4Info
import threading
import json

JadeLog = JadeLogging("log", Level="INFO")


class MyThread(threading.Thread):
    def __init__(self, target, args=()):
        super(MyThread, self).__init__()
        self.target = target
        self.args = args
        self.result = None

    def run(self):
        self.result = self.target(*self.args)


class LiveSpider(object):
    def __init__(self):
        self.siteUrl = "http://tonkiang.us"
        self.liveRoomPath = "liveRoom"
        self.maxPage = 1
        self.maxReconnect = 3
        self.maxTsDownloadTimes = 2
        self.reconnect = 0
        self.sleepTime = 3
        self.timeout = 3
        self.maxSize = 1024 * 1024 * 5
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"}
        self.tmpPath = CreateSavePath("tmp")
        self.saveJsonPath = CreateSavePath("json")
        self.saveLivePath = CreateSavePath("live")
        self.sortKeys = ["cctv", "lstv", "hktv"]

        super().__init__()

    def sortFileList(self, fileList):
        newFileList = []
        for key in self.sortKeys:
            for fileName in fileList:
                if key in fileName:
                    newFileList.append(fileName)
                    break
        return newFileList

    def getSearchResult(self):
        fileList = self.sortFileList(os.listdir(self.liveRoomPath))
        for fileName in fileList:
            playJson = {}
            playList = []
            with open(os.path.join(self.liveRoomPath, fileName), "rb") as f:
                fileName = fileName.split(".")[0]
                contentList = f.readlines()
                for content in contentList:
                    name = str(content, encoding="utf-8").strip()
                    if name:
                        playUrl = self.spiderSearch(name)
                        playJson[name] = playUrl
                        playList.append(("{},{}".format(name, playUrl) + "\n"))
                with open(os.path.join(self.saveLivePath, "{}_live.txt".format(fileName)), "wb") as f1:
                    f1.write("{},#genre#\n".format(fileName).encode("utf-8"))
                    for playUrl in playList:
                        f1.write(playUrl.encode("utf-8"))
                    f1.write("\n".encode("utf-8"))

                with open(os.path.join(self.saveJsonPath, "{}_live.json".format(fileName)), "wb") as f2:
                    f2.write(json.dumps(playJson, indent=4, ensure_ascii=False).encode("utf-8"))

    def getParams(self, name):
        return {"search": f"{name}", "Submit": " "}

    def fetch(self, url, headers, data, verify):
        try:
            res = requests.get(url, headers=headers, data=data, verify=verify, timeout=self.timeout)
            if res.status_code == 200:
                self.reconnect = 0
                return res
            elif res.status_code != 200 and self.reconnect < self.maxReconnect:
                time.sleep(self.sleepTime)
                self.reconnect = self.reconnect + 1
                JadeLog.WARNING("Get请求失败,尝试第{}次重连".format(self.reconnect))
                return self.fetch(url, headers, data, verify)
            else:
                self.reconnect = 0
                JadeLog.ERROR("Get请求失败,超过最大重连次数,请检查连接:{}".format(url))
                return None
        except Exception as e:
            JadeLog.ERROR("Get请求失败,失败原因为:{}".format(e))
            raise e

    def post(self, url, headers, data, cookies, verify):
        try:
            res = requests.post(url, headers=headers, data=data, cookies=cookies, verify=verify)
            if res.status_code == 200:
                self.reconnect = 0
                return res
            elif res.status_code != 200 and self.reconnect < self.maxReconnect:
                time.sleep(self.sleepTime)
                self.reconnect = self.reconnect + 1
                JadeLog.WARNING("Post请求失败,尝试第{}次重连".format(self.reconnect))
                return self.fetch(url, headers, data, verify)
            else:
                self.reconnect = 0
                JadeLog.ERROR("Post请求失败,超过最大重连次数,请检查连接:{}".format(url))
                return None
        except Exception as e:
            JadeLog.ERROR("Post请求失败,失败原因为:{}".format(e))
            raise e

    def m3u8Get(self, url):
        try:
            res = requests.get(url, stream=True, timeout=self.timeout)
            for chunk in res.iter_content(chunk_size=2048):  # 1024B
                if chunk:
                    res.close()
                    return chunk
            return None
        except Exception as e:
            JadeLog.ERROR("播放链接为:{},请求失败".format(url))
            return None

    def tsGet(self, url):
        try:
            start = time.time()
            res = requests.get(url, verify=False, stream=True)
            res.raise_for_status()
            body = []
            for chunk in res.iter_content(1024):  # Adjust this value to provide more or less granularity.
                body.append(chunk)
                if time.time() > (start + self.timeout):
                    break  # You can set an error value here as well if you want.
            return b''.join(body)
        except Exception as e:
            JadeLog.ERROR("Get请求失败,失败原因为:{}".format(e))

    def getCookie(self, name):
        res = self.fetch(self.siteUrl, headers=self.headers, data=self.getParams(name), verify=False)
        if res:
            return res.cookies
        else:
            JadeLog.ERROR("名称为:{},获取COOKIE失败".format(name))
            return None

    def downloadTsUrl(self, segments):
        ## 计算下载速度,和 ts文件的分辨率
        startTime = time.time()
        totalSize = 0
        index = 1
        threadList = []
        for segment in segments:
            downloadStartTime = time.time()
            JadeLog.DEBUG("正在下载:{}文件".format(segment.absolute_uri))
            data = self.tsGet(segment.absolute_uri)
            use_time = time.time() - downloadStartTime
            JadeLog.DEBUG("文件:{},下载完成,耗时:{}s".format(segment.absolute_uri, ("%.2f" % (use_time))))
            if data is not None and use_time < 5:
                mp4Info = Mp4Info(data)
                totalSize = totalSize + len(data)
                index = index + 1
                if index > self.maxTsDownloadTimes:
                    break
            else:
                return 0, 0, "0*0"
        totalTime = time.time() - startTime
        averageSpeed = totalSize / totalTime / (1024 * 1024)  # 转换为MB/s
        return averageSpeed, mp4Info.videoWidth * mp4Info.videoWidth, mp4Info.aspect

    def downloadLiveUrl(self, m3u8Url):
        startTime = time.time()
        try:
            res = requests.get(m3u8Url, stream=True, timeout=self.timeout)
            data = b""
            for chunk in res.iter_content(chunk_size=1024 * 1024):  # 1024B
                if chunk:
                    data = data + chunk
                if len(data) >= self.maxSize:
                    res.close()
                    break
            mp4Info = Mp4Info(data)
            averageSpeed = len(data) / (time.time() - startTime) / (1024 * 1024)  # 转换为MB/s
            return averageSpeed, mp4Info.videoWidth * mp4Info.videoWidth, mp4Info.aspect
        except:
            return 0, 0, "0*0"

    def downloadM3U8Url(self, m3u8Url):
        res = self.m3u8Get(m3u8Url)
        try:
            if res:
                if b"EXTM3U" in res:
                    m3u8Object = M3U8(str(res, encoding="utf-8"), base_uri=m3u8Url.rsplit('/', 1)[0])
                    if 0 < len(m3u8Object.segments) < 10:  ## 防止有不是直播文件
                        return self.downloadTsUrl(m3u8Object.segments)
                    else:
                        return 0, 0, "0*0"
                else:
                    return self.downloadLiveUrl(m3u8Url)
            else:
                return 0, 0, "0*0"
        except:
            return 0, 0, "0*0"

    def selectBestUrl(self, name, m3u8List):
        maxQulity = 0
        maxQulityUrl = ""
        startTime = time.time()
        JadeLog.INFO("名称为:{},开始寻找最好的播放连接".format(name), True)
        threadList = []
        bestSpeed = 0
        bestAspect = ""
        for m3u8Url in m3u8List:
            mythread = MyThread(self.downloadM3U8Url, args=(m3u8Url,))
            mythread.start()
            threadList.append((mythread, m3u8Url))
        for (thread, m3u8Url) in threadList:
            thread.join()
            speed, resolution, aspect = thread.result
            if speed > 0:
                JadeLog.INFO(
                    "播放连接为:{},速度为:{}MB/s,分辨率为:{},测试完成".format(m3u8Url, ("%.2f" % speed), aspect))
            else:
                JadeLog.WARNING("播放连接为:{},资源失效".format(m3u8Url))
            if speed > 0.5:
                if resolution * speed > maxQulity:
                    maxQulity = resolution * speed
                    maxQulityUrl = m3u8Url
                    bestSpeed = speed
                    bestAspect = aspect
        JadeLog.INFO("名称为:{},最优播放链接为:{},速度为:{}MB/s,分辨率为:{},耗时:{}s".format(name, maxQulityUrl,
                                                                                            ("%.2f" % bestSpeed),
                                                                                            bestAspect, ("%.2f" % (
                        time.time() - startTime))))
        return maxQulityUrl

    def parseXML(self, name, html, m3u8List):
        root = etree.HTML(html)
        result_divs = root.xpath("//div[@class='resultplus']")
        for div in result_divs:
            a = div.xpath(".//a/div")
            for element in div.xpath(".//tba"):
                if element.text is not None:
                    if (a[0].text.strip().lower() == name.lower()):
                        m3u8List.append(element.text.strip())
        return m3u8List

    def spiderSearch(self, name):
        cookies = self.getCookie(name)
        m3u8List = []
        for i in range(self.maxPage):
            time.sleep(self.sleepTime)
            response = self.post(self.siteUrl + f"/?page={i + 1}&s={name}", headers=self.headers,
                                 data=self.getParams(name), cookies=cookies, verify=False)
            if response:
                self.parseXML(name, response.text, m3u8List)
        return self.selectBestUrl(name, m3u8List)

    def run(self):
        searchNameList = self.getSearchResult()


if __name__ == '__main__':
    liveSpider = LiveSpider()
    liveSpider.getSearchList()
