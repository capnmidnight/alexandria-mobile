var http = require("./httpCacher.js"),
    tagPattern = /<([\w:]+)((?:\s+[\w:]+\s*=\s*("|')[^<]+?\3)*)\s*(?:\/>|>([^<]*)<\/\1>)/,
    attrPattern = /[\w:]+\s*=\s*("|')[^<]+?\1/g,
    attrNamePattern = /(\w+(:\w+)?)\s*=/,
    attrValuePattern = /=\s*("|')([^<]+?)\1/,
    subPattern = /\[TAG(\d+)\]/g;

function lexTags(xml){
    var tags = [];
    while(tagPattern.test(xml)){
        xml = xml.replace(tagPattern, function(match, tag, attrs, quote, text, index, doc){
            var id = tags.length;
            tags.push(match);
            return "[TAG" + id + "]";
        });
    }
    return tags;
}

function proc(curObj, curTag, tagCollect){
    var matches = curTag.match(tagPattern);
    var tag = matches[1];
    var attrs = matches[2];
    var text = matches[4];
    var subTags = text && text.match(subPattern);
    var t = typeof(curObj[tag]);
    if(t == "undefined"){
        if(subTags){
            curObj[tag] = {};
        }
        else if(attrs){
            curObj[tag] = {textContent: text};
        }
        else{
            curObj[tag] = text;
        }
        curObj = curObj[tag];
    }
    else if(t == "object"){
        if(!(curObj[tag] instanceof Array)){
            curObj[tag] = [curObj[tag]];
        }
        var temp = {};
        curObj[tag].push(temp);
        curObj = temp;
    }
    if(attrs){
        attrs.trim().match(attrPattern).forEach(function(attr){
            var name = attr.match(attrNamePattern)[1];
            var value = attr.match(attrValuePattern)[2];
            curObj[name] = value;
        });
    }
    if(subTags){
        subTags.map(function(subTag){return parseInt(subTag.match(/\d+/)[0], 10);}).forEach(function(subTag){
            proc(curObj, tagCollect[subTag], tagCollect);
        });
    }
}

module.exports.parse = function(xml){
    var tags = lexTags(xml);
    var root = {};
    proc(root, tags[tags.length - 1], tags);
    return root;
};

module.exports.get = function(options, success, fail){
    http.get(options, function(xml) {
        success(module.exports.parse(xml));
    }, fail);
};