/**
 * Created by congshan on 4/15/16.
 */
var socket = io.connect();

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});

// add location labels for users
socket.on('updatelocation', function(response){

});

$(document).ready(function() {
    addMarker();
});

function addMarker() {
    map.setMaxBounds(bounds);
    L.imageOverlay(url, bounds).addTo(map);
    var m = {
        x: 900,
        y: 600
    };
    var marker = L.marker(map.unproject([m.x, m.y], map.getMaxZoom()-0.5)).addTo(map);
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
//    var thirtypc = (80 * height) / 100;
//    thirtypc = parseInt(thirtypc) + 'px';
//    $(".jumbotron").css('height',thirtypc);
//}
//
//$(document).ready(function() {
//    thirty_pc();
//    $(window).bind('resize', thirty_pc);
//});