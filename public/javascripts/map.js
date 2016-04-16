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
    addLabel(0.2, 0.3, "Congshan Lv", "OK", true);
    addLabel(0.4, 0.63, "Sarah", "OK", true);
});

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