import bqg from './spider/book/bqg.js';
import copymanga from './spider/book/copymanga.js';
import alist from './spider/pan/alist.js';
import weixine from './spider/video/weixine.js';
import dygangs from './spider/video/dygangs.js';
import liangzi from './spider/video/liangzi.js';
import kkys from './spider/video/kkys.js';
import ikanbot from './spider/video/ikanbot.js';
import push from './spider/video/push.js';
import jianpian from './spider/video/jianpian.js';
import jiafeimao from './spider/video/jiafeimao.js';
import kuaikan from './spider/video/kuaikan.js';
import ffm3u8 from './spider/video/ffm3u8.js';
import jiujiuliu from './spider/video/jiujiuliu.js';
import yiqikan from './spider/video/yiqikan.js';
import huya from './spider/video/huya.js';
import changzhang from './spider/video/changzhang.js';
import mp4movie from './spider/video/mp4movie.js';
import sp360 from './spider/video/sp360.js';
import dyttbt from './spider/video/dyttbt.js';
import newvision from './spider/video/newvision.js';
import gitcafe from './spider/video/gitcafe.js';
import xb6v from './spider/video/xb6v.js';
import aiyingshi from './spider/video/aiyingshi.js';
import pan_search from './spider/video/pan_search.js';
import nangua from './spider/video/nangua.js';
import NewVision from './spider/video/NewVision.js';
import star from './spider/video/star.js';
import aliyunpanshare from './spider/video/aliyunpanshare.js';
import kunyu77 from './spider/video/kunyu77.js';
import feifan from './spider/video/feifan.js';
import kankan70 from './spider/video/kankan70.js';
import wogg from './spider/video/wogg.js';
import douban from './spider/video/douban.js';
import alipansou from './spider/video/alipansou.js';
import nivod from './spider/video/nivod.js';
const spiders = [bqg,copymanga,alist,weixine,dygangs,liangzi,kkys,ikanbot,push,jianpian,jiafeimao,kuaikan,ffm3u8,jiujiuliu,yiqikan,huya,changzhang,mp4movie,sp360,dyttbt,newvision,gitcafe,xb6v,aiyingshi,pan_search,nangua,NewVision,star,aliyunpanshare,kunyu77,feifan,kankan70,wogg,douban,alipansou,nivod];
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
