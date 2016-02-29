/**
 * Created by Pan on 2/25/16.
 */
var onlineUsers = {};
var offlineUsers = {};
var chatTarget;
var socket = io.connect();
var $htmlDiv;
var content = $('.msg');
var username = $("#myname").val();

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});
socket.on('updatelist',function(response){
    $("#userlist-dropdown-append").empty();
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };
    //$('#post-btn').click(function() {
    //    //event.preventDefault();
    //    swal({title: "Error!",text: "Please select a user!", type: "error", confirmButtonText: "OK" });
    //});
// Get the size of an object
    var onlineSize = Object.size(response.online);
    var offlineSize = Object.size(response.offline);
    //var username = response.currentUser.userName;
    sortByName(response.online, function(onlineUserList){
        onlineUsers = onlineUserList;
        for(var i = 0; i < onlineSize; i++) {
            setDropdownUserlistClick(username, onlineUserList[i].userName,true);
        }
    });
    sortByName(response.offline, function(offlineUserList) {
        offlineUsers = offlineUserList;
        for(var i = 0; i < offlineSize; i++) {
            setDropdownUserlistClick(username, offlineUserList[i].userName,false);
        }
    });
});

function setDropdownUserlistClick(currentUser, username, isOnline) {
    $htmlDiv = $('<li class="disabled"><a href="" id="chat-userList"><img alt="OK" height="20px" width="20px" style="margin-right: 5px;" src="../images/icons/current.png">'+ currentUser + '</a></li>');
    if(isOnline) {
        if (username != currentUser) {
            $htmlDiv = $('<li><a href="" id="chat-userList"><img alt="OK" height="20px" width="20px" style="margin-right: 5px;" src="../images/icons/online.png">'+ username + '</a></li>');
        }
    } else {
        $htmlDiv = $('<li><a href="" id="chat-userList"><img alt="OK" height="20px" width="20px" style="margin-right: 5px;" src="../images/icons/offline.png">'+ username + '</a></li>');
    }
    $("#userlist-dropdown-append").append($htmlDiv);
    $htmlDiv.children('#chat-userList').click(function() {
        event.preventDefault();
        chatTarget = $(this).text();

        $('#private-head').empty().append('   ' + chatTarget);
        content.empty();

        //get history
        getPrivateMessage(currentUser, chatTarget);

    });
}

$('#post-btn').click(function() {
    //event.preventDefault();

    if ($('#private-head').text() == "") {
        swal({title: "Error!",text: "No user!", type: "error", confirmButtonText: "OK" });
        $('#focusedInput').val('');
    }

    else sendMessage(username,chatTarget);
});

function getPrivateMessage(senderName, receiverName) {
    var users = {"sender": senderName, "receiver":receiverName};
    $.post('/getPrivateMessage', users, function(messages){
        for(var i=0; i<messages.length; i++) {
            var message = messages[i];
            if (message.fromUser === username) {
                addMessage(message, message.content, "Me");
            } else if (message.toUser === username) {
                addMessage(message, message.content, message.fromUser);
            }
        }
        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
        var chat_body = $('#private-stream-list');
        var height = chat_body[0].scrollHeight;
        chat_body.scrollTop(height);
    });
}

function sendMessage(senderName, receiverName) {
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
            obj['receiver'] = receiverName;
            obj['text'] = inputValue;
            swal.close();
            $.post("/chatPrivately",obj,function(response){
                if (response.statusCode === 400) {
                    swal({title: "Error!",text: "Cannot get Messages!", type: "error", confirmButtonText: "OK" });
                }
            });
        });
    } else {
        obj['sender'] = senderName;
        obj['receiver'] = receiverName;
        obj['text']= text;

        $.post("/chatPrivately",obj,function(response){
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

// Display the new post message
socket.on('send private message', function(message){
    if (message.sender === username) {
        addMessage(message, message.text, "Me");
    } else {
        addMessage(message, message.text, message.sender);
    }
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    var chat_body = $('#private-stream-list');
    var height = chat_body[0].scrollHeight;
    chat_body.scrollTop(height);
});

function addMessage(message, text, username) {
    var label = '<div class="message">' +
        '<div class="messageHeader">' +
        '<span><span>' + username + '</span>' +
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