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

            mapBox.addEventListener("touchmove", function(evt){
                var x = 0, y = 0;
                for(var i = 0; i < evt.touches.length; ++i){
                    var touch = evt.touches[i];
                    x += touch.clientX;
                    y += touch.clientY;
                }

                x /= evt.touches.length;
                y /= evt.touches.length;

                if(this.lastX != undefined && this.lastY != undefined){
                    var dx = x - this.lastX;
                    var dy = y - this.lastY;
                    var xAxis = Math.abs(dx) >= Math.abs(dy);
                    if(xAxis){
                        if(dx < 0){
                            map.panEast();
                        }
                        else if(dx > 0){
                            map.panWest();
                        }
                    }
                    else{
                        if(dy < 0){
                            map.panSouth();
                        }
                        else if(dy > 0){
                            map.panNorth();
                        }
                    }
                }

                this.lastX = x;
                this.lastY = y;
                evt.preventDefault();
            });
        }, locErr, mapOpts);
    }, function(err){
        console.error("Couldn't load MapQuest: ", err);
    });
}

function mouseWheelZoom(){
    MQA.withModule('mousewheel', function() {
        map.enableMouseWheelZoom();
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
