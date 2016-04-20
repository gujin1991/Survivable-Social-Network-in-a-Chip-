/**
 * Created by congshan on 4/15/16.
 */
var socket = io.connect();
var markers = new Array();

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});

// add location labels for users
socket.on('updatelocation', function(response){

});

$(document).ready(function() {
    //addUserMarker(0.2,0.3,"Sarah","OK",true);
    //addUserMarker(0.25,0.35,"John","Help",true);
    //addUserMarker(0.39,0.15,"Taylor","Emergency",true);
    //addUserMarker(0.59,0.6,"Ann","Undefined",true);
    //addUserMarker(0.5,0.5,"Congshan","Help",false);
    //addUserMarker(0.18572801024789864, 0.6462580779653598, "Me", "OK", true);
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
    //medicine, food, water

}

/**
 * x: [0,1]; y: [0,1];
 * [0,0] -- left btm, [0,1] -- right btm, [1,0] -- left top, [1,1] -- right top
 * */
function addLabel(x, y, username, status, isOnline) {
    var map = $('#map-img');
    var position = map.position();

    var top = position.top;
    var left = position.left;

    var div = $('<div>', {});
    var element;
    var element_top = top + (1 - y)*map.outerHeight();
    var element_left = left + x*map.outerWidth();

    if (isOnline) {
        element = $('<img />',
            {
                src: '../images/icons/onlinepin.png',
                alt: 'pin',
                width: 20,
                height: 20
            });
        element_top = element_top - element.height();
        element_left = element_left - element.width()/2;
        console.log(element.width(), element.height());
        div.css({position: 'absolute', 'left': element_left, 'top': element_top});
        element.css({'color': "red"});
    } else {
        element = $('<img />',
            {
                src: '../images/icons/offlinepin.png',
                alt: 'pin',
                width: 20,
                height: 20
            });
        element_top = element_top - element.height();
        element_left = element_left - element.width()/2;
        console.log(element.width(), element.height());
        div.css({position: 'absolute', 'left': element_left, 'top': element_top});
        element.css({'color': "grey"});
    }
    var userInfo = $('<span class="label label-info label-map">' + username + '</span>');
    div.append(element);
    div.append(userInfo);
    //$("#map").append(element);
    //$("#map").append(userInfo);
    $('#map').append(div);
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