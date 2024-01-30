/*
* @File     : 13bqg_open.js.js
* @Author   : jade
* @Date     : 2024/1/30 15:38
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {_} from '../lib/cat.js';
import * as Utils from "../lib/utils.js";
import {Spider} from "./spider.js";

class BQQSpider extends Spider {
    constructor() {
        super();
        this.siteUrl = "https://m.13bqg.com"
    }

    getAppName() {
        return "笔趣阁"
    }

    getName() {
        return "📚︎|笔趣阁|📚︎"
    }

    async init(cfg) {
        await super.init(cfg);
    }

    async parseVodShortListFromDocByCategory($) {
        let books = [];
        for (const item of $('div.item')) {
            const a = $(item).find('a:first')[0];
            const img = $(a).find('img:first')[0];
            const span = $(item).find('span:first')[0];
            books.push({
                book_id: a.attribs.href,
                book_name: img.attribs.alt,
                book_pic: img.attribs.src,
                book_remarks: span.children[0].data.trim(),
            });
        }
        return books
    }

    async parseVodDetailFromDoc($, id) {
        let book = {
            book_name: $('[property$=book_name]')[0].attribs.content,
            book_year: $('[property$=update_time]')[0].attribs.content,
            book_director: $('[property$=author]')[0].attribs.content,
            book_content: $('[property$=description]')[0].attribs.content,
        };
        $ = await this.getHtml(this.siteUrl + id + `list.html`);
        let urls = [];
        const links = $('dl>dd>a[href*="/html/"]');
        for (const l of links) {
            const name = $(l).text().trim();
            const link = l.attribs.href;
            urls.push(name + '$' + link);
        }
        book.volumes = '全卷';
        book.urls = urls.join('#');
        return book
    }

    async setClasses() {
        let $ = await this.getHtml()
        for (const a of $('div.nav > ul > li > a[href!="/"]')) {
            this.classes.push({
                type_id: a.attribs.href.replace(/\//g, ''), type_name: a.children[0].data.trim(), tline: 2,
            });
        }
    }


    async setDetail(id) {
        let $ = await this.getHtml(this.siteUrl + id)
        this.vodDetail = await this.parseVodDetailFromDoc($, id)
    }

    async setCategory(tid, pg, filter, extend) {
        let $ = await this.getHtml(this.siteUrl + `/${tid}/${pg}.html`);
        this.vodList = await this.parseVodShortListFromDocByCategory($)
    }

    async play(flag, id, flags) {
        try {
            let content = '';
            while (true) {
                let $ = await this.getHtml(this.siteUrl + id)
                content += $('#chaptercontent')
                    .html()
                    .replace(/<br>|请收藏.*?<\/p>/g, '\n')
                    .trim();
                id = $('a.Readpage_down')[0].attribs.href;
                if (id.indexOf('_') < 0) break;
            }
            return {
                content: content + '\n\n',
            };
        } catch (e) {
            return {
                content: '',
            };
        }
    }

    async search(wd, quick) {
        const cook = await req(`${this.siteUrl}/user/hm.html?q=${encodeURIComponent(wd)}`, {
            headers: {
                accept: 'application/json', 'User-Agent': Utils.MOBILEUA, Referer: `${this.siteUrl}/s?q=${encodeURIComponent(wd)}`,
            },
        });
        const set_cookie = _.isArray(cook.headers['set-cookie']) ? cook.headers['set-cookie'].join(';;;') : cook.headers['set-cookie'];
        const cks = set_cookie.split(';;;');
        const cookie = {};
        for (const c of cks) {
            const tmp = c.trim();
            const idx = tmp.indexOf('=');
            const k = tmp.substr(0, idx);
            cookie[k] = tmp.substr(idx + 1, tmp.indexOf(';') - idx - 1);
        }
        const resp = await req(`${this.siteUrl}/user/search.html?q=${encodeURIComponent(wd)}&so=undefined`, {
            headers: {
                accept: 'application/json',
                'User-Agent': Utils.MOBILEUA,
                cookie: 'hm=' + cookie['hm'],
                Referer: `${this.siteUrl}/s?q=${encodeURIComponent(wd)}`,
            },
        });
        let data = JSON.parse(resp.content);
        let books = [];
        for (const book of data) {
            books.push({
                book_id: book["url_list"], book_name: book["articlename"], book_pic: book["url_img"], book_remarks: book["author"],
            });
        }
        return {
            tline: 2, list: books,
        };
    }

}

let spider = new BQQSpider()

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


export function __jsEvalReturn() {
    return {
        init: init, home: home, homeVod: homeVod, category: category, detail: detail, play: play, search: search,
    };
}



