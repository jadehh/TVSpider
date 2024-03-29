import bqg from './spider/book/bqg.js';
import copymanga from './spider/book/copymanga.js';
import alist from './spider/pan/alist.js';
import aiyingshi from './spider/video/aiyingshi.js';
import alipansou from './spider/video/alipansou.js';
import aliyunpanshare from './spider/video/aliyunpanshare.js';
import changzhang from './spider/video/changzhang.js';
import douban from './spider/video/douban.js';
import dygangs from './spider/video/dygangs.js';
import dyttbt from './spider/video/dyttbt.js';
import feifan from './spider/video/feifan.js';
import ffm3u8 from './spider/video/ffm3u8.js';
import gitcafe from './spider/video/gitcafe.js';
import huya from './spider/video/huya.js';
import ikanbot from './spider/video/ikanbot.js';
import jiafeimao from './spider/video/jiafeimao.js';
import jianpian from './spider/video/jianpian.js';
import jiujiuliu from './spider/video/jiujiuliu.js';
import kankan70 from './spider/video/kankan70.js';
import kkys from './spider/video/kkys.js';
import kuaikan from './spider/video/kuaikan.js';
import kunyu77 from './spider/video/kunyu77.js';
import liangzi from './spider/video/liangzi.js';
import mp4movie from './spider/video/mp4movie.js';
import nangua from './spider/video/nangua.js';
import NewVision from './spider/video/NewVision.js';
import nivod from './spider/video/nivod.js';
import pan_search from './spider/video/pan_search.js';
import push from './spider/video/push.js';
import sp360 from './spider/video/sp360.js';
import star from './spider/video/star.js';
import weixine from './spider/video/weixine.js';
import wogg from './spider/video/wogg.js';
import xb6v from './spider/video/xb6v.js';
import yiqikan from './spider/video/yiqikan.js';
const spiders = [bqg,copymanga,alist,aiyingshi,alipansou,aliyunpanshare,changzhang,douban,dygangs,dyttbt,feifan,ffm3u8,gitcafe,huya,ikanbot,jiafeimao,jianpian,jiujiuliu,kankan70,kkys,kuaikan,kunyu77,liangzi,mp4movie,nangua,NewVision,nivod,pan_search,push,sp360,star,weixine,wogg,xb6v,yiqikan];
const spiderPrefix = '/spider';

/**
 * A function to initialize the router.
 *
 * @param {Object} fastify - The Fastify instance
 * @return {Promise<void>} - A Promise that resolves when the router is initialized
 */
export default async function router(fastify) {
    // register all spider router
    spiders.forEach((spider) => {
        const path = spiderPrefix + '/' + spider.meta.key + '/' + spider.meta.type;
        fastify.register(spider.api, { prefix: path });
        fastify.register(async (fastify) => {
            fastify.get(path, /**
             * check api alive or not
             * @param {import('fastify').FastifyRequest} _request
             * @param {import('fastify').FastifyReply} reply
             */
            async function (_request, reply) {
                reply.send({run:spider.api});
            });
        });
        console.log('Register spider: ' + path);
    });
    /**
     * @api {get} /check 检查
     */
    fastify.register(
        /**
         *
         * @param {import('fastify').FastifyInstance} fastify
         */
        async (fastify) => {
            fastify.get(
                '/check',
                /**
                 * check api alive or not
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    reply.send({ run: !fastify.stop });
                }
            );
            fastify.get(
                '/config',
                /**
                 * get catopen format config
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    const config = {
                        video: {
                            sites: [],
                        },
                        read: {
                            sites: [],
                        },
                        comic: {
                            sites: [],
                        },
                        music: {
                            sites: [],
                        },
                        pan: {
                            sites: [],
                        },
                        color: fastify.config.color || [],
                    };
                    spiders.forEach((spider) => {
                        let meta = Object.assign({}, spider.meta);
                        meta.api = spiderPrefix + '/' + meta.key + '/' + meta.type;
                        meta.key = 'nodejs_' + meta.key;
                        const stype = spider.meta.type;
                        if (stype < 10) {
                            config.video.sites.push(meta);
                        } else if (stype >= 10 && stype < 20) {
                            config.read.sites.push(meta);
                        } else if (stype >= 20 && stype < 30) {
                            config.comic.sites.push(meta);
                        } else if (stype >= 30 && stype < 40) {
                            config.music.sites.push(meta);
                        } else if (stype >= 40 && stype < 50) {
                            config.pan.sites.push(meta);
                        }
                    });
                    reply.send(config);
                }
            );
        }
    );
}
