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
            alert("x " + relLocation.x + "\t" + "y " + relLocation.y);
            var username = $('#myname').val();
            var body = {"name": username, "type": "user", "location": JSON.stringify(relLocation)};
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
    //TODO implement it
    console.log(locations);
});

sendLocation();
