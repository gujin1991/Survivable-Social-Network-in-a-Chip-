/**
 * Created by jiyushi1 on 4/9/16.
 */
var sqlite3 = require('sqlite3').verbose();
var Status = require('./Status');
var User = require('./User.js');

var Privilege = require('./Privilege.js');
var AccountStatus = require('./AccountStatus.js');

function UserDb() {
    var db = new sqlite3.Database('./testJiyu.db');
    return db;
}


var db = new UserDb();

function userAdd(username, password,db) {
    var dbTemp = db;
    var q =  "CREATE TABLE IF NOT EXISTS users (userName TEXT PRIMARY KEY, password TEXT, joinTime TEXT , status TEXT, privilege TEXT, accountStatus TEXT)";

        dbTemp.run(q , function () {
        dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {
            if (row.length != 0) {
                //callback(400, null);
                return;
            }
            var insertUser = dbTemp.prepare("insert into users Values(?,?,?,?,?,?)");
            var time = new Date().toLocaleString();
            insertUser.run(username, password, time, new Status().undefine ,new Privilege().citizen,new AccountStatus().active);

            dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {
                if (err || row == null || row.length == 0) {
                    //callback(305, null);
                } else {
                    var u = {};
                    console.log(row);
                    u.userName = row[0].userName;
                    u.status = row[0].status;
                    //callback(null, u);
                }
            });

        });
    });

    //dbTemp.serialize(function () {
    //
    //    dbTemp.run("delete from users");
    //
    //});

};

function updateProfile(oldUsername, username, password, privilege, accountStatus,db) {
    var dbTemp = db;

    dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {

        if ( row != null && row.length != 0) {
            //callback(401, null);
            console.log( "hahaha");
            return;
        }else{
            var q = 'UPDATE users SET userName = \'' + username +'\',password = \'' + password
                + '\',privilege = \'' + privilege + '\',accountStatus = \'' + accountStatus
                + '\' WHERE userName = \'' + oldUsername + '\'';
            console.log(q);

            dbTemp.run(q, function () {
                dbTemp.all("select * from users where userName=\"" + username + "\"", function (err, row) {
                    if (row.length > 0 && row[0].password == password && row[0].privilege == privilege
                        &&  row[0].accountStatus == accountStatus ){
                         console.log(row);
                    }else {
                        console.log(err);
                    }

                });
            });
        }
    });


};

//userAdd("jiyuT","1234",db);
//userAdd("jiyuTest","1234",db);
//updateProfile("jiyuT","jiyuHahahahahaha1","12345","Administrator","inactive",db);

var user = {};
user['abc'] = 'abc';

if(user['aaa'] == null) console.log("heiheihie");
if(user['abc'] != null) console.log("heiheihie");

var q = "SELECT * FROM messages m Inner JOIN users u on m.userName = u.userName where u.accountStatus = \'" + new AccountStatus().active + '\';';
console.log(q);

var onlineUsers = [];
onlineUsers.push('jiyu');
onlineUsers.push('pan');
q = 'SELECT userName,status FROM users WHERE userName NOT IN (\'' + onlineUsers.join('\',\'') + '\')' + 'and accountStatus = \''
    + new AccountStatus().active+"\';";

console.log(q);