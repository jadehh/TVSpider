/*
* @File     : nivod.js
* @Author   : jade
* @Date     : 2023/12/19 14:23
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {Crypto, Uri} from "../lib/cat.js";
import {JadeLogging} from "../lib/log.js";

let ApiUrl = "https://api.nivodz.com"
let DesKey = "diao.com"
const JadeLog = new JadeLogging(getAppName())

function getAppName() {
    return "泥视频"
}

function getHeader() {
    return {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
        "Referer": "https://m.nivod.tv/",
        "Content-Type": "application/x-www-form-urlencoded"
    }
}

async function request(reqUrl) {
    let header = getHeader()
    let uri = new Uri(reqUrl);
    return await req(uri.toString(), {
        headers: header,
        method: "post",
        data: {},
        postType: "form"
    });
}

async function createSign() {
    let params = {
        "_ts": "1702973305512", "app_version": "1.0",
        "platform": "3", "market_id": "web_nivod",
        "device_code": "web", "versioncode": 1,
        "oid": "8ca275aa5e12ba504b266d4c70d95d77a0c2eac5726198ea"
    }
    /**
     * __QUERY::_ts=1702973558399&app_version=1.0&device_code=web&market_id=web_nivod&oid=8ca275aa5e12ba504b266d4c70d95d77a0c2eac5726198ea&platform=3&versioncode=1&__BODY::__KEY::2x_Give_it_a_shot
     */
    let params_list = []
    for (const key of Object.keys(params).sort()) {
        params_list.push(`${key}=${params[key]}`)
    }
    let params_str = "__QUERY::" + params_list.join("&") + "&__BODY::__KEY::2x_Give_it_a_shot"
    await JadeLog.info(params_str)
    let sign_code = md5X(params_str)
    params_list.push(`sign=${sign_code}`)
    return "?" + params_list.join("&")

}


function aesDecrypt(content) {
    const bytes = Crypto.AES.decrypt(content.toString(), DesKey, {
        mode: Crypto.mode.CBC,
        padding: Crypto.pad.Pkcs7
    });
    const decryptResult = bytes.toString();
    return decryptResult.toString().toUpperCase();
}


async function init(cfg) {
    let siteKey = "", siteType = 0, des_key = "diao.com"
    let url = `${ApiUrl}` + "/show/filter/condition/WAP/3.0" + await createSign()
    let response = await request(url)
    await JadeLog.info("请求结束")

    var decryptedData = aesDecrypt(response.content)

    console.log("解密字符串: ", decryptedData)

}

export function __jsEvalReturn() {
    return {
        init: init,
    };
}