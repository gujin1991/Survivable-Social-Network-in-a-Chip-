/*
 * created by Jin Gu on 02/25/16
 */

var AnnoucementDB = require('./AnnouncementDB.js');

function Annoucement(username, annoucement, time) {
	this.username = username;
    this.annoucement = annoucement;
    this.time = time;
    this.annoucementDb = new AnnoucementDB();
}

Annoucement.prototype.addAnnoucement =  function(username,annoucement,time,callback) {
    this.annoucementDb.annoucementAdd(username, annoucement, time, callback);
};

Annoucement.prototype.getDetails = function (callback) {
    this.annoucementDb.getAnnoucement(callback);
};


module.exports = Annoucement;