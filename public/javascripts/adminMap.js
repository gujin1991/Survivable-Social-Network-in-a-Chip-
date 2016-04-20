var cursor = 'default';
var socket = io.connect();

socket.on('connect', function () {
    socket.emit('login', $("#myname").val());
});

var markers = [];

$(document).ready(function () {
    mapInit();
});

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
        swal({
            title: "Sure to add " + cursor + "?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#33cc33",
            confirmButtonText: "Yes, add it!",
            closeOnConfirm: false
        }, function () {
            var username = $('#myname').val();
            var body = {"name": username, "status": null, "type": cursor, "location": JSON.stringify(location)};
            $.post('/map', body);
            cursor = 'default';
            swal("Added!", "Your " + cursor + " has been added.", "success");
        });
    }
}

function deleteMarker(name) {
    var body = {"name": name};
    $.post('/mapdel', body);
}

function mapInit() {
    $.post('/mapinit', {});
}

function addUserMarker(x, y, username, status, isOnline) {
    var w = 1800 * x;
    var h = 1200 * y;
    var m = {
        x: w,
        y: h
    };
    var marker;
    if (isOnline) {
        var onlineMarker;
        if (status == "OK") {
            onlineMarker = L.AwesomeMarkers.icon({
                icon: 'check-circle', markerColor: 'green', prefix: 'fa'
            });
        } else if (status == "Help") {
            onlineMarker = L.AwesomeMarkers.icon({
                icon: 'info-circle', markerColor: 'orange', prefix: 'fa'
            });
        } else if (status == "Emergency") {
            onlineMarker = L.AwesomeMarkers.icon({
                icon: 'plus-circle', markerColor: 'red', prefix: 'fa'
            });
        } else {
            onlineMarker = L.AwesomeMarkers.icon({
                icon: 'question-circle', markerColor: 'blue', prefix: 'fa'
            });
        }
        marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom() - 0.5), {icon: onlineMarker});
    } else {
        var offlineMarker = L.AwesomeMarkers.icon({
            icon: 'times-circle', markerColor: 'lightgray', prefix: 'fa'
        });
        marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom() - 0.5), {icon: offlineMarker});
    }
    marker.bindLabel(username, {noHide: true, direction: 'auto'});
    marker.addTo(map);
    markers.push(marker);
}

function addFacilityMarker(x, y, name, type) {
    var w = 1800 * x;
    var h = 1200 * y;
    var m = {
        x: w,
        y: h
    };
    var marker;
    var markerStyle;
    if (type == "medicine") {
        markerStyle = L.AwesomeMarkers.icon({
            icon: 'fa-medkit', markerColor: 'lightred', prefix: 'fa'
        });
        marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom() - 0.5), {icon: markerStyle});
        marker.bindLabel(name, {noHide: true, direction: 'auto'});
        marker.addEventListener('click', function () {
            swal({
                title: "Medicine",
                text: "Are you sure you want to delete it?",
                imageUrl: "images/icons/medicine.png",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                deleteMarker(name);
                swal("Deleted!", "This medicine repository has been removed", "success");
            });
        });
    } else if (type == "food") {
        markerStyle = L.AwesomeMarkers.icon({
            icon: 'fa-cutlery', markerColor: 'lightgreen', prefix: 'fa'
        });
        marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom() - 0.5), {icon: markerStyle});
        marker.bindLabel(name, {noHide: true, direction: 'auto'});
        marker.addEventListener('click', function () {
            swal({
                title: "Food",
                text: "Are you sure you want to delete it?",
                imageUrl: "images/icons/food.png",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                deleteMarker(name);
                swal("Deleted!", "This food repository has been removed", "success");
            });
        });
    } else if (type == "water") {
        markerStyle = L.AwesomeMarkers.icon({
            icon: 'fa-tint', markerColor: 'lightblue', prefix: 'fa'
        });
        marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom() - 0.5), {icon: markerStyle});
        marker.bindLabel(name, {noHide: true, direction: 'auto'});
        marker.addEventListener('click', function () {
            swal({
                title: "Water",
                text: "Are you sure you want to delete it?",
                imageUrl: "images/icons/water.png",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false
            }, function () {
                deleteMarker(name);
                swal("Deleted!", "This water repository has been removed", "success");
            });
        });
    } else {
        markerStyle = L.AwesomeMarkers.icon({
            icon: 'question-circle', markerColor: 'lightblue', prefix: 'fa'
        });
        marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom() - 0.5), {icon: markerStyle});
        marker.bindLabel(name, {noHide: true, direction: 'auto'});
    }

    marker.addTo(map);
    markers.push(marker);
}

function clearMarkers() {
    for (i = 0; i < markers.length; i++) {
        map.removeLayer(markers[i]);
    }
}

socket.on("updateMap", function (locations) {
    console.log(locations);
    clearMarkers();
    for (item in locations) {
        var obj = locations[item];
        var location = JSON.parse(obj.location);
        var name = obj.name;
        var type = obj.type;
        if (type == "user") {
            var status = obj.status;
            var isOnline = obj.online;
            addUserMarker(parseFloat(location.x), parseFloat(location.y), name, status, isOnline);
        } else {
            addFacilityMarker(parseFloat(location.x), parseFloat(location.y), name, type);
        }
    }
});
