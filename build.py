#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : buildConfig.py
# @Author   : jade
# @Date     : 2024/4/22 10:53
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     : 生成配置文件，包含Config,Dist分支
import json
import os
from jade import str_to_bool, CreateSavePath, GetLastDir, GetTimeStamp
import argparse


class JSMoudle():
    def __init__(self, js_file):
        self.js_file = js_file
        self.js_name = GetLastDir(js_file).split(".")[0]
        self.is_18 = False
        self.getContent()

    def getContent(self):
        with open(self.js_file, "rb") as f:
            self.js_str = str(f.read(), encoding="utf-8")
            if "🔞" in self.js_str:
                self.is_18 = True

    def getName(self):
        try:
            name = (self.js_str.split("getName()")[-1].split("}")[0].split("return")[-1].split('"')[1])
            return name
        except:
            return None

    def getAppName(self):
        try:
            name = (self.js_str.split("getAppName()")[-1].split("}")[0].split("return")[-1].split('"')[1])
            return name
        except Exception as e:
            return None

    def getJSName(self):
        try:
            name = (self.js_str.split("getJSName()")[-1].split("}")[0].split("return")[-1].split('"')[1])
            return name
        except:
            return None

    def getType(self):
        try:
            name = (self.js_str.split("getType()")[-1].split("}")[0].split("return")[-1])
            return int(name.strip())
        except:
            return None


