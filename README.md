# CatVodOpen和TvBox

## TVBox互联网发布地址

```bash
https://gh.con.sh/https://raw.githubusercontent.com/jadehh/TV/js/tv_config.json
https://gh.con.sh/https://raw.githubusercontent.com/jadehh/TV/js/he_tv_config.json

```

* js不支持code代码

## CatVodOpen

[CatVodOpen发布地址](https://github.com/catvod/CatVodOpen/releases)

* 不支持重定向

```bash
gitee://Token@gitee.com/jadehh_743/TV/js/open_config.json
github://Token@github.com/jadehh/CatVodOpenConfig/js/open_config.json
https://50e510596ebc5356ec22b3f8aeb19371@gitee.com/jadehh_743/TV/raw/js/open_config.json
```

> CatVodOpen和TV中的requets请求不一致的问题
> 使用Gitee导入,并设置为私有仓库,仅支持私有仓库

## 遇到的问题

*
    1. 玩偶姐姐播放不了,需要切换VPN节点

```
{
        "theme": "#FF0000",
        "url": "zwGQojScosrS5P0V1z3zuml+L7nc2oWdbc92OBbQvR8dwA8lRE/dYOWtUHjSLDoNJw5yY97EVobWKHu8q1eHOyRZzKj2ANKmbhqo0Gc6hRBfHx+nx9o7jYPt+W49z50yVgj3MRUF0KKUBxQyZRGjZjOL2TFenzN33bSFVhJHvzK5sHS6schKpN6YgGytPMp4r450ncxVkzctK38LmDZesi0Umll/WQtjvdHR1bvDkxKuDWgJDDEhQCH6R1QmLnpD",
        "vkey": "e8a2b7bed92e34ea0c69778fc5f960b0",
        "next":"Okyun_4f744f654c4234383647545145515859684b5139475970527050474872575a67785441797768686a2b4b747455566f684d4444637937456d564e51423349566d",
        "title":"完美世界 - FreeOK-追剧也很卷",
        "poster": "/ap1",
        "logo": "",
        "ad": {
            "on": '0',
            "img": 'https://openai-75050.gzc.vod.tencent-cloud.com/openaiassets_1ddc35015b5f8ec8ba4fb7a259601e65.jpg',
            "url": 'https://www.kdocs.cn/l/ccSIEjVM2NDV',
        },
        "contextmenu": "FreeOK-追剧也很卷",
        "contextlink": "https://www.freeok.vip",
    }
    

```


* m3u8遇到跨域的问题可以尝试使用代理来进行加载,如果没有跨域使用代理会引起死循环

### 阿里Token获取

[https://alist.nn.ci/zh/guide/drivers/aliyundrive.html](https://alist.nn.ci/zh/guide/drivers/aliyundrive.html)