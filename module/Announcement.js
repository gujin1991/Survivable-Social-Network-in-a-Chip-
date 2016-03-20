/*
 * created by Jin Gu on 02/25/16
 */

var AnnoucementDB = require('./AnnouncementDb.js');

function Annoucement(username, annoucement, time) {
	this.username = username;
    this.annoucement = annoucement;
    this.time = time;
    this.annoucementDb = new AnnoucementDB();
}

Annoucement.prototype.addAnnoucement =  function(username,annoucement,time,callback) {
    this.annoucementDb.annoucementAdd(username, annoucement, time, callback);
    return this;
};

Annoucement.prototype.getDetails = function (callback) {
    this.annoucementDb.getAnnoucement(callback);
};

//new added function to get announcement by key in database
Annoucement.prototype.getDetailsByKey = function (strArr,callback) {
    this.annoucementDb.getAnnoucementByKey(strArr,callback);
};


module.exports = Annoucement;