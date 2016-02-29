/**
 * Created by congshan on 2/25/16.
 */
var socket = io.connect();
//var mystatus = $("#mystatus").val();

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});

socket.on('updatelist', function(response){
    console.log("-----------------online : "+ response.online);
    console.log("-----------------offline : "+ response.offline);

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

        var new_line = '<tr>' +
            '<td width="50%">' + '<img alt="Online" height="20px" width="20px" style="margin-right:5px;" src="../images/icons/online.png">' +
            '<span>' + online_users[i].userName + '</span>' + '</td>' +
            '<td width="50%" class="text-left">' + '<img alt="Online" height="20px" width="20px" style="margin-right:5px;" src="../images/icons/' + imgName + '">' +
            '<span>' + status + '</span>' + '</td>' +
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
            '<span>' + offline_users[i].userName + '</span>' + '</td>' +
            '<td  width="50%" class="text-left">' + '<img alt="Online" height="20px" width="20px" style="margin-right:5px;" src="../images/icons/' + imgName + '">' +
            '<span>' + status + '</span>' + '</td>' +
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

