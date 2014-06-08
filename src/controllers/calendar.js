var get = require("../getter");

module.exports = {
    pattern: /calendar/g,
    handler: function(matches, success, fail){
        var getters = ["calendar"]
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
