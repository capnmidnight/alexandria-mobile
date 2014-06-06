function getText(path, success, fail, sync){
    var req = new XMLHttpRequest();
    req.addEventListener("progress", identityFunc);
    req.addEventListener("load", function () {
        success(req.responseText);
    });
    req.addEventListener("error", fail || identityFunc);
    req.addEventListener("abort", fail || identityFunc);
    req.open("GET", path, !sync);
    req.send();
}

function require(path){
    var module = {};
    var exportObj = {};
    Object.defineProperty(module, "exports", {
        get: function(){
            return exportObj;
        },
        set: function(val){
            exportObj = val;
        },
        enumerable: true,
        configurable: true
    });
    getText(path, function(txt){
        var loader = new Function("module", "exports", txt);
        loader(module, module.exports); 
    }, null, true);   
    return module.exports;
}