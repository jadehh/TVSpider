#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : samplesHttpServer.py
# @Author   : jade
# @Date     : 2024/4/13 11:15
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
from jade import *
from tornado import ioloop
from tornado.httpserver import HTTPServer
from tornado.web import Application
from src.samplesConfig import JadeLog

from tornado.web import  RequestHandler
import json
class upload(RequestHandler):
    def get(self, *args, **kwargs):
        JadeLog.DEBUG("获取到日志请求,准备写入文件")
        try:
            log_str = json.loads(str(self.request.body,encoding="utf-8"))["log"]
            CreateSavePath("UploadLog")
            with open("UploadLog/info.log","ab") as f:
                f.write((log_str).encode("utf-8"))
                self.set_status(200)
                self.write({"status":200,"data":"日志文件写入完成"})
        except Exception as e:
            self.set_status(400)
            self.write({"status": 400, "data": "日志文件失败,失败原因为:{}".format(e)})
            JadeLog.ERROR("日志文件获取失败,失败原因为:{}".format(e))

class show(RequestHandler):
    def get(self, *args, **kwargs):
        JadeLog.DEBUG("查看日志请求")
        try:
            with open("UploadLog/info.log","rb") as f:
                content_list = f.readlines()
                for content in content_list:
                    content = str(content,encoding="utf-8").strip("\n")
                    self.write(content + '<br>')
        except Exception as e:
            self.set_status(400)
            self.write({"status": 400, "data": "查看失败,失败原因为:{}".format(e)})
            JadeLog.ERROR("日志文件获取失败,失败原因为:{}".format(e))

class clear(RequestHandler):
    def get(self, *args, **kwargs):
        JadeLog.DEBUG("清除日志")
        try:
            os.remove("UploadLog/info.log")
            self.set_status(200)
            self.write({"status": 200, "data": "清除成功"})
        except Exception as e:
            self.set_status(400)
            self.write({"status": 400, "data": "清除失败,失败原因为:{}".format(e)})
            JadeLog.ERROR("日志文件获取失败,失败原因为:{}".format(e))

class SamplesHttpServer(object):
    def __init__(self, port):
        self.port = port
        super(SamplesHttpServer, self).__init__()

    def StartServerThread(self):
        self.thread = Thread(target=self.StartServer)
        self.thread.start()

    def StartServer(self):
        self.app = Application([
            (r"/upload(.*)", upload),
            (r"/show", show),
            (r"/clear", clear),
        ])
        http_server = HTTPServer(self.app, max_buffer_size=1024 * 1024 * 1024 * 1024,max_body_size = 1024 * 1024 * 1024 * 1024 )
        try:
            http_server.listen(self.port)
            JadeLog.INFO("服务启动完成,端口号为:{}".format(self.port), True)
            ioloop.IOLoop.current().start()
        except Exception as e:
            JadeLog.ERROR("服务启动失败,端口号为:{},失败原因为:{}".format(self.port,e))


if __name__ == '__main__':
    samplesHttpService = SamplesHttpServer(10087)
    samplesHttpService.StartServerThread()