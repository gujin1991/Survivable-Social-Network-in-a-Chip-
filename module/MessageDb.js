/**
 * Created by guangyu on 2/21/16.
 */
var sqlite3 = require('sqlite3').verbose();

function MessageDb() {
    this.db = new sqlite3.Database('./fse.db');

    // TODO add status table
};

MessageDb.prototype.messageAdd = function (username, message, time, callback) {
    //TODO add user exist auth
    var dbtemp = this.db;
    dbtemp.serialize(function () {
        dbtemp.run("CREATE TABLE IF NOT EXISTS messages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT)");
        var insertMessage = dbtemp.prepare("insert into messages Values(?, ?,?,?)");
        insertMessage.run(null, username, time, message);
        callback(200);
        return;
    });
};

MessageDb.prototype.getHistory = function (callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function() {
        dbTemp.all("SELECT * FROM messages", function(err, rows) {
            callback(rows);
        })
    });
};

MessageDb.prototype.privateMessageAdd = function (fromUser, toUser, message, time, callback) {
    //TODO add user exist auth
    var dbtemp = this.db;
    dbtemp.serialize(function () {
        dbtemp.run("CREATE TABLE IF NOT EXISTS privateMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, fromUser TEXT, toUser TEXT, time TEXT, content TEXT)");
        var insertMessage = dbtemp.prepare("insert into privateMessages Values(?, ?, ?, ?, ?)");
        insertMessage.run(null, fromUser, toUser, time, message);
        callback(200);
        return;
    });
};

MessageDb.prototype.getPrivateHistory = function (fromUser, toUser, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all('SELECT * FROM privateMessages WHERE fromUser=\'' + fromUser + '\' and toUser=\'' + toUser + '\'' + ' OR ' + 'fromUser=\'' + toUser + '\' and toUser=\'' + fromUser + '\';', function (err, rows) {
            if (err) {
                callback(400);
            } else {
                callback(rows);
            }
        });
    });
};

module.exports = MessageDb;