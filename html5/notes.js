
function notesScreenShow() {
    getData("notes", function (obj) {
        var notes = getDOM("#notes");
        notes.innerHTML = "";
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                var header = document.createElement("h2"),
                    ul = document.createElement("ul");

                header.innerHTML = obj[key].channel.title.split("|")[1].trim();

                notes.appendChild(header);
                notes.appendChild(ul);
        
                obj[key].channel.item.forEach(function (item) {
                    var li = document.createElement("li"),
                        link = document.createElement("a"),
                        date = document.createElement("div"),
                        text = document.createElement("div");

                    link.innerHTML = item.title;
                    link.href = item.link;
                    date.innerHTML = item.pubDate;                    
                    text.innerHTML = detectLinks(cleanupRSS(item.description));

                    ul.appendChild(li);
                    li.appendChild(link);
                    li.appendChild(date);
                    li.appendChild(text);
                });
            }
        }
    }, alert);
}