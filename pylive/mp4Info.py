#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : mp4Info.py
# @Author   : jade
# @Date     : 2024/5/7 14:56
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
import io
from pymediainfo import MediaInfo
class Mp4Info():
    def __init__(self, data):
        self.media_info = self.get_media_info(data)
        self.duration = 0
        self.size = 0
        self.type = ""
        self.videoCodec = ""
        self.videoWidth = 0
        self.videoHeight = 0
        self.get_genera_info()
        self.aspect = "{}*{}".format(self.videoWidth, self.videoHeight)

    def get_media_info(self, data):
        return MediaInfo.parse(io.BufferedReader(io.BytesIO(data)))

    def get_genera_info(self):
        for track in self.media_info.tracks:
            if track.track_type == 'General':
                if track.duration:
                    self.duration = track.duration
                if track.file_size:
                    self.size = track.file_size
                if track.internet_media_type:
                    self.type = track.internet_media_type
            if track.track_type == "Video":
                if track.internet_media_type:
                    self.videoCodec = track.internet_media_type
                if track.sampled_height:
                    self.videoHeight = int(track.sampled_height)
                if track.sampled_width:
                    self.videoWidth = int(track.sampled_width)