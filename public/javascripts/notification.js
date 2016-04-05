/**
 * Created by guangyu on 4/4/16.
 */

var typeGreatNews = "Great News!";
var typeEmergency = "Emergency!";
var type = typeGreatNews;

$('#notification-btn').click(function () {
    var content = document.getElementById('focusedInput').value;
    var length = content.split(/[^\s]+/).length - 1;
    if (length == 0) {
        swal("Say Something", "Your notification cannot be empty", "error");
    } else if (length > 10) {
        swal("Too Long", "Your notification should be within 10 words", "error");
    } else {
        var sender = $('#myname').val();
        var notification = {'type': type, 'content': content, 'sender': sender};
        $.post("/notification", notification);
    }
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

function showNotification(notification) {
    var image;
    if (notification.type == 'Great News!') {
        image = "images/icons/greatNews.gif";
        document.getElementById("greatNewsSound").play();
    } else {
        image = "images/icons/emergency.gif";
        document.getElementById("emergencySound").play();
    }
    swal({
        title: notification.content,
        text: "<span style=\"font-size:12pt\">" + " sent from " + notification.sender + "</span>",
        html: true,
        imageUrl: image,
        confirmButtonText: "Confirm"
    });
}