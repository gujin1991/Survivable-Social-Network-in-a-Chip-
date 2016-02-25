//this js file contains all the method  to get history message
//and search function.
var userr = require('../module/User.js');
var user = new userr();

var messagee = require('../module/Message.js')
var messageM = new messagee();

//var directoryy = require('../module/Directory.js')
//var directory = new directoryy();

exports.getPublicMessages = function(req, res) {
    messageM.getHistory(function(data){
        res.json(data);
    });

}

//
//exports.getOfflineUsers = function(req,res,loggedInUsers){
//    user.getOfflineUsers(loggedInUsers,function(offUsers){
//        var offU = [];
//        for (var i = 0 ; i < offUsers.length;i++){
//            offU.push(offUsers[i].userName);
//        }
//        console.log("inside  get user api : loged in  -----" + loggedInUsers + "    logged out ----"+  offU);
//        res.json({"online":loggedInUsers,"offline":offU});
//    });
//}


//exports.getOfflineUserIo = function(loggedInUsers,io){
//exports.getOfflineUserIo = function(io){
//    var message  = {};
//    directory.getOfflineUsers(function(offUsers){
//    //user.getOfflineUsers(loggedInUsers,function(offUsers){
//        var offU = [];
//        for (var i = 0 ; i < offUsers.length;i++){
//            offU.push(offUsers[i].userName);
//        }
//        //console.log("inside dynamic update : loged in  -----" + loggedInUsers + "    logged out ----"+  offU);
//        message.offline = offU;
//    });
//    directory.getOnlineUsers(function(onlineUsers){
//        message.online = onlineUsers;
//    });
//    console.log("inside dynamic update : loged in  -----" + message.online + "    logged out ----"+ message.offline );
//
//    io.emit('updatelist',message);
//}


exports.sendPublicMessage = function(req,res,io){
    var message = req.body;
    message.time = now();
    messageM.addMessage(message.username,message.text,message.time, function(callback){
        if (callback == 200) console.log("200 OK",message.username,message.text,message.time);
    });
    io.emit('send message', message);
}



//exports.addLoggedInUsers = function(user){
//    directory.addLoggedInUsers(user);
//}
//
//exports.deleteLoggedInUsers = function(user){
//    directory.deleteLoggedInUsers(user);
//}



function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}