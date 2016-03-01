/* 
 * this file implements the post Annoucement user case
 * there are two functions, one is get Annoucements from database
 * another is send Annoucements by socket.io and save Annoucements
 * in database
 */

var User = require('../module/User.js');
var user = new User();

var ANNOUCEMENT = require('../module/Announcement.js');
var Annoucement = new ANNOUCEMENT();

//post annoucement
exports.directAnnoucement = function(req,res){
    console.log("loggedIn = " + req.session.loggedIn);

    if (!req.session.loggedIn) {
        res.render('index', {'username': req.session.username});
    } else {
        console.log("fine!");
        res.render('announcement', {'username': req.session.username, 'status': req.session.status});
    }
};


exports.getAnnoucements = function(req, res) {
 	Annoucement.getDetails(function(data) {
 		res.json(data);
 	});	
} 

exports.sendAnnoucements = function(req, res, io) {
 	var annoucement = req.body;
    annoucement.time = now();
    Annoucement.addAnnoucement(annoucement.username,annoucement.text,annoucement.time, function(callback){
        if (callback == 200) console.log("200 OK",annoucement.username,annoucement.text,annoucement.time);
    });
    io.emit('send annoucement', annoucement);
} 


function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}