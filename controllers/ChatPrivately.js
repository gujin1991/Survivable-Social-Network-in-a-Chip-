/**
 * Created by jiyushi1 on 2/25/16.
 */

var messagee = require('../module/PrivateMessage.js')
var messageM = new messagee();


exports.getPrivateMessages = function(req, res) {

    messageM.getHistory(req.body.sender,req.body.receiver,function(data){
        res.json(data);
    });

}

exports.sendPrivateMessage = function(req,res,socket,sender,sockets){
    var message = req.body;
    message.time = now();
    message.status = req.session.status;
    message.senderNickname = '';
    message.receiverNickname = '';

    messageM.addMessage( message.sender, message.receiver, message.text, message.time,req.session.status,
                message.senderNickname,message.receiverNickname,function(callback){
        if (callback == 200) {
            sender.emit('send private message', message);
            if(req.body.receiver in sockets) socket.emit('send private message', message);
            res.json({"statusCode":200, "message": "Success"});
        }
        else if (callback == 400 )res.json({"statusCode":400, "message": "Fail"});
    });
}

function now(){
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}