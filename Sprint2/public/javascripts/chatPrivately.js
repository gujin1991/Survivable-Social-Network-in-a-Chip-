/**
 * Created by Pan on 2/25/16.
 */
var onlineUserList = {};
var offlineUserList = {};
var currentUser = {};
var chatTarget;
$("#userlist-dropdown-menu").click(function(event) {
    getUserList();


});

function getUserList() {
    $.get("/userList", function(response) {
        onlineUserList = response.online;
        offlineUserList = response.offline;
        currentUser = response.currentUser;
    });
    for(var i = 0; i < onlineUserList.length; i++) {
        setDropdownUserlistClick(currentUser[0].userName, onlineUserList[i].userName,true);
    }
    for(var i = 0; i < offlineUserList.length; i++) {
        setDropdownUserlistClick(currentUser[0].userName, offlineUserList[i].userName,false);
    }
}

function setDropdownUserlistClick(currentUser, username, isOnline) {
    if(isOnline) {
        if (currentUser == username) {
            var $htmlDiv = $('<li><a class="disabled" href="" id="chat-userList"><span class="glyphicon glyphicon-user"></span> '+ username + '</a></li>');

        } else {
            var $htmlDiv = $('<li><a href="" id="chat-userList"><span class="glyphicon glyphicon-ok"></span> '+ username + '</a></li>');
        }
    } else {
        var $htmlDiv = $('<li><a href="" id="chat-userList"><span class="glyphicon glyphicon-remove"></span> '+ username + '</a></li>');
    }

    $("userlist-dropdown-append").append($htmlDiv);
    $htmlDiv.children('#chat-userlist').click(function (event) {
        event.preventDefault();
        chatTarget = $(this).text();
        console.log(chatTarget);
    });
}
//function sortByName(dict) {
//    var loweCaseSort = function(a, b) {
//        return a.toLowerCase().localeCompare(b.toLowerCase())
//    };
//    var sorted = [];
//    for(var key in dict) {
//        sorted[sorted.length] = key.userName;
//    }
//    sorted.sort(loweCaseSort);
//
//    var tempDict = {};
//    for(var i = 0; i < sorted.length; i++) {
//        tempDict[sorted[i]] = dict[sorted[i]];
//    }
//
//    return tempDict;
//}