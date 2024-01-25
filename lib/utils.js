import {Crypto} from "./cat.js";

let CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36";
let RESOURCEURL = "https://gh.con.sh/https://raw.githubusercontent.com/jadehh/TV/js"
function isSub(ext) {
    return ext === "srt" || ext === "ass" || ext === "ssa";
}

function getSize(size) {
    if (size <= 0) return "";
    if (size > 1024 * 1024 * 1024 * 1024.0) {
        size /= (1024 * 1024 * 1024 * 1024.0);
        return size.toFixed(2) + "TB";
    } else if (size > 1024 * 1024 * 1024.0) {
        size /= (1024 * 1024 * 1024.0);
        return size.toFixed(2) + "GB";
    } else if (size > 1024 * 1024.0) {
        size /= (1024 * 1024.0);
        return size.toFixed(2) + "MB";
    } else {
        size /= 1024.0;
        return size.toFixed(2) + "KB";
    }
}

function removeExt(text) {
    return text.indexOf('.') > -1 ? text.substring(0, text.lastIndexOf(".")) : text;
}

async function log(str) {
    console.debug(str);
}

function isVideoFormat(url) {
    var RULE = /http((?!http).){12,}?\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg|m4a|mp3)\?.*|http((?!http).){12,}\.(m3u8|mp4|flv|avi|mkv|rm|wmv|mpg|m4a|mp3)|http((?!http).)*?video\/tos*/;
    if (url.indexOf("url=http") > -1 || url.indexOf(".js") > -1 || url.indexOf(".css") > -1 || url.indexOf(".html") > -1) {
        return false;
    }
    return RULE.test(url);
}

function jsonParse(input, json) {
    var jsonPlayData = JSON.parse(json);
    var url = jsonPlayData.url;
    if (url.startsWith("//")) {
        url = "https:" + url;
    }
    if (!url.startsWith("http")) {
        return null;
    }
    if (url === input) {
        if (!isVideoFormat(url)) {
            return null;
        }
    }
    var headers = {};
    var ua = jsonPlayData["user-agent"] || "";
    if (ua.trim().length > 0) {
        headers["User-Agent"] = " " + ua;
    }
    var referer = jsonPlayData.referer || "";
    if (referer.trim().length > 0) {
        headers["Referer"] = " " + referer;
    }
    var taskResult = {
        header: headers,
        url: url
    };
    return taskResult;
}

function debug(obj) {
    for (var a in obj) {
        if (typeof(obj[a]) == "object") {
            debug(obj[a]); //递归遍历
        } else {
            console.debug(a + "=" + obj[a]);
        }
    }
}
function objectToStr(params = null, isBase64Encode = false) {
    let params_str_list = []
    if (params !== null) {
        for (const key of Object.keys(params)) {
            if (isBase64Encode) {
                params_str_list.push(`${key}=${encodeURIComponent(params[key])}`)
            } else {
                params_str_list.push(`${key}=${params[key]}`)
            }

        }
    }

    return params_str_list.join("&")
}
function sleep(delay) {
    const start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay*1000) {
        continue;
    }
}
function getStrByRegex(pattern, str) {
    let matcher = pattern.exec(str);
    if (matcher !== null) {
        if (matcher.length >= 1) {
            if (matcher.length >= 1) return matcher[1]
        }
    }
    return "";
}

function base64Encode(text) {
    return Crypto.enc.Base64.stringify(Crypto.enc.Utf8.parse(text));
}
function base64Decode(text) {
    return Crypto.enc.Utf8.stringify(Crypto.enc.Base64.parse(text));
}
function unescape(code) {
        return code.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ");}

function gb2312Decode(buffer,encode_type) {
    const decoder = new TextDecoder(encode_type)
    return decoder.decode(buffer)
}

let patternAli = /(https:\/\/www\.aliyundrive\.com\/s\/[^"]+|https:\/\/www\.alipan\.com\/s\/[^"]+)/


export { isSub, getSize, removeExt, log, isVideoFormat, jsonParse, debug,CHROME,objectToStr,sleep,getStrByRegex,RESOURCEURL,base64Encode,base64Decode,patternAli,unescape,gb2312Decode};