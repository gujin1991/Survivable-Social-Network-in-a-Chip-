/*
 Created by Jin Gu 04/15/2016
 */

var sqlite3 = require('sqlite3').verbose();

function LocationDB() {
    this.db = new sqlite3.Database('./fse.db');
}

LocationDB.prototype.addLocation = function (name, longitude, latitude, type, time, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        var location = dbTemp.prepare("INSERT INTO LOCATIONS VALUES(?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE " +
            "longitude = \'" + longitude + "\', latitude = \'" + latitude + "\', time = \'" + time + "\';");
        location.run(name, longitude, latitude, type, time);
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
        if (err) {
            callback(err, null);
        } else {
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i];
                var location = {"name":row.name, "location": JSON.stringify({"x":row.x,"y":row.y}), "type": row.type}
                if (row.type == 'user') {
                    location['status'] = ""; //TODO call get status
                } else {
                    location['status'] = null;
                }
            }
            callback(null, rows);
        }
    });
};


module.exports = LocationDB;
