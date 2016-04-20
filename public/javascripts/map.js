/**
 * Created by congshan on 4/15/16.
 */
var socket = io.connect();
var markers = new Array();

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});

$(document).ready(function() {
    //addUserMarker(0.2,0.3,"Sarah","OK",true);
    //addUserMarker(0.25,0.35,"John","Help",true);
    //addUserMarker(0.39,0.15,"Taylor","Emergency",true);
    //addUserMarker(0.59,0.6,"Ann","Undefined",true);
    //addUserMarker(0.5,0.5,"Congshan","Help",false);
    //addUserMarker(0.18572801024789864, 0.6462580779653598, "Me", "OK", true);
    //addFacilityMarker(0.2,0.3,"med1", "medicine");
    //addFacilityMarker(0.39,0.15,"fd1", "food");
    //addFacilityMarker(0.59,0.6,"wt1","water");
});

function addUserMarker(x,y,username,status,isOnline) {
    var w = 1800*x;
    var h = 1200*y;
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
        marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom()-0.5), {icon: onlineMarker});
    } else {
        var offlineMarker = L.AwesomeMarkers.icon({
            icon: 'times-circle', markerColor: 'lightgray', prefix: 'fa'
        });
        marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom()-0.5), {icon: offlineMarker});
    }
    marker.bindLabel(username, { noHide: true,direction: 'auto'});
    marker.addTo(map);
    markers.push(marker);
}

function addFacilityMarker(x,y,name,type) {
    var w = 1800*x;
    var h = 1200*y;
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
    } else if (type == "food") {
        markerStyle = L.AwesomeMarkers.icon({
            icon: 'fa-cutlery', markerColor: 'lightgreen', prefix: 'fa'
        });
    } else if (type == "water") {
        markerStyle = L.AwesomeMarkers.icon({
            icon: 'fa-tint', markerColor: 'lightblue', prefix: 'fa'
        });
    } else {
        markerStyle = L.AwesomeMarkers.icon({
            icon: 'question-circle', markerColor: 'lightblue', prefix: 'fa'
        });
    }
    marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom()-0.5), {icon: markerStyle});
    marker.bindLabel(name, { noHide: true,direction: 'auto'});
    marker.addTo(map);
    markers.push(marker);
}

function clearMarkers() {
    for(i=0;i<markers.length;i++) {
        map.removeLayer(markers[i]);
    }
}

//function thirty_pc() {
//    var height = $(window).height();
//    var thirtypc = (85 * height) / 100;
//    thirtypc = parseInt(thirtypc) + 'px';
//    $(".jumbotron").css('height',thirtypc);
//}
//
//$(document).ready(function() {
//    thirty_pc();
//    $(window).bind('resize', thirty_pc);
//});