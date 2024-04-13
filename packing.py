#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File     : packing.py
# @Author   : jade
# @Date     : 2024/4/13 11:39
# @Email    : jadehh@1ive.com
# @Software : Samples
# @Desc     :
from jade import *
if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('--extra_path_list', type=list,
                        default=[])  ## 需要额外打包的路径
    parser.add_argument('--lib_path', type=str, default='')
    parser.add_argument('--app_name', type=str,
                        default="LogServer")  ##需要打包的文件名称
    parser.add_argument('--full', type=str,
                        default="True")  ## 打包成一个完成的包
    parser.add_argument('--app_version', type=str, default="1.0.1")
    parser.add_argument('--use_jade_log', type=str, default="True")
    parser.add_argument('--specify_files', type=str, default='')
    parser.add_argument('--console', type=str, default="True")
    parser.add_argument("--is_auto_packing",type=str,default='False')
    parser.add_argument('--name', type=str,
                        default="日志上传服务")  ##需要打包的文件名称
    parser.add_argument('--appimage', type=str,
                        default="True")  ##需要打包的文件名称
    args = parser.parse_args()
    build(args)
    packAPP(args)
