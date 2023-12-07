#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_test.py
# @Author   : jade
# @Date     : 2023/12/5 21:38
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_gitcafe.py.py
# @Author   : jade
# @Date     : 2023/11/28 17:15
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import json
import os
import copy
import sys
import time

if os.environ.get("HOME") == "tmp":
    sys.path.append("py")
    from py_douban import Ali, VodDetail, VodShort, Logger,BaseSpider
else:
    sys.path.append(os.path.join(os.path.dirname(os.environ.get("HOME")), "cache", "py"))
    from douban import Ali, VodDetail, VodShort, Logger,BaseSpider
class Spider(BaseSpider):
    def getName(self):
        return "┃测试┃"
    def init(self, extend=""):
        self.init_logger()
    ## 首页
    def homeContent(self, filter=True):
        result = {"jx": 0, "parse": 0}

        result["class"] = [{"type_name":"测试","type_id":"test"}]
        vod_short = VodShort()
        vod_short.vod_name = "test"
        vod_short.vod_id = "test"
        vod_list = [vod_short.to_dict()]
        result["list"] = vod_list
        return result

    # 首页界面
    def homeVideoContent(self):
        pass

    ## 分类详情
    def categoryContent(self, tid, pg, filter, extend):
        self.logger.info("tid:{},pg:{},filter:{},extend:{}".format(tid,pg,filter,extend))
        result = {}
        result["list"] = []
        return result

    ## 详情界面
    def detailContent(self, array):
        vod_detail = VodDetail()
        vod_detail.vod_name = "test"
        vod_detail.vod_play_from  = "test"
        vod_detail.vod_play_url = "test"
        result = {
            'list': [
                vod_detail.to_dict()
            ]
        }
        return result




    def searchContent(self, key, quick=False):
        if quick is False:
            self.getDoubanSearchStatus()
            ## 需要等待豆瓣搜索成功
        self.vod_douban_detail = self.json_to_vod(key)
        if self.vod_douban_detail:
            return {"jx": 0, "parse": 0,"list":[self.vod_douban_detail.to_dict()]}
        else:
            return {"jx": 0, "parse": 0,"list":[]}



    def playerContent(self, flag, id, vipFlags):
        # flag指的是vod format
        # id 指定的 url share_id+file_id
        result = {"format": "application/octet-stream",
                  "header": "{\"User-Agent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36\",\"Referer\":\"https://www.aliyundrive.com/\"}",
                  "jx": 0,
                  "parse": 0,
                  "url": ""}
        result["url"] = "https://jx.xyflv.cc/?url=https://v.youku.com/v_show/id_XNjE2NTM0Njc3Mg==.html?spm=a2hja.14919748_WEBHOME_NEW.drawer2.d_zj1_1&s=cb6397631fe440d9a538&scm=20140719.manual.35027.show_cb6397631fe440d9a538"
        self.logger.info(json.dumps(result,indent=4,ensure_ascii=False))
        return result


    def get_header(self):
        header = copy.copy(self.header)
        header["Host"] = "gitcafe.net"
        header["User-Agent"] = ""
        return header


    def isVideoFormat(self, url):
        pass

    def manualVideoCheck(self):
        pass

    def localProxy(self, param):
        pass