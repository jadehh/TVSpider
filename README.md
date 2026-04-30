# CatVodOpen和TvBox

## 食用前阅读
&ensp;&ensp;授人以鱼不如授人以渔，本仓意指在教会大家学会Spider，也欢迎大家提ISSUE，一起学习一起进步。<br>
&ensp;&ensp;以下资源不能保证内容的合法性、准确性、完整性和有效性，请根据情况自行判断。 
仅用于测试和学习研究，禁止用于商业用途，不得将其用于违反国家、地区、组织等的法律法规或相关规定的其他用途。
使用任何第三方硬件、软件、所造成的一切后果由使用的个人或组织承担，与本文内容无关。
所有直接或间接使用本内容的个人和组织，应 24 小时内完成学习和研究，并及时删除本文内容。
所有基于本内容的源代码，进行的任何修改，为其他个人或组织的自发行为，与本内容没有任何直接或间接的关系，所造成的一切后果亦与本内容和本管理者无关。
本管理者保留随时更改或补充此免责声明的权利。一旦使用、复制、转载、发布、修改了本文内容，则视为您已接受此免责声明。否则后果自负。
本接口无公众号、无盈利、无引流、免费分享给小白使用，请勿轻信他人，谨防上当受骗。

[使用教程见Wiki](https://github.com/jadehh/TVSpider/wiki)

## TVBox互联网发布地址
[TV发布地址](https://github.com/FongMi/Release/tree/main/apk/release)
```bash
https://gh.con.sh/https://raw.githubusercontent.com/jadehh/TVSpider/js/tv_config.json
```
> 配置信息见js分支分支


## CatVodOpen
[CatVodOpen发布地址](https://github.com/catvod/CatVodOpen/releases)

> 注意使用Gitee或Github导入，并设置为私有仓库，<font color="red">CatVodOpen仅支持私有仓库</font>

V1.1.3版本以上
```bash
gitee://Token@gitee.com/jadehh_743/TVSpider/dist/index.js.md5
```
<font color="red">**改动**</font>

* quickjs改为nodejs，proxy设置修改
* 在ios上无法使用local，使用db替换local所有方法
* nodejs 的优势在于更加灵活
> 配置信息见dist分支

V1.1.2版本以下
```bash
gitee://Token@gitee.com/jadehh_743/TVSpider/js/open_config.json
```
> 配置信息见js分支分支


## config文件生成
```bash
python build.py --aliToken aliToken
```
> Token如果失效,需要重新获取阿里Token 
>
> [阿里Token获取](https://alist.nn.ci/zh/guide/drivers/aliyundrive.html)
>
> nodejs 部分只生成代码，需要手动build，区分18+

## 直播源生成
> 见[jadehh/LiveSpider](https://github.com/jadehh/LiveSpider)


## 遇到的问题
* 玩偶姐姐播放不了,需要切换VPN节点
* m3u8遇到跨域的问题可以尝试使用代理来进行加载，如果没有跨域使用代理会引起死循环
* 虎牙弹幕功能无法实现,现在并不支持WebSocket来监听弹幕
* SP360启用嗅探解析,CatVodOpen目前还不支持嗅探
* CatVodOpen Windows无法预览Jable和Doll图片,需要手动开启代理加载。
* TV影视暂不不支持哔哩哔哩DASH文件播放
* 老版本的CatVodOpen cfg参数类型为:string,TV参数类型为[object],所有需要区分,初始化的时候还是用this.cfgObj

## 特别说明
* 近期CatVodOpen更新移除了quickjs,导致无法使用,请尝试使用旧版本
* 或切换至nodejs目录下编译生成dist目录，dist目录发布到dist分支下
* main分支用于代码测试(不包含任何配置信息)，js分支发布支持quickjs爬虫配置信息，dist分支发布支持nodejs爬虫配置信息
* 所有的配置信息都通过Github Actions发布，通过创建tag来生成新的配置信息并自动发布
* fork仓库时去掉仅复制main分支的&#x2714;，这样就可以fork所有的分支了
  
## ✨ Star 数

[![Star History Chart](https://api.star-history.com/svg?repos=jadehh/TVSpider&type=Date)](https://star-history.com/#jadehh/TVSpider&Date)
---

## 飞机群

加入我们吧

<img src="./assets/image.png" alt="telegram" width="256" height="256" align="left" /> 
<br><br><br><br><br><br><br><br><br><br>

----

## 赞助

如果觉得此项目有用，可以考虑赞助我喝杯咖啡，感谢star❤

<img src="./resources/wechat.jpg" alt="微信" width="256" height="256" align="left" />