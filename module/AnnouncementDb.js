/*
 * created by Jin Gu on 02/25/16
 */

var sqlite3 = require('sqlite3').verbose();

function announcementDb() {
    this.db = new sqlite3.Database('./fse.db');
}

announcementDb.prototype.announcementAdd = function (username, status, announcement, time, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.run("CREATE TABLE IF NOT EXISTS announcements (announcementId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, status TEXT, time TEXT, content TEXT)");
        var insertAnnouncement = dbTemp.prepare("insert into announcements Values(?, ?, ?, ?, ?)");
        insertAnnouncement.run(null, username, status, time, announcement);
        callback(200);
    });
};

announcementDb.prototype.getAnnouncement = function (callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all("SELECT * FROM announcements", function (err, rows) {
            callback(rows);
        })
    });
};

announcementDb.prototype.getAnnouncementByKey = function (strArr, callback) {
    var dbTemp = this.db;

    var q = "SELECT * FROM announcements WHERE content Like \'%" + strArr.join('%\' and content Like \'%') + '%\'';

    dbTemp.serialize(function () {
        dbTemp.all(q, function (err, rows) {
            callback(rows);
        })
    });
};

announcementDb.prototype.searchAnnounceByDate = function (startDate, endDate, callback) {
    var dbTemp = this.db;
    var q = "SELECT * FROM announcements WHERE time >= '" + startDate + "' and time <= '" + endDate +"'";
    dbTemp.serialize(function () {
        dbTemp.all(q, function (err, row) {
            if (err) {
                callback(400);
            } else {
                callback(row.length);
            }
        })
    });
};
announcementDb.prototype.deleteAnnounceByDate = function (startDate, endDate, callback) {
    var dbTemp = this.db;
    var q = "DELETE FROM announcements WHERE time >= '" + startDate + "' and time <= '" + endDate +"'";
    var q2 = "SELECT * FROM announcements WHERE time >= '" + startDate + "' and time <= '" + endDate +"'";
    dbTemp.run(q, function(err) {
    });
    dbTemp.run(q2, function (err, row) {
        if (!err || row == null || row.length == 0) {
            callback(200, null);
        } else {
            callback(400, null);
        }
    });
};

module.exports = announcementDb;
