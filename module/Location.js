/*
    Created by Jin Gu 04/16/2016
 */

var LocationDB = require('./LocationDB.js');

function Location(name, longitude, latitude, type, time) {
    this.name = name;
    this.longitude = longitude;
    this.latitude = latitude;
    this.type = type;
    this.time = time;
    this.locationDB = new LocationDB();
}

Location.prototype.add = function(name, longitude, latitude, type, time, callback) {
    this.locationDB.addLocation(name, longitude, latitude, type, time, callback);
}


/*Location.prototype.delete = function(name, longitude, latitude, type, callback) {
    this.locationDB.delteLocation(name, longitude, latitude, type, callback);
}*/

Location.prototype.get = function(callback) {
    this.locationDB.getLocation(callback);
}

module.exports = Location;