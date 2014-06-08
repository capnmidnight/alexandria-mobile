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
            setMarker(position);
            navigator.geolocation.watchPosition(setMarker, locErr, mapOpts);
        }, locErr, mapOpts);
        smallZoom();
        geoLocationControl();
    }, function(err){
        console.error("Couldn't load MapQuest: ", err);
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
