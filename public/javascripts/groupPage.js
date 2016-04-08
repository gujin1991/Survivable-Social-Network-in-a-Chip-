/**
 * Created by Jin Gu on 4/1/16.
 */
var onlineUsers = {};
var chatTarget;
var socket = io.connect();
var $htmlDiv;
var content = $('#msgPrivate');
var username = $("#myname").val();
var hostname = $("#hostname").val();
var invitation = {};
var end = 0;

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
    console.log(hostname + "hostname");
    getPreviousMessage(hostname);

});

socket.on('updatelist',function(response){
    $("#userlist-dropdown-append").empty();
    end = 0;
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

// Get the size of an object
    var onlineSize = Object.size(response.online);
    sortByName(response.online, function(onlineUserList){
        onlineUsers = onlineUserList;
        for(var i = 0; i < onlineSize; i++) {
            setDropdownUserlistClick(username, onlineUserList[i].userName,true);
        }
    });

});



$('#post-btn').click(function() {
    if(end == 1) {
        window.location.href = "/";
    } else {
        sendMessage(username, hostname);
    }
});


$('#end-btn').click(function() {
    console.log(hostname + 'hostname');
    if(hostname == username) {
        console.log(hostname + 'inhost');
        var users = {"groupName": hostname};
        $.post('/endGroupChat', users, function(res) {
                //groupUsers = [];
            if(res.statusCode == 200)
                window.location.href = "/";
            else
            swal({title: "Sorry!",text: "You can not end the session for some reason!", type: "warning", confirmButtonText: "OK" });


        });
    } else {
        window.location.href = "/";
        //swal({title: "Sorry!",text: "You can not end the session because you are not the host!", type: "warning", confirmButtonText: "OK" });
    }
});

socket.on('groupChatEnd', function(HostName) {
    if(HostName != username) {

        end = 1;
        swal({title: "Opps!", text: "The session has been ended by the host.", type: "warning", confirmButtonText: "OK"});


    }

} )

$('#focusedInput').on("keydown", function(e){
    if(e.which === 13){
        $('#post-btn').click();
        return false;
    }
});





// Display the new post message
socket.on('send group message', function(message){
    if(message.group == hostname) {
        console.log('message' + message);
        if (message.sender === username) {
            addPrivateMessage(message, message.text, "Me");
        } else {
            addPrivateMessage(message, message.text, message.sender);
        }
        $("html, body").animate({scrollTop: $(document).height()}, 1000);
        var chat_body = $('#private-stream-list');
        var height = chat_body[0].scrollHeight;
        chat_body.scrollTop(height);
    }


});


function getPreviousMessage(groupName) {
    var users = {"groupName": groupName};
    $.get('/getGroupMessage', users, function(messages){
        for(var i=0; i<messages.length; i++) {
            var message = messages[i];
            //console.log(username);
            //console.log(message.fromUser);
            if (message.sender === username) {
                addPrivateMessage(message, message.content, "Me");
            } else {
                addPrivateMessage(message, message.content, message.sender);
            }
        }
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        var chat_body = $('#private-stream-list');
        var height = chat_body[0].scrollHeight;
        chat_body.scrollTop(height);
    });
}

function sendMessage(senderName, groupName) {
    console.log("sendmessage");
    var text = $('#focusedInput').val();
    var obj = {};
    if(text ==="") {
        swal({
            title: "Empty input!",
            text: "You need to write something!",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Write something"
        }, function(inputValue){
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("You need to write something!");
                return false
            }
            obj['sender'] = senderName;
            obj['group'] = groupName;
            obj['text'] = inputValue;
            swal.close();
            $.post("/groupChat",obj,function(response){
                if (response.statusCode === 400) {
                    swal({title: "Error!",text: "Cannot get Messages!", type: "error", confirmButtonText: "OK" });
                }
            });
        });
    } else {
        obj['sender'] = senderName;
        obj['group'] = groupName;
        obj['text']= text;

        $.post("/groupChat",obj,function(response){
            if (response.statusCode === 400) {
                swal({title: "Error!",text: "Cannot get Messages!", type: "error", confirmButtonText: "OK" });
            }
        });
        $('#focusedInput').val('');
        $('#focusedInput').focus();
    }
    return false;
}

function sortByName(dict, callback) {
    var loweCaseSort = function(a, b) {
        return a.userName.toLowerCase().localeCompare(b.userName.toLowerCase())
    };
    var sorted = [];
    for(var i = 0; i < dict.length; i++) {
        sorted[sorted.length] = dict[i];
    }
    sorted.sort(loweCaseSort);

    var tempDict = {};
    for(var i = 0; i < dict.length; i++) {
        tempDict[i] = sorted[i];

    }
    callback(tempDict);
}


function addPrivateMessage(message, text, name) {

    var status = message.status;
    //console.log("*****************\n" + status);
    var logoName;
    if (status == 'OK') {
        logoName = "ok.png";
    } else if (status == 'Help') {
        logoName = "help.png";
    } else if (status == 'Emergency') {
        logoName = "emergency.png";
    } else if (status == 'Undefined') {
        logoName = "undefined.png";
    }

    var label = '<div class="message">' +
        '<div class="messageHeader">' +
        '<span><span>' + name + '</span>' +
        '<img alt="' + status + '" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/' + logoName + '">' +
        '<div class="timestamp pull-right">' +
        '<i class="fa fa-clock-o fa-1"></i>' +
        '<small style="margin-left: 5px;">' + message.time + '</small>' +
        '</div>' +
        '</span>' +
        '</div>' +
        '<div class="messageBody"><strong>'+ text +' </strong></div></div>';
    var one = $(label);
    content.append(one);
}

function setDropdownUserlistClick(currentUser, username, isOnline) {
    $htmlDiv = $('<li class="disabled"><a href="" id="chat-userList"><img alt="OK" height="20px" width="20px" style="margin-right: 5px;" src="../images/icons/current.png">'+ currentUser + '</a></li>');
    if(isOnline) {
        if (username != currentUser) {
            $htmlDiv = $('<li><a href="" id="chat-userList"><img alt="OK" height="20px" width="20px" style="margin-right: 5px;" src="../images/icons/online.png">'+ username + '</a></li>');
        }
    }
    $("#userlist-dropdown-append").append($htmlDiv);
    console.log('send invitation');
    $htmlDiv.children('#chat-userList').click(function() {
        console.log('send invitation2');
        //event.preventDefault();
        chatTarget = $(this).text();
        invitation = {'sender': currentUser, 'receiver':chatTarget, 'groupName':hostname};
        $.post('/sendGroupInvitation', invitation, function(res) {
            if(res.statusCode != 200) {
                swal({title: "Error",text: "Sending Invitation Failed", type: "error", confirmButtonText: "OK" });
            }
        });
        //socket.emit('send group invitation', invitation);
        if(chatTarget == currentUser){
            chatTarget = null;
            $('#private-head').empty();
            swal({title: "Sorry",text: "You can not talk to yourself...At least in our app you can't...", type: "error", confirmButtonText: "OK" });
        }

    });
}


