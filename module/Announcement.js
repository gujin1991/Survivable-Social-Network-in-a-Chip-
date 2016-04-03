/*
 * created by Jin Gu on 02/25/16
 */

var AnnouncementDB = require('./AnnouncementDb.js');

function Announcement(username, status, announcement, time) {
	this.username = username;
    this.status = status;
    this.announcement = announcement;
    this.time = time;
    this._announcementDb = new AnnouncementDB();
}

Announcement.prototype.addAnnouncement =  function(username,status,announcement,time,callback) {
    this._announcementDb.announcementAdd(username, status, announcement, time, callback);
    return this;
};

Announcement.prototype.getDetails = function (callback) {
    this._announcementDb.getAnnouncement(callback);
};

Announcement.prototype.getDetailsByKey = function (strArr,callback) {
    this._announcementDb.getAnnouncementByKey(strArr,callback);
};

Announcement.prototype.searchAnnounceByDate = function (startDate,endDate,callback) {
    this._announcementDb.searchAnnounceByDate(startDate,endDate,callback);
};

Announcement.prototype.deleteAnnounceByDate = function (startDate,endDate,callback) {
    this._announcementDb.deleteAnnounceByDate(startDate,endDate,callback);
};
module.exports = Announcement;