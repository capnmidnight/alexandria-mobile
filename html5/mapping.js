function loadMap() {
    var mapOpts = {
        enableHighAccuracy: true, 
        maximumAge        : 500, 
        timeout           : Infinity
    };

    var locErr = function(err){
        console.error("Couldn't get location: ", err);
    };

    getScript("http://open.mapquestapi.com/sdk/js/v7.0.s/mqa.toolkit.js?key=Fmjtd%7Cluur2g6yn9%2Cb5%3Do5-9az2ur", function(){
        navigator.geolocation.getCurrentPosition(function(position) {
            map = new MQA.TileMap({
                elt: mapBox,
                latLng: { lat: position.coords.latitude, lng: position.coords.longitude },
                zoom: 13,
                mtype: 'osm',
                bestFitMargin: 0,
                zoomOnDoubleClick: true
            });
            smallZoom();
            geoLocationControl();
            mouseWheelZoom();
            setMarker(position);
            navigator.geolocation.watchPosition(setMarker, locErr, mapOpts);

            window.addEventListener("touchmove", touchmovemap);
            window.addEventListener("touchend", resetMapMove);
            window.addEventListener("touchstart", resetMapMove);
        }, locErr, mapOpts);
    }, function(err){
        console.error("Couldn't load MapQuest: ", err);
    });
}

function touchmovemap(evt){
    switch(evt.touches.length){
        case 1:
            moveMap(evt.touches[0]);
            break;
        case 2:
            zoomMap(evt.touches[0], evt.touches[1]);
            break;
    }
    evt.preventDefault();
}

var lastMoveX = -1, lastMoveY = -1, lastDistance = -1;

function resetMapMove(){
    lastMoveX = -1;
    lastMoveY = -1;
    lastDistance = -1;
}

var zoomThreshold = 20;

function zoomMap(a, b){
    var dx = a.clientX - b.clientX;
    var dy = a.clientY - b.clientY
    var distance = Math.sqrt(dx * dx + dy * dy);
    var deltaDistance = 0;
    if(lastDistance > -1){
        var zoom = map.getZoomLevel();
        var deltaDistance = distance - lastDistance;
        if(Math.abs(deltaDistance) >= zoomThreshold){
            if(deltaDistance <= -zoomThreshold){
                --zoom;
            }
            else if(deltaDistance >= zoomThreshold){
                ++zoom;
            }

            zoom = Math.max(2, Math.min(18, zoom));
            map.setZoomLevel(zoom);
            lastDistance = -1;
        }
    }
    if(lastDistance == -1 || deltaDistance >= zoomThreshold){
        lastDistance = distance;
    }
}

function moveMap(point){
    if(lastMoveX > -1 && lastMoveY > -1){
        var dx = point.clientX - lastMoveX;
        var dy = point.clientY - lastMoveY;
        var bounds = map.getBounds();
        var center = map.getCenter();
        var dLat = bounds.lr.lat - bounds.ul.lat;
        var dLng = bounds.lr.lng - bounds.ul.lng;
        center.lat -= dy * dLat / map.height;
        center.lng -=  dx * dLng / map.width;
        map.setCenter(center);
    }

    lastMoveX = point.clientX;
    lastMoveY = point.clientY;
}

function mouseWheelZoom(){
    MQA.withModule('mousewheel', function() {
        map.enableMouseWheelZoom();
    });
}

function largeZoom(){
    MQA.withModule('largezoom', function() {
        map.addControl(new MQA.LargeZoom(), new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5)));
    });
}

function smallZoom(){
    MQA.withModule('smallzoom', function() {
        map.addControl(new MQA.SmallZoom(), new MQA.MapCornerPlacement(MQA.MapCorner.TOP_LEFT, new MQA.Size(5,5)));
    });
}

function viewOptions(){
    MQA.withModule('viewoptions', function() {
        map.addControl(new MQA.ViewOptions());
    });
}

function geoLocationControl(){
    MQA.withModule('geolocationcontrol', function() {
        map.addControl(new MQA.GeolocationControl());
    });
}

function setMarker(position){
    if(this.marker){
        map.removeShape(this.marker);
    }
    var loc = { lat: position.coords.latitude, lng: position.coords.longitude };
    this.marker = new MQA.Poi(loc);
    map.addShape(this.marker);
}

function mapScreenShow() {
}
