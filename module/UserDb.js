/**
 * Created by guangyu on 2/15/16.
 */
//
var sqlite3 = require('sqlite3').verbose();
var Status = require('./Status');
var User = require('./User.js');

function UserDb() {
    this.db = new sqlite3.Database('./fse.db');
    // TODO add status table
};

UserDb.prototype.userAdd = function (username, password, callback) {
    var dbTemp = this.db;
    dbTemp.run("CREATE TABLE IF NOT EXISTS users (userName TEXT PRIMARY KEY, password TEXT, joinTime TEXT , status TEXT)", function () {
        dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {
            if (row.length != 0) {
                callback(400, null);
                return;
            }
            var insertUser = dbTemp.prepare("insert into users Values(?,?,?,?)");
            var time = new Date().toLocaleString();
            insertUser.run(username, password, time, new Status().undefine);

            dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {
                if (err || row == null || row.length == 0) {
                    callback(305, null);
                } else {
                    //console.log(row[0].status);
                    var u ={};
                    u.userName = row[0].userName;
                    u.status = row[0].status;
                    callback(null,u);

                }
            });

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
                callback(401, null);
                return;
            } else if (row[0].password != password) {
                callback(403, null);
                return;
            } else {
                dbTemp.serialize(function () {
                    dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {
                        if (err || row == null || row.length == 0) {
                            callback(305, null);
                            return;
                        } else {
                            console.log(row[0].status);
                            var u ={};
                            u.userName = row[0].userName;
                            u.status = row[0].status;
                            callback(null,u);
                            return;
                        }
                    });
                });
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

        dbTemp.all(q, function(err, rows) {
            //console.log(rows);
            callback(rows);
        })

};

UserDb.prototype.updateStatus = function(userName,status,callback){
    var q = 'UPDATE users SET status = \'' + status +'\' WHERE userName = \'' + userName +'\'';
    //console.log(q);
    var dbTemp = this.db;
    dbTemp.run(q,function () {
        dbTemp.all('select status from users where userName = \'' + userName +'\'',function(err,row){
            //console.log("ttt1---------------" + row[0].status);
            //console.log("ttt2---------------" + row);
            if(row[0].status == status) callback(200);
            else callback(400);
        });
    });
};

UserDb.prototype.getUserInfo = function(userName, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all("select * from users where userName=\"" + userName + "\"", function (err, row) {
            if (err || row == null || row.length == 0) {
                callback(305, null);
                return;
            } else {
                //console.log(row[0].status);
                var u ={};
                u.userName = row[0].userName;
                u.status = row[0].status;
                callback(null,u);
                return;
            }
        });
    });
};


module.exports = UserDb;