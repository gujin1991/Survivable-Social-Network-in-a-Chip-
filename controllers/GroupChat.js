/**
 * Created by Jin Gu on 4/1/16.
 */

var messagee = require('../module/GroupMessage.js')
var messageM = new messagee();

exports.getMessages = function(req, res) {
    messageM.getHistory(req.body.sender,function(data){

        res.json(data);
    });

}

exports.sendGroupMessage = function(req,res,io){
    var message = req.body;
    var receiver;
    var receivers;

    message.time = now();
    message.status = req.session.status;

    messageM.addMessage( message.sender, message.receiver, message.text, message.time,req.session.status,function(callback){
        if (callback == 200) {
            io.emit('send group message', message);
            res.json({"statusCode":200, "message": "Success"});
        }
        else res.json({"statusCode":400, "message": "Fail"});
    });
}

exports.endGroupChat = function(req, res, io, call) {
    messageM.deleteHistory(function(callback) {
           io.emit('groupChatEnd', req.body.hostname);
           call(200);
           res.json({"statusCode":200, "message": "Success"});
    });
}


function now(){
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}