class Build():
    def __init__(self, aliToken, biliCookie, is_18="False"):
        self.is_18 = str_to_bool(is_18)
        self.aliToken = aliToken
        self.biliCookie = biliCookie
        self.jsMouleList = self.getJsFile()
        super().__init__()

    def getJsFile(self):
        jsMoudleList = []
        js_path = "js"
        fileList = os.listdir(js_path)
        for fileName in fileList:
            jsMoudle = JSMoudle(os.path.join(js_path, fileName))
            if jsMoudle.getName() is not None:
                jsMoudleList.append(jsMoudle)
        return jsMoudleList

    def getBaseConfig(self, baseObj, jsMoudle, tvType="TVBox"):
        baseObj["key"] = jsMoudle.js_name
        baseObj["name"] = jsMoudle.getName()
        baseObj["ext"] = {"box": tvType}
        baseObj["api"] = jsMoudle.js_file
        baseObj["type"] = jsMoudle.getType()
        return baseObj

    def getCustomConfig(self, baseObj, jsMoudle):
        if "阿里" in jsMoudle.getAppName() or "厂长直连" in jsMoudle.getAppName():
            baseObj["ext"]["token"] = self.aliToken
        elif jsMoudle.getAppName() == "泥视频":
            baseObj["ext"]["code"] = int(self.is_18)
        elif jsMoudle.getAppName() == "量子资源":
            baseObj["ext"]["code"] = int(self.is_18)
        elif jsMoudle.getAppName() == "哔哩哔哩":
            baseObj["ext"]["cookie"] = self.biliCookie
        return baseObj

    def getConfig(self, tyType="TVBox", type=3):
        baseObj = {"key": "", "name": "", "api": "", "timeout": 30, "ext": {}}
        if type == 3:
            baseObj["playerType"] = 0
        siteList = []
        for jsMoudle in self.jsMouleList:
            if jsMoudle.is_18 == self.is_18 and jsMoudle.getType() == type:
                siteObj = baseObj.copy()
                siteObj = self.getBaseConfig(siteObj, jsMoudle, tyType)
                siteObj = self.getCustomConfig(siteObj, jsMoudle)
                siteList.append(siteObj)
        return siteList

    def getJsList(self, tyType="TVBox", type=3):
        jsList = []
        for jsMoudle in self.jsMouleList:
            if jsMoudle.is_18 == self.is_18 and jsMoudle.getType() == type:
                jsList.append(jsMoudle)
        return jsList

    def getConfigByTvType(self, tvType):
        videoConfig = self.getConfig(tvType, 3)
        bookConfig = self.getConfig(tvType, 10)
        carToonConfig = self.getConfig(tvType, 20)
        jsonConfig = self.getJsonConfigByTvType(tvType)
        return videoConfig, bookConfig, carToonConfig, jsonConfig

    def getJsonConfigByTvType(self, tvType):
        jsonPath = "json"
        with open(os.path.join(jsonPath, "{}.json".format(tvType)), "rb") as f:
            return json.load(f)

    def writeJsonConfig(self, tvType, jsonConfig):
        config_name = "{}_config.json".format(tvType)
        if self.is_18:
            config_name = "18_" + config_name
        with open(config_name, "wb") as f:
            f.write(json.dumps(jsonConfig, indent=4, ensure_ascii=False).encode("utf-8"))

    def writeTVConfig(self):
        print("Write TV Config")
        tvType = "TVBox"
        videoConfig, bookConfig, carToonConfig, jsonConfig = self.getConfigByTvType(tvType)
        jsonConfig["sites"] = videoConfig
        self.writeJsonConfig("tv", jsonConfig)

    def writeOpenConfig(self):
        print("Write Open Config")
        tvType = "CatOpen"
        videoConfig, bookConfig, carToonConfig, jsonConfig = self.getConfigByTvType(tvType)
        jsonConfig["video"]["sites"] = videoConfig
        jsonConfig["read"]["sites"] = bookConfig
        self.writeJsonConfig("open", jsonConfig)

    def jsToNodejs(self, jsList, typeName="video"):
        nodejsPath = "nodejs/src/spider/"
        savePath = CreateSavePath(os.path.join(nodejsPath, typeName))
        for jsMoudle in jsList:
            write_content = ""
            with open(os.path.join(nodejsPath, "tmpSpider.txt"), "rb") as f:
                contentlist = f.readlines()
                for content in contentlist:
                    write_content = write_content + str(content, encoding="utf-8").replace("temp",
                                                                                           jsMoudle.getJSName()).replace(
                        "updateTime", GetTimeStamp())
                saveJsPath = os.path.join(nodejsPath, typeName, GetLastDir(jsMoudle.js_file))
                with open(saveJsPath, "wb") as f:
                    f.write(write_content.encode("utf-8"))
        fileList = []
        fileNameList = os.listdir(os.path.join(nodejsPath, typeName))
        for fileName in fileNameList:
            fileList.append(fileName)
        writeContent,spiderList = self.getImportNameByType(fileList,typeName)
        return writeContent,spiderList

    def getImportNameByType(self,fileList,typeName="video"):
        writeRoutersContent = ""
        spiderList = []
        for fileName in fileList:
            jsName = fileName.split(".")[0]
            spiderList.append(jsName)
            importStr = "import {} from './spider/{}/{}.js';\n".format(jsName, typeName, jsName)
            writeRoutersContent = writeRoutersContent + importStr
        return writeRoutersContent,spiderList


    def writeRouterJs(self,writeRouterStr,spiderList):
        writeRouterStr = writeRouterStr  + "const spiders = [{}];".format(",".join(spiderList)) + "\n"
        with open("nodejs/src/router.txt", "rb") as f:
            contentlist = f.readlines()
            for content in contentlist:
                writeRouterStr = writeRouterStr + str(content, encoding="utf-8")
        with open("nodejs/src/router.js", "wb") as f:
            f.write(writeRouterStr.encode("utf-8"))

    def writeNodeConfig(self):
        writeContent = ""
        with open("nodejs/src/index.config.txt", "rb") as f:
            contentlist = f.readlines()
            for content in contentlist:
                writeContent = writeContent + str(content, encoding="utf-8").replace("temp", self.aliToken).replace(
                    "bilitmep", self.biliCookie) + "\n"
        with open("nodejs/src/index.config.js", "wb") as f:
            f.write(writeContent.encode("utf-8"))

    def writeDistConfig(self):
        tvType = "CatOpen"
        videoWriteContent,videoSpiderList = self.jsToNodejs(self.getJsList(tvType, type=3), "video")
        self.jsToNodejs(self.getJsList(tvType, type=10), "book")
        bookWriteContent,bookSpiderList = self.jsToNodejs(self.getJsList(tvType, type=20), "book")
        panWriteContent,panSpiderList = self.jsToNodejs([], "pan")
        videoSpiderList.extend(bookSpiderList)
        videoSpiderList.extend(panSpiderList)
        self.writeRouterJs(videoWriteContent+bookWriteContent+panWriteContent,videoSpiderList)
        self.writeNodeConfig()
    def build(self):
        self.writeTVConfig()
        self.writeOpenConfig()
        self.writeDistConfig()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--aliToken', type=str, default="6827db23e5474d02a07fd7431d3d5a5a")  ## 添加环境变量
    parser.add_argument('--is_18', type=str, default="False")  ## 添加
    parser.add_argument('--biliCookie', type=str,
                        default="buvid3=02675249-8ED3-C418-87F5-59E18316459714816infoc; b_nut=1704421014; _uuid=5D435F74-F574-D9AB-62C1-B9294DE465D913102infoc; buvid_fp=e8c5650c749398e9b5cad3f3ddb5081e; buvid4=007E85D1-52C1-7E6E-07CF-837FFBC9349516677-024010502-J5vTDSZDCw4fNnXRejbSVg%3D%3D; rpdid=|()kYJmulRu0J'u~|RRJl)JR; PVID=1; SESSDATA=3be091d3%2C1720332009%2C699ed%2A11CjAcCdwXG5kY1umhCOpQHOn_WP7L9xFBfWO7KKd4BPweodpR6VyIfeNyPiRmkr5jCqsSVjg0R0dZOVVHRUo3RnhPRTZFc3JPbGdiUjFCdHpiRDhiTkticmdKTjVyS1VhbDdvNjFMSDJlbUJydUlRdjFUNGFBNkJlV2ZTa0N1Q1BEVi1QYTQzTUh3IIEC; bili_jct=b0ee7b5d3f27df893545d811d95506d4; DedeUserID=78014638; DedeUserID__ckMd5=4c8c5d65065e468a; enable_web_push=DISABLE; header_theme_version=CLOSE; home_feed_column=5; CURRENT_BLACKGAP=0; CURRENT_FNVAL=4048; b_lsid=75E916AA_18EA1A8D995; bsource=search_baidu; FEED_LIVE_VERSION=V_HEADER_LIVE_NO_POP; browser_resolution=1507-691; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTIzNjk5MTMsImlhdCI6MTcxMjExMDY1MywicGx0IjotMX0.8zQW_fNTCSBlK_JkHnzu3gDw62wuTK1qgKcbGec3swM; bili_ticket_expires=171236985")  ## 添加
    args = parser.parse_args()
    build = Build(aliToken=args.aliToken, biliCookie=args.biliCookie, is_18=args.is_18)
    build.build()
