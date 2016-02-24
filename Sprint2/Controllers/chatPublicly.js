//this js file contains all the method  to get history message
//and search function.
var userDB = require('../module/User.js');
var userDb = new userDB();

var messageDB = require('../module/Message.js')
var messageDb = new messageDB();

exports.getPublicMessages = function(req, res) {
    messageDb.getHistory(function(data){
        res.json(data);
    });

}

exports.getOfflineUsers = function(req,res,loggedInUsers){
    userDb.getOfflineUsers(loggedInUsers,function(offUsers){
        var offU = [];
        for (var i = 0 ; i < offUsers.length;i++){
            offU.push(offUsers[i].userName);
        }
        console.log("inside  get user api : loged in  -----" + loggedInUsers + "    logged out ----"+  offU);
        res.json({"online":loggedInUsers,"offline":offU});
    });
}

exports.sendPublicMessage = function(req,res,io){
    var message = req.body;
    message.time = now();
    messageDb.addMessage(message.username,message.text,message.time, function(callback){
        if (callback == 200) console.log("200 OK",message.username,message.text,message.time);
    });
    io.emit('send message', message);
}

function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}