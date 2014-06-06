﻿var rss = require("../xml2json.js");

module.exports = {
    pattern: /axvarss/g,
    handler: function(matches, success, fail){
        rss.get({
            host: "www.alexandriava.gov",
            path: "/rss.aspx"
        }, function(json) {
           success("application/json", JSON.stringify(json));
        }, fail);
    }
};