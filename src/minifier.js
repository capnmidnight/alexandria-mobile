﻿var fs = require("fs"),
    path = require("path");
var strings = null, regexes = null;
var patterns = [
    [/"((\\"|[^"\n])*)"/g, function(match){
        var name = "&STRING" + strings.length + ";";
        strings.push(match);
        return name;
    }],
    [/http:\/\//g, "$HTTP;"],
    [/https:\/\//g, "$HTTPS;"],
    [/\/\/[^\n]+/g, " "], // strip comments
    [/\/((\\\/|[^\/\n])+)\//g, function(match){
        var name = "&REGEX" + regexes.length + ";";
        regexes.push(match);
        return name;
    }],
    [/(\n|\s)(\n|\s)+/g, "\n"],
    [/\s*([,{|<>()=\-+!%^&*:;?/])\s*/g, "$1"],
    [/\s+([}])/g, "$1"],
    [/&REGEX(\d+);/g, function(match, cap1){
        var index = parseInt(cap1, 10);
        return regexes[index];
    }],
    [/$HTTPS;/g, "https://"],
    [/$HTTP;/g, "http://"],
    [/&STRING(\d+);/g, function(match, cap1){
        var index = parseInt(cap1, 10);
        return strings[index];
    }],
];

function minify(inputDir, outputDir, verbose, shrink){
    var output = verbose ? console.log.bind(console) : function(){};

    output("reading from: ", inputDir);
    output("writing to: ", outputDir);

    output("processing input directory");
    fs.readdir(inputDir, function(err, files){
        if(err){
            console.error(err);
        }
        else{
            var total = 0;
            var shrunk = "";
            output("\tfiles found: " + files.length);
            files.forEach(function(file){
                var ext = path.extname(file).substring(1);
                var inputFile = path.join(inputDir, file);
                var outputFile = path.join(outputDir, file);
                var opts = {};
                var minify = ext == "js" && !/\.min/.test(file);
                if(minify || file == "index.html"){
                    opts.encoding = "utf8";
                }
                
                output("\t" + file + " " + (minify ? "" : "not ") + "minifying");
                var data = fs.readFileSync(inputFile, opts);
                var data2 = fs.existsSync(outputFile) && fs.readFileSync(outputFile, opts);
                if(minify){
                    var start = data.length;
                    strings = [];
                    regexes = [];
                    patterns.forEach(function(pattern, iii){
                        while(pattern[0].test(data)){
                            var aaa = data;
                            data = data.replace(pattern[0], pattern[1]);
                            if(aaa.length == data.length){
                                break;
                            }
                        }
                    });
                    var saved = (start - data.length);
                    total += saved;
                    output(file + " saved " + saved + " characters");
                }
                else if(file == "index.html" && shrink){
                    var test = /<script id="setup">((.|\r\n|\n)+)<\/script>/;
                    var body = data.match(test);
                    if(body && body.length > 0){
                        body = body[0];
                        console.log(body);
                        var test2 = /var curAppVersion\s*=\s*(\d+);/;
                        body = body.match(test2);
                        if(body && body.length > 1){
                            var version = parseInt(body[1], 10);
                            shrunk += "\nvar curAppVersion=" + version + ";";
                            data = data.replace(test, "<script async src=\"jwd.min.js#v" + version + "\"></script>");
                        }
                    }
                }
                
                if(ext == "js" && shrink){
                    shrunk += data + "\n";
                }

                var changed = !(data2 && Array.prototype.map.call(data, function(v, i){
                    return i < data2.length && v == data2[i];
                }).reduce(function(a, b){
                    return a && b;
                }));
                output(file, " changed? ", changed);
                if(changed){
                    fs.writeFile(outputFile, data, opts, function(err){
                        if(err){
                            console.error(err);
                        }
                    });
                }
            });
            if(shrink){
                shrunk += "\npageLoad();";
                fs.writeFileSync(path.join(outputDir, "jwd.min.js"), shrunk, {encoding:"utf8"});
            }
            output("Total saved: ", total);
        }
    });
    output("done");
}

module.exports = minify;