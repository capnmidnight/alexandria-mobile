var fs = require("fs"),
    mime = require("mime"),
    http = require("http"),
    core = require("./core.js");

var routes = [[/axvarss/g, getRSS]];
function getRSS(matches, success, fail){
    var req = http.get("http://www.alexandriava.gov/rss.aspx", function (res){
        res.setEncoding("utf8");
        res.on("data", function(chunk){
            console.log("DAT:", chunk);
            success(mime.lookup("anything.xml"), chunk);
        });
    }, fail);

    req.end();
}

module.exports = function(dirName){
    return function(req, res){
        if (req.method === "GET" && req.url[0] === "/"){
            if (req.url.length == 1)
                req.url += "index.html";
            var path = dirName + req.url;
            fs.exists(path, function(yes){
                if(yes){
                    fs.readFile(path,
                    function (err, data){
                        if (err){
                            serverError(res, req.url);
                        }
                        else{
                            res.writeHead(200, { "Content-Type": mime.lookup(path) });
                            res.end(data);
                        }
                    });
                }
                else{
                    for(var i = 0; i < routes.length; ++i){
                        var matches = path.match(routes[i][0]);
                        if(matches){
                            matches.shift();
                            routes[i][1].call(this, matches, function(mimeType, data){
                                res.writeHead(200, {"Content-Type": mimeType});
                                res.end(data);
                            }, serverError.bind(this, res, path));
                        }
                    }
                }
            });
        }
        else{
            serverError(res);
        }
    }
};

function serverError(res, path){
    if (path){
        res.writeHead(404);
        res.end("error loading " + path.substring(1));
    }
    else{
        res.writeHead(500);
        res.end("error");
    }
}
