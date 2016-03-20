/**
 * Created by jiyushi1 on 3/19/16.
 */
var messagePri = require('../module/PrivateMessage.js')
var messagePrivate = new messagePri();

var User = require('../module/User.js');
var directory = require('../module/Directory.js')

var messagePub = require('../module/Message.js')
var messagePublic = new messagePub();

var announcement = require('../module/Announcement.js');
var announ = new announcement();

var stopWords = ['a','able','about','across','after','all','almost','also','am','among','an','and',
    'any','are','as','at','be','because', 'been','but','by','can','cannot','could','dear','did','do','does',
    'either','else','ever','every','for','from','get','got','had','has','have', 'he','her','hers','him','his',
    'how','however','i','if','in','into','is','it','its','just','least','let','like', 'likely','may','me','might','most',
    'must', 'my','neither','no','nor','not','of','off','often','on','only','or','other','our','own','rather','said',
    'say','says','she','should','since','so','some','than', 'that','the','their','them','then','there','these','they',
    'this','tis','to','too','twas','us','wants','was','we', 'were','what','when','where','which','while',
    'who','whom','why','will','with','would','yet','you','your'];

//search user
exports.getUsersByName = function(req,res){
    var message  = {};

    directory.searchOffLine(req.body.keyword,function(offUsers){

        //var cur = {};
        //cur.userName = user.userName;
        //cur.status = user.status;
        //message.currentUser = cur;
        message.offline = offUsers;

        directory.searchOnlineUsers(req.body.keyword,function(onlineUsers){
            message.online = onlineUsers;
        });


        res.json(message);
        //io.emit('updatelist',message);
    });
}


exports.getUsersByStatus = function(req,res){
    var message  = {};

    directory.searchOffLineByStatus(req.body.keyword,function(offUsers){

        //var cur = {};
        //cur.userName = user.userName;
        //cur.status = user.status;
        //message.currentUser = cur;
        message.offline = offUsers;

        directory.searchOnlineUsersByStatus(req.body.keyword,function(onlineUsers){
            message.online = onlineUsers;
        });

        res.json(message);

    });
}

//search announcement function
exports.searchAnnouncement = function(req,res){
    var strArr = req.body.keyword.trim().split(' ');

    //filter the word
    strArr = filter(strArr);

    if(strArr.length == 0){
        res.json({"statusCode":401, "message": "ALL STOP WORDS"});
    }else{
        announ.getDetailsByKey(strArr,function(data) {
            res.json(data);
        });
    }


}

//search public message function
exports.searchPublic = function(req,res){

    var strArr = req.body.keyword.trim().split(' ');

    //filter the word
    strArr = filter(strArr);

    if(strArr.length == 0){
        res.json({"statusCode":401, "message": "ALL STOP WORDS"});
    }else{
        messagePublic.getHistoryByKey(strArr,function(data){
            res.json(data);
        });
    }


}

//search private message funciton
exports.searchPrivate = function(req,res){
    var strArr = req.body.keyword.trim().split(' ');

    //filter the word
    strArr = filter(strArr);

    if(strArr.length == 0){
        res.json({"statusCode":401, "message": "ALL STOP WORDS"});
    }else{
        messagePrivate.getHistoryByKey(strArr,req.session.username,function(data){
            res.json(data);
        });
    }


}

//delete stop words
function filter(strArr){
    for (var i = 0; i < strArr.length ; i++){
        var index = stopWords.indexOf(strArr[i]);
        if (index > -1) {
            strArr.splice(i, 1);
            i--;
        }
    }
    return strArr;
}