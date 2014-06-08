function calendarScreenShow() { 
    getData("calendar", function (obj) {
        var calendar = getDOM("#calendar");
        calendar.innerHTML = "";

        var header = document.createElement("h2");
        header.innerHTML = "Calendar";
        calendar.appendChild(header);

        var ul = document.createElement("ul");
        calendar.appendChild(ul);
        console.log(obj.calendar.channel.item[0]);
        obj.calendar.channel.item.forEach(function (item) {
            var li = document.createElement("li");
            ul.appendChild(li);

            var link = document.createElement("a");
            link.innerHTML = item.title;
            link.href = item.link;
            li.appendChild(link);
                    
            var text = document.createElement("div");
            text.innerHTML = item.description;
            li.appendChild(text);
        });
    }, alert);
}