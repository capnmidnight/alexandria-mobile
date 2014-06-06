function notesScreenShow() {
    getData("axva-rss", function (obj) {
        var notes = getDOM("#notes>ul");
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
    }, alert);
}