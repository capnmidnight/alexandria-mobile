function getScript(src, success, fail) {
    if(!this.history){
          this.history = {};
    }
    var history = this.history;
    if(!history[src]){
        if(!/http(s):/.test(src)){
            src = src + "#v" + curAppVersion;
        }
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.addEventListener("error", fail);
        s.addEventListener("abort", fail);
        s.addEventListener("load", function(){
            history[src] = true;
            success();
        });
        document.head.appendChild(s);
        s["src"] = src;
    }
}

var include = (function () {
    var G = document.createElement("div");
    var Gs = G.style;
    Gs.position = "absolute";
    Gs.height = "100%";
    Gs.right = 0;
    Gs.padding = 0;
    Gs.margin = 0;
    Gs.border = 0;
    Gs.backgroundColor = "rgba(96, 96, 112, 0.5)";

    var toLoad = {};
    function set(i, m) {
        if (m.indexOf("#") == m.length - 1) {
            m = m.substring(0, m.length - 1);
        }
        toLoad[m] = i;
        var c, g;
        c = g = 0;
        for (var k in toLoad) {
            c++;
            if (toLoad[k] == 1) {
                g++;
            }
        }
        var v = (g * 100 / c);
        Gs.left = v + "%";
        if (c > 0 && c == g) {
            document.body.removeChild(G);
            pageLoad();
        }
    }

    function tryAppend(success) {
        if (!document.body) {
            setTimeout(tryAppend.bind(this, success), 10);
        }
        else if (G.parentElement != document.body) {
            document.body.appendChild(G);
            success();
        }
    }

    function loadLibs(libs) {
        var thunk = function (m, l) {
            set(1, m);
            loadLibs(l);
        };
        if (libs.length > 0) {
            var m = libs.shift();
            var t = thunk.bind(this, m, libs);
            getScript(m, t, t);
        }
    }

    function include() {
        var libs = Array.prototype.slice.call(arguments);
        libs.forEach(set.bind(this, 0));
        tryAppend(loadLibs.bind(this, libs));
    }

    return include;
})();