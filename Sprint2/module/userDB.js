/**
 * Created by guangyu on 2/15/16.
 */
//
var sqlite3 = require('sqlite3').verbose();
var Status = require('./Status');

function UserDb() {
    this.db = new sqlite3.Database('./fse.db');
    // TODO add status table
};

UserDb.prototype.userAdd = function (username, password, callback) {
    var dbTemp = this.db;
    dbTemp.run("CREATE TABLE IF NOT EXISTS users (userName TEXT PRIMARY KEY, password TEXT, joinTime TEXT , status TEXT)", function () {
        dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {
            if (row.length != 0) {
                callback(400);
                return;
            }
            var insertUser = dbTemp.prepare("insert into users Values(?,?,?,?)");
            var time = new Date().toLocaleString();
            insertUser.run(username, password, time, new Status().undefine);
            callback(200); // TODO bug
            return;
        });
    });

};

UserDb.prototype.exist = function (username, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {
            if (row == null || row.length == 0) {
                callback(305);
                return;
            } else {
                callback(303);
                return;
            }
        });
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



UserDb.prototype.getOfflineUsers = function (onlineUsers,callback) {
    // I update this part from userName to *
    var q = 'SELECT userName,status FROM users WHERE userName NOT IN (\'' + onlineUsers.join('\',\'') + '\')';
    //var q = 'SELECT userName FROM users ';
    console.log(q);
    var dbTemp = this.db;
    dbTemp.serialize(function() {
        dbTemp.all(q, function(err, rows) {
            //console.log("rows123" + rows[0].userName);
            callback(rows);
        })
    });
};

UserDb.prototype.updateStatus = function(userName,status,callback){
    var q = 'UPDATE users SET status = \'' + status +'\' WHERE userName = \'' + userName +'\'';
    console.log(q);
    var dbTemp = this.db;
    dbTemp.run(q,function () {
        dbTemp.all('select status from users where userName = \'' + userName +'\'',function(err,row){
            console.log("ttt1---------------" + row[0].status);
            console.log("ttt2---------------" + row);
            if(row[0].status == status) callback(200);
            else callback(400);
        });
    });

}


module.exports = UserDb;