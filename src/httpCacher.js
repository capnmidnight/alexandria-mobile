var h = require("http"),
    fs = require("fs");

function fillInDirs(dirs, done) {
    if (dirs.length == 0) {
        done();
    }
    else {
        var dir = dirs.shift();
        fs.exists(dir, function (exists) {
            if (!exists) {
                console.log("creating directory:", dir);
                fs.mkdir(dir, function () {
                    fillInDirs(dirs, done);
                });
            }
            else {
                fillInDirs(dirs, done);
            }
        });
    }
}

function cachedGet(options, success, fail) {
    if(typeof(options) === "string"){
        var parts = options.split("/");
        options = {
            host: options.shift(),
            path: "/" + parts.join("/")
        };
    }
    fail = fail || function(){};
    var paths = [options.host];
    options.path.split("/").slice(1).forEach(function (part) { paths.push(paths[paths.length - 1] + "/" + part); });
    var file = paths.pop();
    fillInDirs(paths, function () {
        fs.exists(file, function (exists) {
            if (exists) {
                console.log("reading from cache: ", file);
                fs.readFile(file, { encoding: "utf8" }, function (err, data) {
                    if (err) {
                        fail(err);
                    }
                    else {
                        success(data);
                    }
                });
            }
            else {
                console.log("retrieving: ", options.host + options.path);
                options.headers = {
                    "User-Agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13"
                };
                h.get(options, function (resp) {
                    resp.setEncoding("utf8");
                    var accum = "";
                    resp.on("data", function (chunk) { accum += chunk; })
                        .on("end", function () {
                            fs.writeFile(file, accum, { encoding: "utf8" }, function () { success(accum); });
                        });
                }).on("error", fail);
            }
        });
    });
}

module.exports.get = cachedGet;
