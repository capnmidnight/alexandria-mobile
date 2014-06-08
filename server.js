var format = require("util").format,
    fs = require("fs"),
    os = require("os"),
    core = require('./src/core'),
    http = require("http"),
    webServer = require("./src/webServer"),
    proc = require("child_process").spawn,
    options = require("./src/options"),
    minify = require("./src/minifier"),
    path = require("path");

options.parse(process.argv);

var srcDir = "html5";
console.log(os.platform());
var startProc = (os.platform() == "win32") ? "explorer" : null;

if(options.m == "true"){
    minify(
        options.i || "html5",
        options.o || "obj",
        options.v != "false",
        options.s != "false");
    srcDir = "obj";
}

var app = http.createServer(webServer(srcDir));
app.listen(8080);
if(options.m != "true" && startProc){
    proc(startProc, ["http://localhost:8080"]);
}