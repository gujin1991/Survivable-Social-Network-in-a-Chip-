/**
 * Created by guangyu on 4/17/16.
 */
var cursor = 'default';

$("#map-img").click(function (e) {
    var parentOffset = $(this).parent().offset();
    var clickX = e.pageX - parentOffset.left;
    var clickY = e.pageY - parentOffset.top;
    var relLocation = normalize({"x": clickX, "y": clickY}, mapSize());

    if (cursor !== 'default') {
        addMark(cursor, relLocation)
    }
});

function mapSize() {
    var h = document.getElementById('map-img').height;
    var w = document.getElementById('map-img').width;
    return {"h": h, "w": w};
}

function normalize(location, mapSize) {
    var x = Math.abs(location.x / mapSize.w);
    var y = Math.abs((mapSize.h - location.y) / mapSize.h);
    return {"x": x, "y": y};
}

function denormalize(relLocation, mapSize) {
    var x = relLocation.x * mapSize.w;
    var y = (1 - relLocation.y) * mapSize.h;
    return {"x": x, "y": y};
}

$('#med-btn').click(function () {
    cursor = 'medicine';
});

$('#food-btn').click(function () {
    cursor = 'food';
});

$('#water-btn').click(function () {
    cursor = 'water';
});

function addMark(type, location) {
    alert(type + location.x + location.y);
    var username = $('#myname').val();
    var body = {"name": username, "type": cursor, "location": JSON.stringify(location)};
    $.post('/map', body);
}

socket.on("updateMap", function (locations) {
    //TODO
    console.log(locations);
});