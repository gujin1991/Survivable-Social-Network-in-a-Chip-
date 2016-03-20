/**
 * Created by guangyu on 2/21/16.
 */
var sqlite3 = require('sqlite3').verbose();

function MessageDb() {
    this.db = new sqlite3.Database('./fse.db');

    // TODO add status table
}
MessageDb.prototype.messageAdd = function (username, message, time, status, callback) {
    //TODO add user exist auth
    var dbtemp = this.db;
    dbtemp.serialize(function () {
        dbtemp.run("CREATE TABLE IF NOT EXISTS messages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT)");
        var insertMessage = dbtemp.prepare("insert into messages Values(?, ?,?,?, ?)");
        insertMessage.run(null, username, time, message, status);
        callback(200);
        return;
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
    //TODO add user exist auth
    var dbtemp = this.db;
    dbtemp.serialize(function () {
        dbtemp.run("CREATE TABLE IF NOT EXISTS privateMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, fromUser TEXT, toUser TEXT, time TEXT, content TEXT, status TEXT)");
        var insertMessage = dbtemp.prepare("insert into privateMessages Values(?, ?, ?, ?, ?, ?)");
        insertMessage.run(null, fromUser, toUser, time, message, status);
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

//new ADDED function to getPublic history by key
MessageDb.prototype.getHistoryByKey = function (keyword,callback) {
    var dbTemp = this.db;
    var q = "SELECT * FROM messages WHERE content Like \'%" + keyword.join('%\' and content Like \'%') + '%\'';

    dbTemp.serialize(function () {
        dbTemp.all(q, function (err, rows) {
            console.log(rows);
            callback(rows);

        })
    });
};

//new added funciton get private history by key
MessageDb.prototype.getPrivateHistoryByKey = function (keyword,user, callback) {
    var dbTemp = this.db;
    var q = 'SELECT * FROM privateMessages WHERE fromUser=\'' + user +  '\''
        + ' OR ' + 'toUser=\'' + user + '\' and content Like \'%'
        + keyword.join('%\' and content Like \'%') + '%\'';
    console.log("q ============" + q);
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