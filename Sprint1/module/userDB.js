/**
 * Created by guangyu on 2/15/16.
 */
//
var sqlite3 = require('sqlite3').verbose();

function UserDb() {
    this.db = new sqlite3.Database('./fse.db');
    // TODO add status table
};

UserDb.prototype.userAdd = function (username, password, status, callback) {
    var dbTemp = this.db;
    dbTemp.run("CREATE TABLE IF NOT EXISTS users (userName TEXT PRIMARY KEY, password TEXT, joinTime TEXT , status TEXT)", function () {
        dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {
            if (row.length != 0) {
                callback(400);
                return;
            }
            var insertUser = dbTemp.prepare("insert into users Values(?,?,?,?)");
            var time = new Date().toLocaleString();
            insertUser.run(username, password, time, status);
            callback(200); // TODO bug
            return;
        });
    });

};

UserDb.prototype.messageAdd = function (username, message, time, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.run("CREATE TABLE IF NOT EXISTS messages (userName TEXT, time TEXT, content TEXT)");
        var insertMessage = dbTemp.prepare("insert into messages Values(?,?,?)");
        insertMessage.run(username, time, message);
        //insertMessage.finalize();
        callback(200);
        return;
    });
};

UserDb.prototype.userAuth = function (username, password, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all("select password from users where userName=\"" + username + "\"", function (err, row) {
            if (row == null || row.length == 0) {
                callback(401);
                return;
            } else if (row[0].password != password) {
                callback(403);
                return;
            } else {
                callback(200);
                return;
            }
        });
    });
};

UserDb.prototype.getHistory = function (callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function() {
        dbTemp.all("SELECT * FROM messages", function(err, rows) {
            callback(rows);
        })
    });
};

UserDb.prototype.getOfflineUsers = function (onlineUsers,callback) {
    var q = 'SELECT userName FROM users WHERE userName NOT IN (\'' + onlineUsers.join('\',\'') + '\')';
    //var q = 'SELECT userName FROM users ';
    var dbTemp = this.db;
    dbTemp.serialize(function() {
        dbTemp.all(q, function(err, rows) {
            callback(rows);
        })
    });
};


module.exports = UserDb;