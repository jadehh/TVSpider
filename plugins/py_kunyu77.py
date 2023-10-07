#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : py_kunyu77.py.py
# @Author   : jade
# @Date     : 2023/10/7 15:58
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import sys
import json
import time
import hashlib
import requests
from urllib.parse import urlparse

sys.path.append('..')
from base.spider import Spider

class Spider(Spider):
	def getName(self):
		return "77"

	def init(self,extend=""):
		print("============{0}============".format(extend))
		pass

	def homeContent(self,filter):
		result = {}
		url = 'http://api.tyun77.cn/api.php/provide/filter'
		rsp = self.fetch(url,headers=self.header)
		jo = json.loads(rsp.text)
		classes = []
		jData = jo['data']
		for cKey in jData.keys():
			classes.append({
				'type_name':jData[cKey][0]['cat'].replace('电视剧', '剧集'),
				'type_id':cKey
			})
		result['class'] = classes
		if(filter):
			result['filters'] = self.config['filter']
		return result

	def homeVideoContent(self):
		url = 'http://api.tyun77.cn/api.php/provide/homeBlock?type_id=0'
		rsp = self.fetch(url,headers=self.header)
		jo = json.loads(rsp.text)
		blockList = jo['data']['blocks']
		videos = []
		for block in blockList:
			vodList = block['contents']
			for vod in vodList:
				videos.append({
					"vod_id":vod['id'],
					"vod_name":vod['title'],
					"vod_pic":vod['videoCover'],
					"vod_remarks":vod['msg']
				})
		result = {
			'list':videos
		}
		return result

	def categoryContent(self,tid,pg,filter,extend):
		result = {}
		ts = int(time.time())
		if 'type_id' not in extend.keys():
			extend['type_id'] = tid
		extend['pagenum'] = pg
		extend = {
			'pcode': '010110002',
			'version': '2.1.6',
			'devid': hashlib.md5(str(time.time()).encode()).hexdigest(),
			'package': 'com.sevenVideo.app.android',
			'sys': 'android',
			'sysver': 13,
			'brand': 'Redmi',
			'model': 'M2104K10AC',
			'pagesize': 24
		}
		url = 'https://api.tyun77.cn/api.php/provide/searchFilter'
		header = self.header.copy()
		header['t'] = str(ts)
		header['TK'] = self.get_tk(url, extend, ts)
		rsp = requests.get(url, params=extend, headers=header, timeout=5)
		jo = json.loads(rsp.text)
		if jo['code'] == 1004:
			rsp = requests.get('http://api.tyun77.cn/api.php/provide/getDomain', params=extend, headers=header, timeout=5)
			if rsp.json()['code'] != 1:
				rsp = requests.get(url, params=extend, headers=header, timeout=5)
				jo = json.loads(rsp.text)
			else:
				return {}
		vodList = jo['data']['result']
		videos = []
		for vod in vodList:
			videos.append({
				"vod_id":vod['id'],
				"vod_name":vod['title'],
				"vod_pic":vod['videoCover'],
				"vod_remarks":vod['msg']
			})
		result['list'] = videos
		result['page'] = pg
		result['pagecount'] = 9999
		result['limit'] = 90
		result['total'] = 999999
		return result

	def detailContent(self,array):
		tid = array[0]
		ts = int(time.time())
		params = {
			'pcode': '010110002',
			'version': '2.1.6',
			'devid': hashlib.md5(str(time.time()).encode()).hexdigest(),
			'package': 'com.sevenVideo.app.android',
			'sys': 'android',
			'sysver': 13,
			'brand': 'Redmi',
			'model': 'M2104K10AC'
		}
		params['ids'] = tid
		url = 'http://api.tyun77.cn/api.php/provide/videoDetail'
		header = self.header.copy()
		header['t'] = str(ts)
		header['TK'] = self.get_tk(url, params, ts)
		rsp = requests.get(url, headers=header, params=params, timeout=5)
		jo = json.loads(rsp.text)
		if jo['code'] != 1:
			rsp = requests.get('http://api.tyun77.cn/api.php/provide/getDomain', params=params, headers=header, timeout=5)
			if rsp.json()['code'] == 1:
				rsp = requests.get(url, params=params, headers=header, timeout=5)
				jo = json.loads(rsp.text)
			else:
				return {}
		node = jo['data']
		vod = {
			"vod_id":node['id'],
			"vod_name":node['videoName'],
			"vod_pic":node['videoCover'],
			"type_name":node['subCategory'],
			"vod_year":node['year'],
			"vod_area":node['area'],
			"vod_remarks":node['msg'],
			"vod_actor":node['actor'],
			"vod_director":node['director'],
			"vod_content":node['brief'].strip()
		}
		listUrl = 'http://api.tyun77.cn/api.php/provide/videoPlaylist'
		header['TK'] = self.get_tk(listUrl, params, ts)
		listRsp = requests.get(listUrl, headers=header, params=params, timeout=5)
		listJo = json.loads(listRsp.text)
		playMap = {}
		episodes = listJo['data']['episodes']
		for ep in episodes:
			playurls = ep['playurls']
			for playurl in playurls:
				source = playurl['playfrom']
				if source not in playMap.keys():
					playMap[source] = []
				playMap[source].append(playurl['title'].strip() + '$' + playurl['playurl'])

		playFrom = []
		playList = []
		for key in playMap.keys():
			playFrom.append(key)
			playList.append('#'.join(playMap[key]))

		vod_play_from = '$$$'
		vod_play_from = vod_play_from.join(playFrom)
		vod_play_url = '$$$'
		vod_play_url = vod_play_url.join(playList)
		vod['vod_play_from'] = vod_play_from
		vod['vod_play_url'] = vod_play_url

		result = {
			'list':[
				vod
			]
		}
		return result

	def searchContent(self,key,quick):
		url = 'http://api.tyun77.cn/api.php/provide/searchVideo?searchName={0}'.format(key)
		rsp = self.fetch(url,headers=self.header)
		jo = json.loads(rsp.text)
		vodList = jo['data']
		videos = []
		for vod in vodList:
			videos.append({
				"vod_id":vod['id'],
				"vod_name":vod['videoName'],
				"vod_pic":vod['videoCover'],
				"vod_remarks":vod['msg']
			})
		result = {
			'list':videos
		}
		return result

	config = {
		"player": {},
		"filter": {}
	}
	header = {
		'User-Agent': 'okhttp/3.12.0'
	}
	def playerContent(self,flag,id,vipFlags):
		result = {}
		result = {
			'parse':0,
			'jx':0,
			'playUrl':'',
			'url':id,
			'header':''
		}
		if flag != 'ppayun':
			result['parse'] = 1
			result['jx'] = 1
		return result

	def isVideoFormat(self,url):
		pass

	def manualVideoCheck(self):
		pass

	def get_tk(self, url, params, ts):
		keys = []
		for key in params:
			keys.append(key)
		keys.sort()
		src = urlparse(url).path
		for key in keys:
			src += str(params[key])
		src += str(ts)
		src += 'XSpeUFjJ'
		return hashlib.md5(src.encode()).hexdigest()

	def localProxy(self,param):
		return [200, "video/MP2T", action, ""]