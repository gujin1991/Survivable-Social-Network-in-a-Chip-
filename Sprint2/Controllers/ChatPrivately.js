/**
 * Created by jiyushi1 on 2/25/16.
 */

//var messagee = require('../module/MessagePriva.js')
//var messageM = new messagee();
//
////var directoryy = require('../module/Directory.js')
////var directory = new directoryy();
//
//exports.getPrivateMessages = function(req, res) {
//    messageM.getHistory(function(data){
//        res.json(data);
//    });
//}
//
//exports.sendPublicMessage = function(req,res,io){
//    var message = req.body;
//    message.time = now();
//    messageM.addMessage(message.username,message.text,message.time, function(callback){
//        if (callback == 200) console.log("200 OK",message.username,message.text,message.time);
//    });
//    io.emit('send message', message);
//}
