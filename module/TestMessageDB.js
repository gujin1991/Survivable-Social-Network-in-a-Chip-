var sqlite3 = require('sqlite3').verbose();

function TestMessageDb() {
    this.db = new sqlite3.Database('./test.db');
    this.postCount = 0;
    this.getCount = 0;
}

TestMessageDb.prototype.messageAdd = function (username, message, time, status, callback) {
    //TODO add user exist auth
    var dbtemp = this.db;
    dbtemp.serialize( function () {
        dbtemp.run("CREATE TABLE IF NOT EXISTS testMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT)");
        var insertMessage = dbtemp.prepare("insert into testMessages Values(?, ?,?,?, ?)");
        insertMessage.run(null, username, time, message, status);
        this.postCount++;
        if(this.postCount > 1000) {
            dbtemp.run("DELETE TABLE IF EXISTS testMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT)");
            callback(400, this.postCount);
            return;
        } else {
            callback(200, this.postCount);
            return;
        }
    });
};

TestMessageDb.prototype.getHistory = function (callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all("SELECT * FROM testMessages", function (err, rows) {
            this.getCount++;
            callback(rows);
        })
    });
};

TestMessageDb.prototype.endMeasurement = function(callback) {
    var dbtemp = this.db;
    var tempGetCount = this.getCount;
    var tempPostCount = this.postCount;
    dbtemp.serialize(function () {
        dbtemp.run("DELETE TABLE IF EXISTS testMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT)");
        this.getCount = 0;
        this.postCount = 0;
        callback(tempPostCount, tempGetCount);
    });
};

module.exports = TestMessageDb;

