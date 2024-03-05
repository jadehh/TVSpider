# CatVodOpen和TvBox

## TVBox互联网发布地址

```bash
https://gh.con.sh/https://raw.githubusercontent.com/jadehh/TV/js/tv_config.json
https://gh.con.sh/https://raw.githubusercontent.com/jadehh/TV/js/he_tv_config.json
```

## CatVodOpen
[CatVodOpen发布地址](https://github.com/catvod/CatVodOpen/releases)

```bash
gitee://Token@gitee.com/jadehh_743/TV/js/open_config.json
```
> CatVodOpen和TV中的requets请求不一致的问题
> 使用Gitee导入,并设置为私有仓库,仅支持私有仓库

## 遇到的问题
* 1. 玩偶姐姐播放不了,需要切换VPN节点
* 2. m3u8遇到跨域的问题可以尝试使用代理来进行加载,如果没有跨域使用代理会引起死循环



## config文件生成
```bash
python build.py
```

### 阿里Token获取
[https://alist.nn.ci/zh/guide/drivers/aliyundrive.html](https://alist.nn.ci/zh/guide/drivers/aliyundrive.html)