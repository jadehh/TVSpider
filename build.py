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
    def __init__(self, channelKey,aliToken, biliCookie,quarkCookie, is_18="False"):
        self.is_18 = str_to_bool(is_18)
        self.quarkCookie = quarkCookie
        self.aliToken = aliToken
        self.biliCookie = biliCookie
        self.jsMouleList = self.getJsFile(channelKey)
        super().__init__()

    def getJsFile(self,channelKey):
        jsMoudleList = []
        js_path = "js"
        fileList = os.listdir(js_path)
        for fileName in fileList:
            jsMoudle = JSMoudle(js_path + "/" + fileName)
            if jsMoudle.getName() is not None:
                if len(channelKey):
                    if channelKey == jsMoudle.getJSName():
                        jsMoudleList.append(jsMoudle)
                else:
                    jsMoudleList.append(jsMoudle)
        return jsMoudleList

    def getBaseConfig(self, baseObj, jsMoudle, tvType="TVBox"):
        baseObj["key"] = jsMoudle.js_name
        baseObj["name"] = jsMoudle.getName()
        baseObj["ext"] = {"box": tvType}
        baseObj["api"] = "./" + jsMoudle.js_file
        baseObj["type"] = jsMoudle.getType()
        return baseObj

    def getCustomConfig(self, baseObj, jsMoudle):
        if "阿里" in jsMoudle.getAppName() or "厂长直连" in jsMoudle.getAppName():
            baseObj["ext"]["aliToken"] = self.aliToken
            baseObj["ext"]["quarkCookie"] = self.quarkCookie
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
                writeContent = writeContent + str(content, encoding="utf-8").replace("aliTemp", self.aliToken).replace("quarkTemp",self.quarkCookie).replace(
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
    parser.add_argument('--key', type=str, default="")  ## 添加环境变量
    parser.add_argument('--aliToken', type=str, default="")  ## 添加环境变量
    parser.add_argument('--is_18', type=str, default="False")  ## 添加
    parser.add_argument('--biliCookie', type=str,
                        default="")  ## 添加
    parser.add_argument('--quarkCookie', type=str,
                        default="")  ## 添加
    
    args = parser.parse_args()
    build = Build(channelKey=args.key,aliToken=args.aliToken.split(",")[0], biliCookie=args.biliCookie.split(",")[0],quarkCookie=args.quarkCookie.split(",")[0], is_18=args.is_18)
    build.build()
