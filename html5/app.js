var header = null,
    main = null,
    mapBox = null,
    map = null;

function getControls() {
    header = getDOM("header");
    header.style.left = 0;
    header.style.opacity = 1;

    main = getDOM("#main");

    mapBox = getDOM("#inner-map");
    loadMap("#inner-map");

    window.addEventListener("resize", resize, false);
    window.addEventListener("popstate", moveHistory, false);
}

function resize() {
    var windowHeight = Math.min(window.innerHeight, screen.availHeight);
    // the extra 2 pixels is to avoid a small scroll overlap with the window edge
    main.style.height = px(windowHeight - header.clientHeight - 2);
    main.style.top = px(header.clientHeight);
    if(map) {
        mapBox.style.width = "100%";
        mapBox.style.height = "100%";
        map.setSize(new MQA.Size(px(mapBox.clientWidth), px(mapBox.clientHeight)));
    }
    window.scrollX = window.scrollY = 0;
}

var tagWhitelist = ["a", "u", "p", "br", "em", "ul", "li", "h1", "h2", "h3", "h4", "h5", "h6", "div", "font", "span", "strong"];

function cleanupRSS(txt){
    return txt.replace(/&lt;([\w:]+)((?:\s+[\w:]+\s*=\s*("|').+?\3)*)\s*(\/&gt;|&gt;(.*?)&lt;\/\1&gt;)/g, function(match, tag, attrs, quote, xfv, text, index, doc){
        if(tagWhitelist.indexOf(tag.toLowerCase()) > -1){
            if(xfv == "/&gt;"){
                return fmt("<$1/>", tag);
            }
            else {
                return fmt("<$1 $2>$3</$1>", tag, attrs, text);
            }
        }
        else{
            console.log(tag, match);
            return match;
        }
    });
}

function showTab(tab, skipState) {
    var boxes = getDOMAll("#main>*");
    boxes.forEach(function (box, i) {
        setDisplay(tab == box.id, box);
        box.style.display = tab == box.id ? "" : "none";
    });
    resize();
    if (window[tab + "ScreenShow"]) {
        window[tab + "ScreenShow"]();
    }
    setSetting("lastView", tab);
    if (!skipState) {
        tab = "#" + tab;

        window.history.pushState(
            tab,
            "Alexandria Mobile > " + tab,
            tab);
    }
}

function moveHistory(evt) {
    if (document.location.hash.length > 0) {
        showTab(document.location.hash.substring(1), true);
    }
}

function firstNavigation() {
    var tab, lastView = getSetting("lastView");
    if (document.location.hash.length > 0) {
        tab = document.location.hash.substring(1);
    }
    if (tab && tab.length > 0) {
        showTab(tab);
    }
    else if (lastView) {
        showTab(lastView);
    }
    else {
        showTab("notes");
    }
}

function pageLoad() {
    try {
        getControls();
        firstNavigation();
    }
    catch (exp) {
        console.error(exp);
    }
}