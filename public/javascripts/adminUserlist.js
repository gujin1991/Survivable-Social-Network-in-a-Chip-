/**
 * Created by Pan on 4/15/16.
 */
var socket = io.connect();

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});



socket.on('updatelist', function(response){

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    var onlineSize = Object.size(response.online);
    var offlineSize = Object.size(response.offline);

    sortByName(response.online, function(onlineUserList){
        setOnlineTable(onlineUserList, onlineSize);
    });
    sortByName(response.offline, function(offlineUserList) {
        setOfflineTable(offlineUserList, offlineSize);
    });
});

/**
 * Add all online users to online table
 * */
function setOnlineTable(online_users, size) {
    var online_list = $(".online-list");
    online_list.html("");
    var online_table = '<table class="table table-hover">' +
        '<thead><tr><th width="50%">Online Users</th></tr></thead>' +
        '<tbody>';
    for(var i=0; i<size; i++) {
        var imgName;
        var status;
        if (online_users[i].status == 'OK') {
            imgName = "ok.png";
            status = "OK";
        } else if (online_users[i].status == 'Help') {
            imgName = "help.png";
            status = "Help";
        } else if (online_users[i].status == 'Emergency') {
            imgName = "emergency.png";
            status = "Emergency";
        } else {
            imgName = "undefined.png";
            status = "Undefined";
        }

        var new_line = '<tr>'+
            '<td width="50%">' + '<img alt="Online" height="20px" width="20px" style="margin-right:5px;" src="../images/icons/online.png">' +
            '<span><a href="/seeProfile/'+online_users[i].userName +'">' + online_users[i].userName + '</a>' + " (" + online_users[i].accountStatus + ") "+ '</span>' + '</td>' +
            '<td width="50%" class="text-left">' + '<img alt="Online" height="20px" width="20px" style="margin-right:5px;" src="../images/icons/' + imgName + '">' +
            '<span>' + status + '</span>' + '</td>' +
            '<td width="50%" class="text-left"><span>' + online_users[i].privilege + '</span>' + '</td>' +
            '</tr>';
        online_table += new_line;
    }
    online_table += '</tbody></table>';
    var one = $(online_table);
    online_list.append(one);
}

/**
 * Add all offline users to offline table
 * */
function setOfflineTable(offline_users, size) {
    var offline_list = $(".offline-list");
    offline_list.html("");
    var offline_table = '<table class="table table-hover">' +
        '<thead><tr><th width="50%">Offline Users</th></tr></thead>' +
        '<tbody>';
    for(var i=0; i<size; i++) {
        var imgName;
        var status;

        if (offline_users[i].status == 'OK') {
            imgName = "ok.png";
            status = "OK";
        } else if (offline_users[i].status == 'Help') {
            imgName = "help.png";
            status = "Help";
        } else if (offline_users[i].status == 'Emergency') {
            imgName = "emergency.png";
            status = "Emergency";
        } else {
            imgName = "undefined.png";
            status = "Undefined";
        }

        var new_line = '<tr>' +
            '<td width="50%">' + '<img alt="Online" height="20px" width="20px" style="margin-right:5px;" src="../images/icons/offline.png">' +
            '<span><a href="/seeProfile/'+ offline_users[i].userName +'">' + offline_users[i].userName + '</a>' + " (" + offline_users[i].accountStatus + ") "+ '</span>' + '</td>' +
            '<td  width="50%" class="text-left">' + '<img alt="Online" height="20px" width="20px" style="margin-right:5px;" src="../images/icons/' + imgName + '">' +
            '<span>' + status + '</span>' + '</td>' +
            '<td width="50%" class="text-left"><span>' + offline_users[i].privilege + '</span>' + '</td>' +
            '</tr>';
        offline_table += new_line;
    }
    var one = $(offline_table);
    offline_list.append(one);
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

socket.on('send private message', function(message){
    swal({   title: "Notification!",   text: "You have a new message from " + message.sender,   imageUrl: "../images/icons/message.png" });
});

/**
 * Update the online&offline user list.
 * */
function updateUserList(onlineUserList, offlineUserList) {
    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    var onlineSize = Object.size(onlineUserList);
    var offlineSize = Object.size(offlineUserList);
    if (onlineSize == 0 && offlineSize == 0) {
        swal({title: "User not found!",text: "No matches.", type: "error", confirmButtonText: "OK" });
        return;
    }
    sortByName(onlineUserList, function(onlineUserList){
        setOnlineTable(onlineUserList, onlineSize);
    });
    sortByName(offlineUserList, function(offlineUserList) {
        setOfflineTable(offlineUserList, offlineSize);
    });
}

$("#search-status").change(function(event){
    var status = $(this).val();
    if (status == 'All') {
        $.get('/userList', function(req,res){
            if (res.statusCode === 410) {
                swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
            } else {
                updateUserList(res.online, res.offline);
            }
        });
    } else {
        var keyword = {"keyword": status};
        $.post('/searchStatus', keyword, function(response) {
            if (response.statusCode === 410) {
                swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
            } else {
                updateUserList(response.online, response.offline);
            }
        });
    }
});

$("#search-username").on("keydown", function(event) {
    if (event.which === 13) {
        event.preventDefault();
    }
});

$("#search-username").on("keyup", function(event) {
    var username = $(this).val();
    var keyword = {"keyword": username};
    $.post('/searchUser', keyword, function(response) {
        if (response.statusCode === 410) {
            swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
        } else {
            updateUserList(response.online, response.offline);
        }
    });
});

$("#search-username-cancel").click(function(event) {
    $.get('/userList', function(req,res){
        if (response.statusCode === 410) {
            swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
        } else {
            updateUserList(res.online, res.offline);
        }
    });
    $("#search-username").val("");
});

socket.on('Log out',function() {
    swal({
        title: "Oops...",
        text: "Your session has expired. Please log in again!",
        type: "warning",
        showCancelButton: false,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "OK!",
        closeOnConfirm: false
    }, function(){
        window.location = "/logout";
    });
});