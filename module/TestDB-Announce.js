var sqlite3 = require('sqlite3').verbose();

function UserDb() {
    var db = new sqlite3.Database('./testPanLi2.db');
    return db;
}


var idArray =  [];
function search(startDate, endDate,  db) {
    var dbTemp = db;
    var q = "CREATE TABLE IF NOT EXISTS testannouncements (announcementId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, status TEXT, time TEXT, content TEXT)";
    var q1 = "SELECT * FROM testannouncements WHERE time >= '" + startDate + "' and time <= '" + endDate +"'";
    var q2 = "SELECT * FROM testannouncements";
    console.log(q1);
    dbTemp.run(q , function () {
        dbTemp.all(q1, function (err, row) {
            if (row.length == 0) {
                //callback(400, null);
                console.log("meiyou");
                return;
            } else {
                //for (var i = 0; i < row.length; i++) {
                //    idArray.push(row[i].announcementId);
                //}
                console.log(row.length);
                console.log(row);
            }
        });
    });
};

function deleteByDate(startDate, endDate,  db) {
    var dbTemp = db;
    var q = "CREATE TABLE IF NOT EXISTS testannouncements (announcementId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, status TEXT, time TEXT, content TEXT)";
    var q1 = "DELETE FROM testannouncements WHERE time >= '" + startDate + "' and time <= '" + endDate +"'";
    console.log(q1);
    dbTemp.run(q , function () {
        dbTemp.all(q1, function () {
        });
    });
};

function announcementAdd (username, status, announcement, time, db) {
    var dbTemp = db;
    dbTemp.serialize(function () {
        dbTemp.run("CREATE TABLE IF NOT EXISTS testannouncements (announcementId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, status TEXT, time TEXT, content TEXT)");
        var insertAnnouncement = dbTemp.prepare("insert into testannouncements Values(?, ?, ?, ?, ?)");
        insertAnnouncement.run(null, username, status, time, announcement);
    });
};

var db = new UserDb();
announcementAdd( "panli" , null , "hahahaha" , "4/1/2016 0:00", db);
announcementAdd( "panli" , null , "hahahaha" , "4/1/2016 23:00", db);
announcementAdd( "panli" , null , "hahahaha" , "3/1/2016 0:00", db);
announcementAdd( "panli" , null , "hahahaha" , "4/2/2016 4:00", db);
announcementAdd( "panli" , null , "hahahaha" , "3/31/2016 2:00", db);
announcementAdd( "panli" , null , "hahahaha" , "4/1/2016", db);
announcementAdd( "panli" , null , "hahahaha" , "4/2/2016", db);
search("4/1/2016", "4/20/2016",  db);
deleteByDate("4/1/2016", "4/20/2016",  db);
search("4/1/2016", "4/20/2016",  db);
