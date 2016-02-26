/**
 * Created by Pan on 2/25/16.
 */
var onlineUserList = {};
var offlineUserList = {};
var currentUser = {};
var chatTarget;
var socket = io.connect();
var username = $("#myname").val();
$("#userlist-dropdown").click(function(event) {
    console.log("here");


});
socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});
socket.on('updatelist',function(response){
    console.log("userList");
    console.log(response);

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
    sortByName(response.online, function(onlineUserList){
        console.log(onlineUserList);
        for(var i = 0; i < onlineSize; i++) {
            setDropdownUserlistClick(username, onlineUserList[i].userName,true);
        }
    });
    sortByName(response.offline, function(offlineUserList) {
        for(var i = 0; i < offlineSize; i++) {
            setDropdownUserlistClick(username, offlineUserList[i].userName,false);
        }
    });
});

function setDropdownUserlistClick(currentUser, username, isOnline) {
    console.log("!!!!!!!!!!!!!!!" + username);
    var $htmlDiv = $('<li class="disabled"><a href="" id="chat-userList"> '+ currentUser + '</a></li>');
    if(isOnline) {
        if (currentUser != username) {
            var $htmlDiv = $('<li><a href="" id="chat-userList"> '+ username + '</a></li>');
        }
    } else {
        var $htmlDiv = $('<li><a href="" id="chat-userList"> '+ username + '</a></li>');
    }

    $("#userlist-dropdown-append").append($htmlDiv);
    $htmlDiv.children('#chat-userlist').click(function (event) {
        event.preventDefault();
        chatTarget = $(this).text();
        console.log(chatTarget);
    });
}

function sortByName(dict, callback) {
    var loweCaseSort = function(a, b) {
        return a.userName.toLowerCase().localeCompare(b.userName.toLowerCase())
    };
    var sorted = [];
    console.log("sort");
    for(var i = 0; i < dict.length; i++) {
        sorted[sorted.length] = dict[i];
    }
    sorted.sort(loweCaseSort);

    var tempDict = {};
    for(var i = 0; i < 3; i++) {
        tempDict[i] = sorted[i];
    }
    callback(tempDict);
}
