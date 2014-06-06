var header = null,
    main = null,
    notes = null;

function identityFunc() { }

function getControls() {
    window.addEventListener("resize", resize, false);
    window.addEventListener("popstate", moveHistory, false);

    main = getDOM("#main");
    notes = getDOM("#notes>ul");

    header = getDOM("header");
    header.style.left = 0;
    header.style.opacity = 1;
}

function getData(path, success, fail) {
    var req = new XMLHttpRequest();
    req.addEventListener("progress", identityFunc);
    req.addEventListener("load", function () {
        success(JSON.parse(req.responseText));
    });
    req.addEventListener("error", fail || identityFunc);
    req.addEventListener("abort", fail || identityFunc);
    req.open("GET", path);
    req.send();
}


function notesScreenShow() {
    getData("axvarss", function (obj) {
        notes.innerHTML = "";
        obj.rss.channel.item.forEach(function (item) {
            var li = document.createElement("li");
            var link = document.createElement("a");
            link.innerHTML = item.title;
            link.href = item.link;
            var date = document.createElement("span");
            date.innerHTML = item.pubDate;
            var text = document.createElement("div");
            text.innerHTML = item.description;
            li.appendChild(link);
            li.appendChild(date);
            li.appendChild(text);
            notes.appendChild(li);
        });
        console.log(obj);
    }, alert);
}

function mapScreenShow() { }
function calendarScreenShow() { }
function aboutScreenShow() { }settings


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

function resize() {
    var windowHeight = Math.min(window.innerHeight, screen.availHeight);
    // the extra 2 pixels is to avoid a small scroll overlap with the window edge
    main.style.height = px(windowHeight - header.clientHeight - 2);
    main.style.top = px(header.clientHeight);
    window.scrollX = window.scrollY = 0;
}

function firstNavigation() {
    var tab, lastView = getSetting("lastView");
    if (document.location.hash.length > 0) {
        tab = document.location.hash.substring(1);
    }
    console.log("lastView", lastView);
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

function pageLoad(loadDataDone, initDone) {
    var doneDone = function () {
        if (loadDataDone) {
            loadDataDone();
        }
        firstNavigation();
        if (initDone) {
            initDone();
        }
    };
    try {
        getControls();
        clockTick();
        resize();
        loadData(doneDone);
    }
    catch (exp) {
        doneDone();
    }
}