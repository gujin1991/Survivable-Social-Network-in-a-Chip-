/**
 * Created by jiyushi1 on 2/25/16.
 */
var directory = require('../module/Directory.js')


exports.updateStatus = function(req,res,io) {

    directory.update(req.body.username,req.body.status, function(callback) {
        if(callback == 200) {
            req.session.status = req.body.status;
            res.json({"statusCode":200, "message": "Success"});
        }
        else if (callback == 400) res.json({"statusCode":400, "message": "Fail"});
    });


    var message  = {};
    directory.getOfflineUsers(function(offUsers){
        var cur = {};
        cur.userName = req.body.username;
        cur.status = req.body.status;
        message.currentUser = cur;
        message.offline = offUsers;
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
