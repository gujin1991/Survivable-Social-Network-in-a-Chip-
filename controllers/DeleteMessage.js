/**
 * Created by Pan on 4/1/16.
 */
var messagePri = require('../module/PrivateMessage.js')
var messagePrivate = new messagePri();

var messagePub = require('../module/Message.js')
var messagePublic = new messagePub();

var announcement = require('../module/Announcement.js');
var announ = new announcement();

//delete public message function
exports.deleteAllPublicMsg = function(req,res){
    var strs = req.body.idArray.split(",");
    var idArray = [];
    for (var i = 0; i < strs.length; i++) {
        if (strs[i] != ""){
            idArray.push(parseInt(strs[i]));
        }
    }
    if(idArray.length == 0){
        res.json({"statusCode":401, "message": "Noting to delete"});
    }else{
        messagePublic.deleteMessageById(idArray,function(response){
            res.json(response);
        });
    }
}

//delete private message function
exports.deleteAllPrivateMsg = function(req,res){
    var strs = req.body.idArray.split(",");
    var idArray = [];
    for (var i = 0; i < strs.length; i++) {
        if (strs[i] != ""){
            idArray.push(parseInt(strs[i]));
        }
    }
    if(idArray.length == 0){
        res.json({"statusCode":401, "message": "Noting to delete"});
    }else{
        messagePrivate.deletePrivateMessageById(idArray,function(response){
            res.json(response);
        });
    }
}

exports.searchAnnounceByDate = function(req, res) {
    if(req.query.startDate == undefined || req.query.endDate == undefined){
        res.json({"statusCode":401, "message": "No available dates!"});
    }else{
        var startDate = req.query.startDate + " 0:00";
        var endDate = req.query.endDate + " 23:59";
        announ.searchAnnounceByDate(startDate,endDate,function(response){
            res.json(response);
        });
    }
}

exports.deleteAnnounceByDate = function(req, res) {
    if(req.body.startDate == undefined || req.body.endDate == undefined){
        res.json({"statusCode":401, "message": "No available dates!"});
    }else{
        var startDate = req.body.startDate + " 0:00";
        var endDate = req.body.endDate + " 23:59";
        announ.deleteAnnounceByDate(startDate,endDate,function(response){
            res.json(response);
        });
    }
}