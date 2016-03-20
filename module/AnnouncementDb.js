/*
 * created by Jin Gu on 02/25/16
 */

 var sqlite3 = require('sqlite3').verbose();

function annoucementDb() {
    this.db = new sqlite3.Database('./fse.db');    
};

annoucementDb.prototype.annoucementAdd = function (username, annoucement, time, callback) {
    
    var dbtemp = this.db;
    dbtemp.serialize(function () {
        dbtemp.run("CREATE TABLE IF NOT EXISTS annoucements (annoucementId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT)");
        var insertAnnoucemment = dbtemp.prepare("insert into annoucements Values(?, ?,?,?)");
        insertAnnoucemment.run(null, username, time, annoucement);
        callback(200);
        return;
    });
};

annoucementDb.prototype.getAnnoucement = function (callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function() {
        dbTemp.all("SELECT * FROM annoucements", function(err, rows) {

            //console.log("rows : " + rows);

            callback(rows);
        })
    });
};

//new added funciton to select announcements by key
annoucementDb.prototype.getAnnoucementByKey = function (strArr,callback) {
    var dbTemp = this.db;

    var q = "SELECT * FROM annoucements WHERE content Like \'%" + strArr.join('%\' and content Like \'%') + '%\'';

    dbTemp.serialize(function() {
        dbTemp.all(q, function(err, rows) {


            callback(rows);
        })
    });
};

module.exports = annoucementDb;
