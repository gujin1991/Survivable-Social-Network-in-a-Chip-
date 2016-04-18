/**
 * Created by jiyushi1 on 2/25/16.
 */


var messagee = require('../module/Message.js')
var messageM = new messagee();

exports.getPublicMessages = function(req, res) {
    messageM.getHistory(function(data){
        res.json(data);
    });
}

exports.sendPublicMessage = function(req,res,io){
    var message = req.body;
    message.time = now();
    message.status = req.session.status;
    messageM.addMessage(message.username,message.text,message.time,req.session.status,message.nickName ,function(callback){
        if (callback == 200) {
            io.emit('send message', message);
            res.json({"statusCode":200, "message": "Success"});
        }
        else res.json({"statusCode":400, "message": "Fail"});
    });
}

function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}