/**
 * Created by jiyushi1 on 2/25/16.
 */
var directory = require('../module/Directory.js')


exports.updateStatus = function(req,res,io) {
    directory.updateStatus(req.body.username,req.body.status, function(callback) {
        if(callback == 200) res.json({"statusCode":200, "message": "Success"});
        else if (callback == 400) res.json({"statusCode":400, "message": "Fail"});
    });

    var message  = {};
    directory.getOfflineUsers(function(offUsers){
        //user.getOfflineUsers(loggedInUsers,function(offUsers){
        var offU = [];
        for (var i = 0 ; i < offUsers.length;i++){
            //console.log("offusers[i] =  -------------" + offUsers[i].userName);
            offU.push(offUsers[i].userName);
        }
        message.offline = offU;
        directory.getOnlineUsers(function(onlineUsers){
            message.online = onlineUsers;
        });
        io.emit('updatelist',message);
    });
}

//may be we don't need this one because it's a pop window by the same webpage.
exports.electStatus = function(req,res){
    res.render();
}
