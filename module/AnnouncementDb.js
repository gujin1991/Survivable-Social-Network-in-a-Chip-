/*
 * created by Jin Gu on 02/25/16
 */

var sqlite3 = require('sqlite3').verbose();

function announcementDb() {
    this.db = new sqlite3.Database('./fse.db');    
}

announcementDb.prototype.announcementAdd = function (username, status, announcement, time, callback) {
    var dbtemp = this.db;
    dbtemp.serialize(function () {
        dbtemp.run("CREATE TABLE IF NOT EXISTS announcements (announcementId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, status TEXT, time TEXT, content TEXT)");
        var insertAnnouncement = dbtemp.prepare("insert into announcements Values(?,?,?,?,?)");
        insertAnnouncement.run(null, username, status, time, announcement);
        callback(200);
    });
};

announcementDb.prototype.getAnnouncement = function (callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function() {
        dbTemp.all("SELECT * FROM announcements", function(err, rows) {

            //console.log("rows : " + rows);

            callback(rows);
        })
    });
};

//new added funciton to select announcements by key
announcementDb.prototype.getAnnouncementByKey = function (strArr,callback) {
    var dbTemp = this.db;

    var q = "SELECT * FROM announcements WHERE content Like \'%" + strArr.join('%\' and content Like \'%') + '%\'';

    dbTemp.serialize(function() {
        dbTemp.all(q, function(err, rows) {


            callback(rows);
        })
    });
};

module.exports = announcementDb;
