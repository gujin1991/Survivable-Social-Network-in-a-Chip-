/**
 * Created by Jin Gu on 4/1/16.
 */

var messagee = require('../module/GroupMessage.js')
var messageM = new messagee();
var User = require('../module/User.js');

exports.getMessages = function(req, res) {
    messageM.getHistory(req.query.groupName,function(data){
        console.log(data);
        res.json(data);
    });

}

exports.sendGroupMessage = function(req,res,io){
    var message = req.body;
    var receiver;
    var receivers;

    message.time = now();
    message.status = req.session.status;

    messageM.addMessage( message.sender, message.group, message.text, message.time,req.session.status,function(callback){
        if (callback == 200) {
            console.log("sendGroupMessage");
            io.emit('send group message', message);
            res.json({"statusCode":200, "message": "Success"});
        }
        else res.json({"statusCode":400, "message": "Fail"});
    });
}

exports.endGroupChat = function(req, res, io) {
    console.log("groupName " + req.body.groupName);

    new User().deleteGroup_User(req.body.groupName, function(callback) {
        if(callback == 200) {
            io.emit('groupChatEnd', req.body.groupName);
            res.json({"statusCode": 200, "message": "Success"});
        } else {
            res.json({"statusCode": 400, "message": "Fail"});
        }
    });
}

exports.addNewGroup = function(req,res) {
    new User().addGroup(req.body.groupName, function(callback) {
        if(callback == 200)
       res.json({"statusCode":200, "message": "Success"});
    });
}


exports.addNewGroupUser = function(req,res) {
    console.log(req.body.receiver + "GropChat");
    //var invitaion = {'sender': req.body.sender, 'receiver':req.body.receiver, 'groupName':req.body.groupName};

    new User().addGroupUser(req.body.groupName, req.body.receiver, function(callback) {
        if(callback == 200)
            res.json({"statusCode":200, "message": "Success"});
    });
}

exports.getGroup = function(req,res) {
    console.log(req.query.userName);
    new User().getGroup_User(req.query.userName, function(data) {
            ///console.log(data.code + "groupData");
            res.json(data);
    });
}



function now(){
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}