/**
 * Created by jiyushi1 on 2/25/16.
 */

var messagee = require('../module/Message.js')
var messageM = new messagee();

//var directoryy = require('../module/Directory.js')
//var directory = new directoryy();

exports.getPrivateMessages = function(req, res) {
    messageM.getHistory(req.body.sender,req.body.receiver,function(data){
        res.json(data);
    });
}


exports.sendPrivateMessage = function(req,res,io){
    var message = req.body;
    message.time = now();
    messageM.addMessage(message.sender,message.receiver,message.text,message.time, function(callback){
        if (callback == 200) io.emit('send private message', message);
        else res.json({"statusCode":400, "message": "Fail"});
        //console.log("200 OK",message.username,message.text,message.time);
    });
}
