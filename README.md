# Python脚本分支

## 1. 互联网

```bash
https://gh.con.sh/https://raw.githubusercontent.com/jadehh/TV/py/config.json
```

## 2. 本地

```bash
http://192.168.29.156:8099/config.json
```

## 待优化功能

* 豆瓣分类功能
* 优酷爱奇艺爬虫
* 修改TV源码,支持python传入url

## 视频播放地址获取服务

```python
[
    {
        "name": "原地址-（提示：本软件免费无广告,不要花钱购买）",
        "url": ""
    },
    {
        "name": "4.21-6",
        "url": "http://www.85105052.com/admin.php?url="
    },
    {
        "name": "无名小站",
        "url": "http://www.82190555.com/index/qqvod.php?url="
    },
    {
        "name": "OK",
        "url": "https://okjx.cc/?url="
    },
    {
        "name": "api-2",
        "url": "https://www.ckmov.vip/api.php?url="
    },
    {
        "name": "api-3",
        "url": "https://www.h8jx.com/jiexi.php?url="
    },
    {
        "name": "api-4",
        "url": "https://api.jiexi.la/?url="
    },
    {
        "name": "api-5",
        "url": "https://vip.laobandq.com/jiexi.php?url="
    },
    {
        "name": "api-6",
        "url": "https://www.ckmov.com/?url="
    },
    {
        "name": "api-7",
        "url": "https://www.nxflv.com/?url="
    },
    {
        "name": "api-8",
        "url": " https://www.ckplayer.vip/jiexi/?url="
    },
    {
        "name": "api-9",
        "url": "https://www.m3u8.tv.cdn.8old.cn/m3u8tv.1031/api.php?url="
    },
    {
        "name": "api-10",
        "url": "https://jx.m3u8.tv/jiexi/?url="
    },
    {
        "name": "api-11",
        "url": "https://jx.qqwtt.com/?url="
    },
    {
        "name": "纯净1",
        "url": "https://z1.m1907.top/?jx="
    },
    {
        "name": "B站1",
        "url": "https://jx.jsonplayer.com/player/?url="
    },
    {
        "name": "爱豆",
        "url": "https://jx.aidouer.net/?url="
    },
    {
        "name": "CHok",
        "url": "https://www.gai4.com/?url="
    },
    {
        "name": "RDHK",
        "url": "https://jx.rdhk.net/?v="
    },
    {
        "name": "人人迷",
        "url": "https://jx.blbo.cc:4433/?url="
    },
    {
        "name": "思古3",
        "url": "https://jsap.attakids.com/?url="
    },
    {
        "name": "听乐",
        "url": "https://jx.dj6u.com/?url="
    }
]
```

## python Spider

```json
{
      "key": "py_test",
      "name": "┃test┃",
      "type": 3,
      "api": "py_test",
      "ext": 
      {
        "py_url": "https://raw.githubusercontent.com/jadehh/TV/py/py/py_test.py",
        "token": "test"
      },
      "playerType": 1
}
```

or

```json
{
      "key": "py_test",
      "name": "┃test┃",
      "type": 3,
      "api": "py_test",
      "ext": "https://raw.githubusercontent.com/jadehh/TV/py/py/py_test.py",
      "playerType": 1
}
```