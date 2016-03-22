var sqlite3 = require('sqlite3').verbose();


var TestMessageDb = function TestMessageDb() {
    this.db = new sqlite3.Database('./test.db');
    var limit = 100;
    var post = 0;
    var get = 0;
    this.messageAdd = function (username, message, time, status, callback) {
        //TODO add user exist auth
        var dbtemp = this.db;
        dbtemp.serialize( function () {
            dbtemp.run("CREATE TABLE IF NOT EXISTS testMessages (messageId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, time TEXT, content TEXT, status TEXT)");
            var insertMessage = dbtemp.prepare("insert into testMessages Values(?,?,?,?,?)");
            insertMessage.run(null, username, time, message, status);

            post++;

            if(post > limit) {
                dbtemp.run("delete from testMessages");
                post = 0;
                get = 0;
                callback(413,post);
            } else {
                callback(200, post);

            }
            //console.log("post COUNT--------" , post);
        });
    };

    this.getHistory = function (callback) {
        var dbTemp = this.db;
        dbTemp.serialize(function () {
            dbTemp.all("SELECT * FROM testMessages", function (err, rows) {

                get++;
                console.log("get --------- + " , get);
                if(rows != null)
                    callback(200);
                else callback(400);
            })
        });
    };

    this.endMeasurement = function(callback) {
        var dbtemp = this.db;
        var tempGetCount = get;
        var tempPostCount = post;

        dbtemp.serialize(function () {
            dbtemp.run("delete from testMessages");

            post = 0;
            get = 0;

            callback(tempPostCount, tempGetCount);
        });
    };
    this.reset = function(){
        post = 0;
        get = 0;
    }
}



module.exports = TestMessageDb;

