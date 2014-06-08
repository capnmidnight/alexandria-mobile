var rss = require("./xml2json.js");

function Getter(path){
    this.data = null;
    this.host = (path == "calendar") ? "apps.alexandriava.gov" : "www.alexandriava.gov";
    this.path = "/rss.aspx";
    if(path){
        this.path = "/" + path + this.path;
    }
    this.name = path || "general";
}

Getter.make = function(p){ return new Getter(p); };

Getter.prototype.retrieve = function(success, fail){
    var self = this;
    rss.get({ host: this.host, path: this.path }, function(obj) {
        self.data = obj;
        success();
    }, function(err){
        self.data = err;
        fail(err);
    });
};

Getter.prototype.fill = function(obj){
    if(this.data != null){
        if(this.data.rss){
            obj[this.name] = this.data.rss;
        }
        return true;
    }
    return false;
}

module.exports = Getter.make;