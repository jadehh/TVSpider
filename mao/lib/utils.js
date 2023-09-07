

function isSub(ext) {
    return ext == "srt" || ext == "ass" || ext == "ssa";
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
    // let url = 'remote log url';
    // await req(url, {
    //     method: 'post',
    //     data: {log: str}
    // });
}

export { isSub, getSize, removeExt, log};