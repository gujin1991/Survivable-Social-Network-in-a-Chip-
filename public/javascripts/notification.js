/**
 * Created by guangyu on 4/4/16.
 */

var typeGreatNews = "Great News!";
var typeEmergency = "Emergency!";
var type = typeGreatNews;

$('#notification-btn').click(function () {
    // TODO add maximum word limit
    sendNotification();
    document.getElementById('focusedInput').value = "";
});

$('#cancel-btn').click(function () {
    document.getElementById('focusedInput').value = "";
    swal("Cancelled", "Your notification has been cancelled!", "error");
});

socket.on('broadcast notification', function (notification) {
    showNotification(notification)
});

$('#type-great').click(function () {
    type = typeGreatNews;
});

$('#type-emergency').click(function () {
    type = typeEmergency;
});

function sendNotification() {
    var content = document.getElementById('focusedInput').value;
    var sender = $('#myname').val();
    var notification = {'type': type, 'content': content, 'sender': sender};
    $.post("/notification", notification);
}

function showNotification(notification) {
    var image, sound;
    if (notification.type == 'Great News!') {
        // TODO add sound
        image = "images/icons/greatNews.gif";
    } else {
        image = "images/icons/emergency.gif";
    }
    swal({
        title: notification.content,
        text: "<span style=\"font-size:12pt\">" + " sent from " + notification.sender + "</span>",
        html: true,
        imageUrl: image,
        confirmButtonText: "Confirm"
    });
}