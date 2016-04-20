/**
 * Created by guangyu on 4/17/16.
 */
var cursor = 'default';
var socket = io.connect();

$(document).keydown(function (event) {
    if (event.keyCode == 27) {
        cursor = 'default';
    }
});

$('#med-btn').click(function () {
    cursor = 'medicine';
});

$('#food-btn').click(function () {
    cursor = 'food';
});

$('#water-btn').click(function () {
    cursor = 'water';
});

var xLength = 318;
var yLength = 212;

function specialNormalize(location) {
    var x = Math.abs(location.x / xLength);
    var y = Math.abs(location.y / yLength);
    return {"x": x, "y": y};
}

function addMark(location) {
    if (cursor !== 'default') {
        alert(cursor + location.x + location.y);
        var username = $('#myname').val();
        var body = {"name": username, "status": null, "type": cursor, "location": JSON.stringify(location)};
        $.post('/map', body);
    }
}

socket.on("updateMap", function (locations) {
    //TODO implement it
    console.log(locations);
});