/*
* @File     : dj0898_book_open.js.js
* @Author   : jade
* @Date     : 2023/12/22 17:00
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {_} from '../lib/cat.js';
import {Spider} from "./spider.js";
import {BookShort} from "../lib/book.js";

class DJ0898Spider extends Spider {
    constructor() {
        super();
        this.siteUrl = "http://m.dj0898.com";
    }

    getName() {
        return "🎵┃世纪DJ音乐网┃🎵"
    }

    getAppName() {
        return "世纪DJ音乐网"
    }

    async parseVodShortListFromDoc($) {
        let books = []
        const list = $("ul.djddv_djList > li");
        for (const it of list) {
            let bookShort = new BookShort();
            const a = $(it).find("a")[1];
            bookShort.book_id = a.attribs.href
            bookShort.book_pic = $(it).find("img:first")[0].attribs.src;
            const tt = $(it).find("strong:first")[0];
            bookShort.book_name = tt.children[0].data
            bookShort.book_remarks = "🎵" + $(it).find("font")[5].children[0].data || ""
            books.push(bookShort)
        }
        return books
    }

    async parseVodShortListFromDocByCategory($) {
        const list = $("ul.djddv_djList > li");
        let videos = _.map(list, (it) => {
            const a = $(it).find("a")[1];
            const img = $(it).find("img:first")[0];
            const tt = $(it).find("strong:first")[0];
            const remarks = $(it).find("font")[5];
            return {
                book_id: a.attribs.href,
                book_name: tt.children[0].data,
                book_pic: img.attribs["src"],
                book_remarks: "🎵" + remarks.children[0].data || "",
            };
        });
        const hasMore = $("ul.page_link > li > a:contains(\u00a0)").length > 0;
        this.page = hasMore ? parseInt(this.page) + 1 : parseInt(this.page);
        return videos
    }

    async parseVodShortListFromDocBySearch($) {
        const list = $("ul.djddv_djList > li");
        return _.map(list, (it) => {
            const a = $(it).find("a")[1];
            const img = $(it).find("img:first")[0];
            const tt = $(it).find("strong:first")[0];
            const remarks = $(it).find("font:first")[0];
            return {
                book_id: a.attribs.href,
                book_name: tt.children[0].data,
                book_pic: img.attribs["src"],
                book_remarks: "🎵" + remarks.children[0].data || "",
            };
        })
    }

    async parseVodDetailFromDoc(id) {
        const vod = {
            book_id: id,
            type_name: '',
            book_year: '',
            book_area: '',
            book_remarks: '',
            book_actor: '',
            book_director: '',
            book_content: '',
        };
        const playlist = ["点击播放" + "$" + vod.book_id];
        vod.volumes = "道长在线";
        vod.urls = playlist.join("#");
        return vod
    }

    async setClasses() {
    }

    async setFilterObj() {
    }

    async setHomeVod() {
        let $ = await this.getHtml(this.siteUrl + "/dance/lists/id/10/1")
        this.homeVodList = await this.parseVodShortListFromDoc($)
    }

    async setCategory(tid, pg, filter, extend) {
        const link = HOST + "/dance/lists/id/" + tid + "/" + pg;
        const html = await request(link);
        const $ = load(html);

    }

    async setDetail(id) {
        this.vodDetail = await this.parseVodDetailFromDoc(id);
    }


    async play(flag, id, flags) {
        await this.jadeLog.debug(`正在准备播放:${id}`)
        let $ = await this.getHtml(id)
        const audio = $("body audio[src*=http]");
        let playUrl = "http://audio.bookan.com.cn/video1/audio/2021061114/aache64_16bbe0ec.m4a"
        await this.jadeLog.debug(`播放连接为:${playUrl}`)
        return JSON.stringify({
            parse: 0, url: playUrl,
        });
    }

    async setSearch(wd, quick) {
        let $ = await this.getHtml(this.siteUrl + "/index.php/dance/so/key?key=" + wd + "&cid=0&p=1")
        this.vodList = await this.parseVodShortListFromDocBySearch($)
    }
}

let spider = new DJ0898Spider()

async function init(cfg) {
    await spider.init(cfg)
}

async function home(filter) {
    return await spider.home(filter)
}

async function homeVod() {
    return await spider.homeVod()
}

async function category(tid, pg, filter, extend) {
    return await spider.category(tid, pg, filter, extend)
}

async function detail(id) {
    return await spider.detail(id)
}

async function play(flag, id, flags) {
    return await spider.play(flag, id, flags)
}

async function search(wd, quick) {
    return await spider.search(wd, quick)
}

async function proxy(segments, headers) {
    return await spider.proxy(segments, headers)
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
        proxy: proxy
    };
}