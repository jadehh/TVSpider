/*
* @File     : bilibili_ASS_Danmaku_Downloader.js
* @Author   : jade
* @Date     : 2024/3/14 13:19
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {load} from "./cat.js";

function RRGGBB (color) {
  var t = Number(color).toString(16).toUpperCase();
  return (Array(7).join('0') + t).slice(-6);
};
function parseXML(content) {
  var data = load(content)
  return Array.apply(Array, data('d')).map(function (line) {
    var info = data(line)('p').split(','), text = line.textContent;
    return {
      'text': text,
      'time': Number(info[0]),
      'mode': [undefined, 'R2L', 'R2L', 'R2L', 'BOTTOM', 'TOP'][Number(info[1])],
      'size': Number(info[2]),
      'color': RRGGBB(parseInt(info[3], 10) & 0xffffff),
      'bottom': Number(info[5]) > 0,
      // 'create': new Date(Number(info[4])),
      // 'pool': Number(info[5]),
      // 'sender': String(info[6]),
      // 'dmid': Number(info[7]),
    };
  });
};
export {parseXML}