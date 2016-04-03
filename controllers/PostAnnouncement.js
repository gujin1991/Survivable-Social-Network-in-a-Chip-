/* 
 * this file implements the post Announcement user case
 * there are two functions, one is get Announcements from database
 * another is send Announcements by socket.io and save Announcements
 * in database
 */

var User = require('../module/User.js');
var user = new User();

var ANNOUNCEMENT = require('../module/Announcement.js');
var Announcement = new ANNOUNCEMENT();

//post announcement
exports.directAnnouncement = function(req,res){
    console.log("loggedIn = " + req.session.loggedIn);
    if (!req.session.loggedIn) {
        res.render('index', {'username': req.session.username});
    } else {
        res.render('announcement', {'username': req.session.username, 'status': req.session.status});
    }
};

exports.getAnnouncements = function(req, res) {
    Announcement.getDetails(function(data) {
 		res.json(data);
 	});
};

exports.sendAnnouncements = function(req, res, io) {
 	var announcement = req.body;
    announcement.time = now();
    console.log("!!!!!!!!!@@@@@@@@@" + announcement.time);
    announcement.status = req.session.status;
    Announcement.addAnnouncement(announcement.username,announcement.status,announcement.text,announcement.time, function(callback){
        if (callback == 200) console.log("200 OK",announcement.username,announcement.status,announcement.text,announcement.time);
    });
    io.emit('send announcement', announcement);
};

function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}