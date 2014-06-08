var rss = require("../xml2json.js");

function G(p){
    return new Getter(p);
}

function Getter(path){
    this.data = null;
    this.host = "www.alexandriava.gov";
    this.path = "/rss.aspx";
    if(path){
        this.path = "/" + path + this.path;
    }
    this.name = path || "general";
}

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

module.exports = {
    pattern: /axva-rss/g,
    handler: function(matches, success, fail){
        var getters = [null, "recreation", "boards", "code", "fire", "council", "districtcourt", "communications", "circuitcourt", "generalservices", "planning", "cityattorney", "cityclerk", "manager", "clerkofcourt", "commattorney", "dchs", "courtservice", "courts", "tes/oeq", "finance", "gis", "health", "historic", "housing", "hr", "humanrights", "technology", "internalaudit", "jdrcourt", "budget", "police", "realestate", "risk", "sheriff", "tes", "elections"].map(G);
        var go = function(){
            var result = {};
            var done = getters.reduce(function(a, b){ return a && b.fill(result); }, true);
            if(done){
                success("application/json", JSON.stringify(result));
            }
        };
        getters.forEach(function(g){ g.retrieve(go, fail);});
    }
};
