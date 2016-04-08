/**
 * Created by Jin Gu on 4/1/16.
 */

var socket = io.connect();
var content = $('#msgPrivate');
var username = $("#myname").val();
var hostname;

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
    //getPreviousMessage(username);
    $.get('/getGroup',{'userName':username}, function(data) {
        console.log(data.code + "code");
        if(data.code == 200) {
            for (var i = 0; i < data.group.length; i++) {
                console.log('good');
                var request = "/groupPage?hostname=" + data.group[i].GroupName;
                console.log('<a href=' + request + ' >' + data.group[i].GroupName + "'s room" + '</a><br>');

                $('#private-stream-list').prepend('<a href=' + request + ' >' + data.group[i].GroupName + "'s room" + '</a><br>');
                //<li><a href="/groupChat">Group Chat</a></li>

                //$('#private-stream-list').append("good");
            }
            console.log(data);
        }
    });

});




$('#start-btn').click(function() {
    var groupName = username;
    console.log(groupName);
    $.post('/createNewGroup', {'groupName':groupName}, function(res) {
        //console.log(res + "code");
       if(res.statusCode != 200) {
           swal({title: "Sorry!",text: "You can not create a new group for reasons!", type: "warning", confirmButtonText: "OK" });
       } else {
           window.location.href="/groupPage?hostname=" + username;
       }
    });
});

socket.on('get group invitation', function(invitation){
    username = $('#myname').val();
    console.log("get invitation");
    if(invitation.receiver == username)
        swal({   title: "Notification!",   text: "You have a group invitation from " + invitation.sender,   imageUrl: "../images/icons/message.png" });
});





