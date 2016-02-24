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
    console.log("test message db",username,message,time);
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

            console.log("rows : " + rows);

            callback(rows);
        })
    });
};

module.exports = MessageDb;