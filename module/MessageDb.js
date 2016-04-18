/**
 * Created by guangyu on 2/21/16.
 */
var sqlite3 = require('sqlite3').verbose();
var AccountStatus = require('./AccountStatus');
function MessageDb() {
    this.db = new sqlite3.Database('./fse.db');
}
MessageDb.prototype.messageAdd = function (username, message, time, status, nickName,callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.run("CREATE TABLE IF NOT EXISTS messages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT , nickName TEXT)");
        var insertMessage = dbTemp.prepare("insert into messages Values(?, ?, ?, ?, ?,?)");
        insertMessage.run(null, username, time, message, status, nickName);
        callback(200);
    });
};

MessageDb.prototype.getHistory = function (callback) {
    var dbTemp = this.db;
    var q = "SELECT * FROM messages m Inner JOIN users u on m.userName = u.userName where u.accountStatus = \'" + new AccountStatus().active + '\';';
    dbTemp.serialize(function () {
        dbTemp.all(q, function (err, rows) {
            callback(rows);
        })
    });
};

MessageDb.prototype.privateMessageAdd = function (fromUser, toUser, message, time, status,senderNickname,receiverNickname,callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.run("CREATE TABLE IF NOT EXISTS privateMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, fromUser TEXT, toUser TEXT, time TEXT, content TEXT, status TEXT," +
            "senderNickname TEXT, receiverNickname TEXT)");

        dbTemp.all("SELECT * FROM users where userName = \'" + toUser +"\';" , function(err,row){
            //console.log("row");
            //console.log(row);
            //console.log(toUser);
            if (err || row == null || row.length == 0) {
                callback(400, null);
            }else{
                var insertMessage = dbTemp.prepare("insert into privateMessages Values(?, ?, ?, ?, ?, ?,?,?)");
                insertMessage.run(null, fromUser, toUser, time, message, status,senderNickname,receiverNickname);
                callback(200);
            }
        });
    });
};

MessageDb.prototype.getPrivateHistory = function (fromUser, toUser, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all('SELECT * FROM privateMessages WHERE (fromUser=\'' + fromUser + '\' and toUser=\''
            + toUser + '\'' + ') OR (' + 'fromUser=\'' + toUser
            + '\' and toUser=\'' + fromUser + '\');', function (err, rows) {
            //console.log(rows);
            if (rows) {
                callback(rows);
            } else {
                callback(400);
            }
        });
    });
};

MessageDb.prototype.getHistoryByKey = function (keyword, callback) {
    var dbTemp = this.db;
    var q = "SELECT * FROM messages WHERE content Like \'%" + keyword.join('%\' and content Like \'%') + '%\'';

    dbTemp.serialize(function () {
        dbTemp.all(q, function (err, rows) {
            callback(rows);
        })
    });
};

MessageDb.prototype.getPrivateHistoryByKey = function (keyword, user, callback) {
    var dbTemp = this.db;
    var q = 'SELECT * FROM privateMessages WHERE (fromUser=\'' + user + '\''
        + ' OR ' + 'toUser=\'' + user + '\' ) and content Like \'%'
        + keyword.join('%\' and content Like \'%') + '%\'';
    
    dbTemp.serialize(function () {
        dbTemp.all(q, function (err, rows) {
            if (rows) {
                callback(rows);
            } else {
                callback(400);
            }
        });
    });
};

//new added for new use cases..

MessageDb.prototype.updatePublicUserName = function (oldUsername, username) {
    var dbTemp = this.db;
    var q = 'UPDATE messages SET userName = \'' + username + '\' WHERE userName = \'' + oldUsername + '\'';
    dbTemp.run(q, function () {
    });

};

MessageDb.prototype.updatePrivateUserName = function (oldUsername, username) {
    var dbTemp = this.db;
    var q = 'UPDATE privateMessages SET fromUser = \'' + username + '\' WHERE fromUser = \'' + oldUsername + '\'';
    dbTemp.run(q, function () {
    });
    var q = 'UPDATE privateMessages SET toUser = \'' + username + '\' WHERE toUser = \'' + oldUsername + '\'';
    dbTemp.run(q, function () {
    });

};



module.exports = MessageDb;