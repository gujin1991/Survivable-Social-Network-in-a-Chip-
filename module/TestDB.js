var sqlite3 = require('sqlite3').verbose();

function UserDb() {
    var db = new sqlite3.Database('./testPanLi.db');
    return db;
}



function deleteMsg(id,  db) {
    var dbTemp = db;
    var q = "CREATE TABLE IF NOT EXISTS testMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT)";
    var q1 = "SELECT * from testMessages where messageId=" + id.join(' or messageId = ');
    //console.log(q1);
    dbTemp.run(q , function () {
        dbTemp.all(q1 , function (err, row) {
            console.log(row);
            if (row.length == 0) {
                //callback(400, null);
                console.log("meiyou ");
                return;
            }


            //var q2 = "DELETE * FROM messages WHERE messageId =\'" + id + "\'";
            var q2 = "DELETE FROM testMessages WHERE messageId = " + id.join(' or messageId = ');

            dbTemp.all(q2, function() {

            });

            dbTemp.all("select * from testMessages" , function (err, row) {
                console.log(row);
                if (err || row == null || row.length == 0) {
                    //callback(305, null);
                    console.log("right");
                } else {

                    //callback(null, u);
                }
            });

        });
    });

};

function messageAdd(username, message, time, status, db) {
    var dbTemp = db;
    dbTemp.serialize(function () {
        dbTemp.run("CREATE TABLE IF NOT EXISTS testMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT)");
        var insertMessage = dbTemp.prepare("insert into testMessages Values(?, ?, ?, ?, ?)");
        insertMessage.run(null, username, time, message, status);
    });
};

var db = new UserDb();
id = [1];
messageAdd( "panli" , null , "hahahaha" , null, db);
deleteMsg(id,  db);
