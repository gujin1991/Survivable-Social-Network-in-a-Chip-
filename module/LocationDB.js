/*
 Created by Jin Gu 04/15/2016
 */

var sqlite3 = require('sqlite3').verbose();
var User = require('../module/User.js');

function LocationDB() {
    this.db = new sqlite3.Database('./fse.db');
}

LocationDB.prototype.addLocation = function (name, status, longitude, latitude, type, time, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        var sql = "INSERT OR REPLACE INTO LOCATIONS (name, status, x, y, type, time) VALUES(?, ?, ?, ?, ?, ?);";
        var location = dbTemp.prepare(sql);
        location.run(name, status, longitude, latitude, type, time);
        callback(name, 200);
    });
};

LocationDB.prototype.deleteLocation = function (name, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.run("DELETE FROM locations where name = \'" + name + "\';", function (err, rows) {
            if (err)
                callback(name, 400);
            else {
                callback(name, 200);
            }
        });
    });
};

LocationDB.prototype.getLocation = function (callback) {
    var dbTemp = this.db;
    var user = new User();
    dbTemp.all('select * from locations', function (err, rows) {
        if (err) {
            callback(err, null);
        } else {
            var locations = [];
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var location = {
                    "name": row.name,
                    "location": JSON.stringify({"x": row.x, "y": row.y}),
                    "type": row.type,
                    "status": row.status
                };
                locations.push(location);
            }
            console.log(locations.length);
            console.log(rows.length);
            // while(locations.length != rows.length);
            callback(null, locations);
        }
    });
};

module.exports = LocationDB;
