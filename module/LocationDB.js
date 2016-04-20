/*
 Created by Jin Gu 04/15/2016
 */

var sqlite3 = require('sqlite3').verbose();
var directory = require('../module/Directory.js');

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
    dbTemp.all('select * from locations', function (err, rows) {
        directory.getOnlineUsers(function (onlines) {
            var names = user2Name(onlines);
            if (err) {
                callback(err, null);
            } else {
                var locations = [];
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var online = false;
                    if (names.indexOf(row.name)!=-1) {
                        online = true;
                    }
                    var location = {
                        "name": row.name,
                        "location": JSON.stringify({"x": row.x, "y": row.y}),
                        "type": row.type,
                        "status": row.status,
                        "online": online
                    };
                    locations.push(location);
                }
                callback(null, locations);
            }
        });
    });
};

function user2Name(users) {
    var names = [];
    for(var i in users) {
        names.push(users[i].userName);
    }
    return names;
}

module.exports = LocationDB;
