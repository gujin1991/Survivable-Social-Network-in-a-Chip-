/**
 * Created by guangyu on 2/21/16.
 */
var sqlite3 = require('sqlite3').verbose();

function MessageDb() {
    this.db = new sqlite3.Database('./fse.db');
}
MessageDb.prototype.messageAdd = function (username, message, time, status, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.run("CREATE TABLE IF NOT EXISTS messages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT)");
        var insertMessage = dbTemp.prepare("insert into messages Values(?, ?, ?, ?, ?)");
        insertMessage.run(null, username, time, message, status);
        callback(200);
    });
};

MessageDb.prototype.getHistory = function (callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all("SELECT * FROM messages", function (err, rows) {
            callback(rows);
        })
    });
};

MessageDb.prototype.privateMessageAdd = function (fromUser, toUser, message, time, status, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.run("CREATE TABLE IF NOT EXISTS privateMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, fromUser TEXT, toUser TEXT, time TEXT, content TEXT, status TEXT)");
        var insertMessage = dbTemp.prepare("insert into privateMessages Values(?, ?, ?, ?, ?, ?)");
        insertMessage.run(null, fromUser, toUser, time, message, status);
        callback(200);
    });
};

MessageDb.prototype.getPrivateHistory = function (fromUser, toUser, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all('SELECT * FROM privateMessages WHERE fromUser=\'' + fromUser + '\' and toUser=\''
            + toUser + '\'' + ' OR ' + 'fromUser=\'' + toUser
            + '\' and toUser=\'' + fromUser + '\';', function (err, rows) {
            if (err) {
                callback(400);
            } else {
                callback(rows);
            }
        });
    });
};


MessageDb.prototype.groupMessageAdd = function (sender, groupName, message, time, status, callback) {
    var dbtemp = this.db;
    dbtemp.serialize(function () {
        dbtemp.run("CREATE TABLE IF NOT EXISTS groupMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, sender TEXT, groupname TEXT, time TEXT, content TEXT, status TEXT)");
        var insertMessage = dbtemp.prepare("insert into groupMessages Values(?, ?, ?, ?, ?, ?)");
        insertMessage.run(null, sender, groupName, time, message, status);
        callback(200);
        return;
    });
};

MessageDb.prototype.getGroupHistory = function (groupName, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        //dbTemp.all("select * from users where userName=\"" + userName + "\"", function (err, row) {

        dbTemp.all("SELECT * FROM groupMessages where groupname = \"" + groupName + "\"", function (err, rows) {
            if (err) {
                callback(400);
            } else {
                callback(rows);
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
            if (err) {
                callback(400);
            } else {
                callback(rows);
            }
        });
    });
};

module.exports = MessageDb;