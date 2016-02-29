/**
 * Created by jiyushi1 on 2/25/16.
 */

var messagee = require('../module/PrivateMessage.js')
var messageM = new messagee();

//var directoryy = require('../module/Directory.js')
//var directory = new directoryy();

exports.getPrivateMessages = function(req, res) {

    messageM.getHistory(req.body.sender,req.body.receiver,function(data){
        res.json(data);
    });

}

exports.sendPrivateMessage = function(req,res,socket,sender,sockets){
    var message = req.body;
    console.log("200 OK");
    message.time = now();
    messageM.addMessage( message.sender, message.receiver, message.text, message.time, function(callback){
        if (callback == 200) {
            sender.emit('send private message', message);
            if(req.body.receiver in sockets) socket.emit('send private message', message);
            res.json({"statusCode":200, "message": "Success"});
        }
        else res.json({"statusCode":400, "message": "Fail"});
    });
}

function now(){
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}