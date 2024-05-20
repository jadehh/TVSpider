/**
 * File: h:\PycharmProjects\Github\TVSpider\lib\quark_object.js
 * Project: h:\PycharmProjects\Github\TVSpider
 * Created Date: Monday, May 20th 2024, 5:26:45 pm
 * Author: jade
 * -----
 * Last Modified: Mon May 20 2024
 * Modified By: jade
 * -----
 * Copyright (c) 2024 samples
 * ------------------------------------
 * Javascript will save your soul!
 */


class Item {
    constructor(file_id) {
        this.items = [];
        this.nextMarker = "";
        this.fileId = file_id;
        this.shareId = "";
        this.name = "";
        this.type = "";
        this.fileExtension = "";
        this.category = "";
        this.size = "";
        this.parent = "";
        this.shareToken = ""
    }

    static objectFrom(json_str, shareToken) {
        if (_.isEmpty(json_str)) {
            return new Item();
        }

        let item_json = JSON.parse(json_str), item = new Item();

        item.nextMarker = typeof item_json.next_marker == "undefined" ? "" : item_json.next_marker;
        item.fileId = typeof item_json.file_id == "undefined" ? "" : item_json.file_id;
        item.shareId = typeof item_json.share_id == "undefined" ? "" : item_json.share_id;
        item.shareToken = shareToken
        item.name = typeof item_json.name == "undefined" ? "" : item_json.name;
        item.type = typeof item_json.type == "undefined" ? "" : item_json.type;
        item.fileExtension = typeof item_json.file_extension == "undefined" ? "" : item_json.file_extension;
        item.category = typeof item_json.category == "undefined" ? "" : item_json.category;
        item.size = typeof item_json.size == "undefined" ? "" : item_json.size;
        item.parent = typeof item_json.parent_file_id == "undefined" ? "" : item_json.parent_file_id;
        typeof item.items != "undefined" && Array.isArray(item_json.items) && !_.isEmpty(item_json.items) && item_json.items.forEach(function (x) {
            let new_item = Item.objectFrom(JSON.stringify((x)), shareToken)
            item.items.push(new_item);
        });
        return item;
    }

    getItems() {
        return _.isEmpty(this.items) ? [] : this.items;
    }

    getNextMarker() {
        return _.isEmpty(this.nextMarker) ? "" : this.nextMarker;
    }

    getFileId() {
        return _.isEmpty(this.fileId) ? "" : this.fileId;
    }

    getShareId() {
        return _.isEmpty(this.shareId) ? "" : this.shareId;
    }

    getFileExtension() {
        return _.isEmpty(this.fileExtension) ? "" : this.fileExtension;
    }

    getName() {
        return _.isEmpty(this.name) ? "" : this.name;
    }

    getType() {
        return _.isEmpty(this.type) ? "" : this.type;
    }

    getExt() {
        return _.isEmpty(this.fileExtension) ? "" : this.fileExtension;
    }

    getCategory() {
        return _.isEmpty(this.category) ? "" : this.category;
    }

    getSize() {
        return this.size === 0 ? "" : "[" + Utils.getSize(this.size) + "]";
    }

    getParent() {
        return _.isEmpty(this.parent) ? "" : "[" + this.parent + "]";
    }

    parentFunc(item) {
        this.parent = item;
        return this;
    }

    // getDisplayName() {
    //     return this.getParent() + " " + this.getName() + " " + this.getSize();
    // }

    getDisplayName(type_name) {
        let name = this.getName();
        name = name.replaceAll("玩偶哥 q 频道：【神秘的哥哥们】", "")
        if (type_name === "电视剧") {
            let replaceNameList = ["4k", "4K"]
            name = name.replaceAll("." + this.getFileExtension(), "")
            name = name.replaceAll(" ", "").replaceAll(" ", "")
            for (const replaceName of replaceNameList) {
                name = name.replaceAll(replaceName, "")
            }
            name = Utils.getStrByRegexDefault(/\.S01E(.*?)\./, name)
            const numbers = name.match(/\d+/g);
            if (!_.isEmpty(numbers) && numbers.length > 0) {
                name = numbers[0]
            }
        }
        
        return name + " " + this.getParent() + " " + this.getSize();
    }

}

class Sub {
    constructor() {
        this.url = "";
        this.name = "";
        this.lang = "";
        this.format = "";
    }

    static create() {
        return new Sub();
    }

    setName(name) {
        this.name = name;
        return this;
    }

    setUrl(url) {
        this.url = url;
        return this;
    }

    setLang(lang) {
        this.lang = lang;
        return this;
    }

    setFormat(format) {
        this.format = format;
        return this;
    }

    setExt(ext) {
        switch (ext) {
            case "vtt":
                return this.setFormat("text/vtt");
            case "ass":
            case "ssa":
                return this.setFormat("text/x-ssa");
            default:
                return this.setFormat("application/x-subrip");
        }
    }

}