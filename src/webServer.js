var fs = require("fs"),
    mime = require("mime"),
    http = require("http"),
    rss = require("./xml2json.js"),
    core = require("./core.js"),
    routes = require("./controllers.js");

function sendStaticFile(res, url, path){
    fs.readFile(path, function (err, data){
        if (err){
            serverError(res, url);
        }
        else{
            res.writeHead(200, { "Content-Type": mime.lookup(path) });
            res.end(data);
        }
    });
}

function matchController(res, path){
    for(var i = 0; i < routes.length; ++i){
        var matches = path.match(routes[i].pattern);
        if(matches){
            matches.shift();
            routes[i].handler.call(this, matches, function(mimeType, data){
                res.writeHead(200, {"Content-Type": mimeType});
                res.end(data);
            }, serverError.bind(this, res, path));
        }
    }
}

module.exports = function(dirName){
    return function(req, res){
        if (req.method === "GET" && req.url[0] === "/"){
            if (req.url.length == 1)
                req.url += "index.html";
            var path = dirName + req.url;
            fs.exists(path, function(yes){
                if(yes){
                    sendStaticFile(res, req.url, path);
                }
                else{
                    matchController(res, path)
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
