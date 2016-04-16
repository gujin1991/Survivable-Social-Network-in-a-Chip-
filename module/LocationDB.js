/*
    Created by Jin Gu 04/15/2016
 */

var sqlite3 = require('sqlite3').verbose();

function LocationDB() {
    this.db = new sqlite3.Database('./fse.db');
}

LocationDB.prototype.addLocation = function(name, longitude, latitude, type, time, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function() {
        dbTemp.run("Create the table if not exists locations (name text PRIMARY KEY, " +
            "longitude text, latitude text, type text, time text)");

        /*dbTemp.run("DELETE FROM locations where name = \"" + name + "\" and type = \"" + type + "\"");
        var location = dbTemp.prepare("Insert into locations Values(?, ?, ?, ?, ?, ?)");*/

        var location = dbTemp.prepare("Insert into locations Values(?, ?, ?, ?, ?) on duplicate key update " +
            "longitude = \"" + longitude + "\", latitude = \"" + latitude + "\", time = \"" + time + "\"");
        location.run(name, longitude, latitude, type, time);
        callback(name, 200);
    });



}

/*LocationDB.prototype.delteLocation = function(name, longitude, latitude, type, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function() {
        dbTemp.run("DELETE FROM locations where name = \"" + name + "\" and type = \"" + type + "\"", function (err, rows) {
            //console.log("delete " + err);

            if(rows != null)
                callback(name, 200);
            else {
                callback(null, 400);
            }
        });
    });

}*/

LocationDB.prototype.getLocation = function(callback) {
    var dbTemp = this.db;
    dbTemp.all('select * from locations', function(err, rows) {
        if(err) {
            callback(null, 400);
        } else {
            callback(rows, 200);
        }
    });
}

module.exports = LocationDB;
