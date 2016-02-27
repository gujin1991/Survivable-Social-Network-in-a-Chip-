/**
 * Created by Pan on 2/25/16.
 */
var onlineUserList = {};
var offlineUserList = {};
var currentUser = {};
var chatTarget;
var socket = io.connect();
var $htmlDiv;
var content = $('.msg');

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});
socket.on('updatelist',function(response){


    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

// Get the size of an object
    var onlineSize = Object.size(response.online);
    var offlineSize = Object.size(response.offline);
    console.log("offline list");
    console.log(response.offline);
    //var username = response.currentUser.userName;
    var username = $("#myname").val();
    sortByName(response.online, function(onlineUserList){
        for(var i = 0; i < onlineSize; i++) {
            setDropdownUserlistClick(username, onlineUserList[i].userName,true);
        }
    });
    sortByName(response.offline, function(offlineUserList) {
        for(var i = 0; i < offlineSize; i++) {
            console.log(i);
            console.log("wayayayayaya" + offlineUserList[i].userName);
            setDropdownUserlistClick(username, offlineUserList[i].userName,false);
        }
    });
});

function setDropdownUserlistClick(currentUser, username, isOnline) {
    $htmlDiv = $('<li class="disabled"><a href="" id="chat-userList"> '+ currentUser + '</a></li>');
    if(isOnline) {
        if (currentUser != username) {
            $htmlDiv = $('<li><a href="" id="chat-userList"> '+ username + '</a></li>');
        }
    } else {
        $htmlDiv = $('<li><a href="" id="chat-userList"> '+ username + '</a></li>');
    }
    $("#userlist-dropdown-append").append($htmlDiv);
    $htmlDiv.children('#chat-userList').click(function() {
        event.preventDefault();
        chatTarget = $(this).text();
        $('#private-head').empty().append('   ' + chatTarget);
        content.empty();

        alert("senderName " + currentUser + " receiverName " + chatTarget);
        getPrivateMessage(currentUser, chatTarget)

        $('#post-btn').click(function(event) {
            event.preventDefault();
            sendMessage(currentUser,chatTarget);
        });
    });
}
function getPrivateMessage(senderName, receiverName) {
    alert("senderName " + senderName + " receiverName " + receiverName);
    var users = {"sender": senderName, "receiver":receiverName};
    $.post('/getPrivateMessage', users, function(messages){
        //Todo: how to display the message received and sent???
        for(var i=0; i<messages.length; i++) {
            var message = messages[i];
            var label = '<div style="color:gray" class="message">' +
                '<div class="messageHeader">' +
                '<span>' +
                '<span>' + message.sender +
                '</span>' +
                '<img alt="OK" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/ok.png">' +
                '<div class="timestamp pull-right">' +
                '<i class="fa fa-clock-o fa-1"></i>' +
                '<small style="margin-left: 5px;">' + message.time + '</small>' +
                '</div>' +
                '</span>' +
                '</div>' +
                '<div class="messageBody">' +
                '<strong>'+ message.content +' </strong> '+
                '</div>' +
                '</div>';
            var one = $(label);
            content.append(one);
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
            console.log("client : "+ senderName + "send to " + receiverName + " a message "+  text);
            swal.close()
            //socket.emit('send message',obj);
            $.post("/chatPrivately",obj,function(){

            });
        });
    } else {
        obj['sender'] = senderName;
        obj['receiver'] = receiverName;
        obj['text'] = text;
        console.log("client : "+ senderName + "send to " + receiverName + " a message "+  text);

        //socket.emit('send message',obj);
        //call api
        $.post("/chatPrivately",obj,function(){

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
    //var label = '<div><span><span style="font-style: italic;">' + message.username + '</span> says: <strong>'+ message.text +' </strong> <small class="pull-right">' + now() + '</small></span></div><br/>';
    var label = '<div style="color:black" class="message">' +
        '<div class="messageHeader">' +
            '<span><span>Sender' + message.sender + '</span>' +
                '<img alt="OK" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/ok.png">' +
                '<div class="timestamp pull-right">' +
                    '<i class="fa fa-clock-o fa-1"></i>' +
                    '<small style="margin-left: 5px;">' + now() + '</small>' +
                '</div>' +
            '</span>' +
        '</div>' +
        '<div class="messageBody"><strong>'+ message.text +' </strong></div></div>';
    var one = $(label);
    content.append(one);
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    var chat_body = $('#stream-list');
    var height = chat_body[0].scrollHeight;
    chat_body.scrollTop(height);
});