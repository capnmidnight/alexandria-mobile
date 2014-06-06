var fs = require("fs");
module.exports = []
fs.readdir("./src/controllers", function(err, files){
    if(!err){
        files.forEach(function(file){
            module.exports.push(require("./controllers/" + file));
        });
    }
});