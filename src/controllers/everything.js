var get = require("../getter");

module.exports = {
    pattern: /axva-rss/g,
    handler: function(matches, success, fail){
        var getters = [null, "recreation", "boards", "code", "fire", "council", "districtcourt", "communications", "circuitcourt", "generalservices", "planning", "cityattorney", "cityclerk", "manager", "clerkofcourt", "commattorney", "dchs", "courtservice", "courts", "tes/oeq", "finance", "gis", "health", "historic", "housing", "hr", "humanrights", "technology", "internalaudit", "jdrcourt", "budget", "police", "realestate", "risk", "sheriff", "tes", "elections"]
            .map(get);
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
