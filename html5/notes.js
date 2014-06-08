function notesScreenShow() {
    getData("axva-rss", function (obj) {
        var notes = getDOM("#notes");
        notes.innerHTML = "";
        var items = [];
        console.log(obj.calendar);
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                var header = document.createElement("h2");
                header.innerHTML = obj[key].channel.title.match(/\|?\s*(.+)/)[1];
                notes.appendChild(header);

                var ul = document.createElement("ul");
                notes.appendChild(ul);
        
                obj[key].channel.item.forEach(function (item) {
                    var li = document.createElement("li");
                    ul.appendChild(li);

                    var link = document.createElement("a");
                    link.innerHTML = item.title;
                    link.href = item.link;
                    li.appendChild(link);

                    var date = document.createElement("span");
                    date.innerHTML = item.pubDate;
                    li.appendChild(date);
                    
                    var text = document.createElement("div");
                    text.innerHTML = item.description;
                    li.appendChild(text);
                });
            }
        }
    }, alert);
}