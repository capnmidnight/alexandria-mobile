var datePattern = /\s+-\s+\w+\s+(\w+)\s+(\d+),\s+(\d+)\s+(\d+):(\d+)\s+(A|P)M(?:\s+-\s+(?:\w+\s+(\w+)\s+(\d+),\s+(\d+)\s+)?(\d+):(\d+)\s+(A|P)M)?/;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function calendarScreenShow() { 
    getData("calendar", function (obj) {
        var calendar = getDOM("#calendar"),
            header = document.createElement("h2"),
            ul = document.createElement("ul");

        header.innerHTML = "Calendar";

        calendar.innerHTML = "";
        calendar.appendChild(header);
        calendar.appendChild(ul);
        
        obj.calendar.channel.item.forEach(function (item, i) {
            var li = document.createElement("li"),
                link = document.createElement("a"),
                start = document.createElement("div"),
                end = document.createElement("div"),
                text = document.createElement("p"),
                matches = item.title.match(datePattern),
                startMonth = months.indexOf(matches[1]),
                startDate = parseInt(matches[2], 10),
                startYear = parseInt(matches[3], 10),
                startHour = parseInt(matches[4], 10) + ((matches[6] == "P") ? 12 : 0),
                startMinute = parseInt(matches[5], 10),
                startDate = new Date(startYear, startMonth, startDate, startHour, startMinute, 0, 0)
                endMonth = months.indexOf(matches[7] || matches[1]),
                endDate = parseInt(matches[8] || matches[2], 10),
                endYear = parseInt(matches[9] || matches[3], 10),
                endHour = parseInt(matches[10] || matches[4], 10) + (((matches[6] || matches[12]) == "P") ? 12 : 0),
                endMinute = parseInt(matches[11] || matches[5], 10),
                endDate = new Date(endYear, endMonth, endDate, endHour, endMinute, 0, 0);

            link.innerHTML = item.title.replace(datePattern, "");
            link.href = item.link;
            start.innerHTML = "start: " + startDate.toString();
            end.innerHTML = "end: " + endDate.toString();
            text.innerHTML = cleanupRSS(item.description);

            ul.appendChild(li);
            li.appendChild(link);
            li.appendChild(start);
            li.appendChild(end);
            li.appendChild(text);
        });
    }, alert);
}