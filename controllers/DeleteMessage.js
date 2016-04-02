/**
 * Created by Pan on 4/1/16.
 */
var messagePri = require('../module/PrivateMessage.js')
var messagePrivate = new messagePri();

var messagePub = require('../module/Message.js')
var messagePublic = new messagePub();

//delete public message function
exports.deleteAllPublicMsg = function(req,res){
    var strs = req.body.idArray.split(",");
    var idArray = [];
    for (var i = 0; i < strs.length; i++) {
        if (strs[i] != ""){
            idArray.push(parseInt(strs[i]));
        }
    }
    if(idArray.length == 0){
        res.json({"statusCode":401, "message": "Noting to delete"});
    }else{
        messagePublic.deleteMessageById(idArray,function(response){
            res.json(response);
        });
    }
}

//delete private message function
exports.deleteAllPrivateMsg = function(req,res){
    var strs = req.body.idArray.split(",");
    var idArray = [];
    for (var i = 0; i < strs.length; i++) {
        if (strs[i] != ""){
            idArray.push(parseInt(strs[i]));
        }
    }
    if(idArray.length == 0){
        res.json({"statusCode":401, "message": "Noting to delete"});
    }else{
        messagePrivate.deletePrivateMessageById(idArray,function(response){
            res.json(response);
        });
    }
}