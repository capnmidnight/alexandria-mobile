var datePattern = /\s+-\s+\w+\s+(\w+)\s+(\d+),\s+(\d+)\s+(\d+):(\d+)\s+(A|P)M(?:\s+-\s+(?:\w+\s+(\w+)\s+(\d+),\s+(\d+)\s+)?(\d+):(\d+)\s+(A|P)M)?/,
    kvPattern = /(?:<br(?: ?\/)>|\()(\w+(?: \w+)*): ([^()\r\n]+)\)?/g;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function pseudoElements(item){
    while(kvPattern.test(item.description)){
        item.description = item.description.replace(kvPattern, function(match, key, value, index, doc){
            key = key.replace(" ", "");
            key = key[0].toLowerCase() + key.substring(1);
            value = value.trim();
            item[key] = value;
            return "";
        }).trim();
    }
}

function makeDate(month, date, year, hour, minute, pm){
    month = months.indexOf(month);
    date = parseInt(date, 10);
    year = parseInt(year, 10);
    hour = parseInt(hour) + ((pm == "P") ? 12 : 0);
    minute = parseInt(minute, 10);
    return new Date(year, month, date, hour, minute, 0, 0);
}

function calendarScreenShow() { 
    getData("calendar", function (obj) {
        var calendar = getDOM("#calendar"),
            header = document.createElement("h2"),
            ul = document.createElement("ul");

        header.innerHTML = "Calendar";

        calendar.innerHTML = "";
        calendar.appendChild(header);
        calendar.appendChild(ul);
        
        obj.calendar.channel.item.forEach(function (item) {
            item.description = cleanupRSS(item.description);
            pseudoElements(item);
            item.tags = item.tags && item.tags.split(/, ?/g);

            var li = document.createElement("li"),
                link = document.createElement("a"),
                matches = item.title.match(datePattern),
                startDate = makeDate(matches[1], matches[2], matches[3], matches[4], matches[5] || matches[11], matches[6] || matches[12]),
                endDate = makeDate(matches[7] || matches[1], matches[8] || matches[2], matches[9] || matches[3], matches[10] || matches[4], matches[11] || matches[5], matches[12] || matches[6]),
                table = document.createElement("table");

            link.innerHTML = item.title.replace(datePattern, "");
            link.href = item.link;

            var tableElements = [
                ["Start", startDate.toLocaleString()],
                ["End", endDate.toLocaleString()]];
            if(item.audience){
                tableElements.push(["Audience", item.audience]);
            }
            if(item.website){
                tableElements.push([fmt("<a href=\"$1\">Website</a>", item.website)]);
            }
            if(item.location){
                tableElements.push(["Location", detectLinks(item.location)]);
            }
            if(item.tags){
                tableElements.push(["Tags", item.tags.map(function(tag){
                    return fmt("<span class=\"tag\">$1</span>",tag);
                }).join(", ")]);
            }

            table.style.width = "100%";
            
            tableElements.push(["&nbsp;"]);
            tableElements.push([detectLinks(item.description)]);
            tableElements.push(["&nbsp;"]);

            tableElements.forEach(function(rowArr){
                var row = document.createElement("tr");
                table.appendChild(row);
                rowArr.forEach(function(itm){
                    var cell = document.createElement("td");
                    cell.innerHTML = itm;
                    if(rowArr.length == 1){
                        cell.colSpan = 2;
                    }
                    row.appendChild(cell);
                });
            });

            ul.appendChild(li);
            li.appendChild(link);
            li.appendChild(table);
        });
    }, alert);
}