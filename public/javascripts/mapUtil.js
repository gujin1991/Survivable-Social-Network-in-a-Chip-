/**
 * Created by guangyu on 4/19/16.
 */

var topLeftX = -79.948288;
var topLeftY = 40.445038;
var topRightX = -79.938920;
var bottomLeftY = 40.440241;

var xLength = topRightX - topLeftX;
var yLength = topLeftY - bottomLeftY;

function sendLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var relLocation = normalize(position.coords.longitude, position.coords.latitude);
            //alert("x " + relLocation.x + "\t" + "y " + relLocation.y);
            var username = $('#myname').val();
            var status = $('#mystatus').val();
            var body = {"name": username, "status": status, "type": "user", "location": JSON.stringify(relLocation)};
            $.post('/map', body);
        });
    } else {
        alert("Geo location is not supported.");
    }
}

function normalize(longitude, latitude) {
    var relX = Math.abs(longitude - topLeftX) / xLength;
    var relY = Math.abs(latitude - topLeftY) / yLength;
    return {"x": relX, "y": relY};
}

socket.on("updateMap", function (locations) {
    clearMarkers();
    for (item in locations) {
        var obj = locations[item];
        var location = JSON.parse(obj.location);
        var name = obj.name;
        var status = obj.status;
        var isOnline = true;
        addMarker(parseFloat(location.x),parseFloat(location.y),name,status,isOnline);
    }
});

function clearMarkers() {
    for(i=0;i<markers.length;i++) {
        map.removeLayer(markers[i]);
    }
}
sendLocation();
//var timerId; // current timer if started
//function clockStart() {
//    if (timerId) return;
//
//    timerId = setInterval(sendLocation, 10000);
//    sendLocation();  // (*)
//}
//
//function clockStop() {
//    clearInterval(timerId);
//    timerId = null
//}

//clockStart();