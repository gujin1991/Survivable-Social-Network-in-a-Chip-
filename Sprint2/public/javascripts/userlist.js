/**
 * Created by congshan on 2/25/16.
 */
var socket = io.connect();
//updating the list of online and offline users
socket.on('updatelist',function(message){
    console.log("-----------------online : "+ message.online);
    console.log("-----------------offline : "+ message.offline);
    var online_list = $(".online-list");
    online_list.html("");
    var online_users = message.online;
    var online_table = '<table class="table table-hover">' +
                        '<thead><tr><th>Online Users</th></tr></thead>' +
                        '<tbody>';
    for(var i=0; i<online_users.length; i++) {
        /*
         * TODO: add user status to the new table row
         *       <td><img ....></td>
         * */
        var new_line = '<tr>' +
                        '<td>' + online_users[i].userName + '</td>' +
                        '</tr>';
        online_table += new_line;
    }
    online_table += '</tbody></table>';
    var one = $(online_table);
    online_list.append(one);

    var offline_list = $(".offline-list");
    offline_list.html("");
    var offline_users = message.offline;
    var offline_table = '<table class="table table-hover">' +
        '<thead><tr><th>Offline Users</th></tr></thead>' +
        '<tbody>';
    for(var i=0; i<offline_users.length; i++) {
        /*
         * TODO: add user status to the new table row
         *       <td><img ....></td>
         * */
        var new_line = '<tr>' +
            '<td>' + offline_users[i].userName + '</td>' +
            '</tr>';
        offline_table += new_line;
    }
    var one = $(offline_table);
    online_list.append(one);
});
socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});
