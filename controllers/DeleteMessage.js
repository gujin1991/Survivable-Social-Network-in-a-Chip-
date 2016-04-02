/**
 * Created by Pan on 4/1/16.
 */
var messagePri = require('../module/PrivateMessage.js')
var messagePrivate = new messagePri();

var User = require('../module/User.js');
var directory = require('../module/Directory.js')

var messagePub = require('../module/Message.js')
var messagePublic = new messagePub();

//search public message function
exports.deleteAll = function(req,res){

    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^\n");
    console.log(req.body);
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^\n");
    var strs = req.body.idArray.split(",");
    console.log(strs);
    var idArray = [];
    for (var i = 0; i < strs.length; i++) {
        if (strs[i] != ""){
            idArray.push(parseInt(strs[i]));
        }
    }
    console.log("^^^^^^^^^^^^^^^^^^^^^^^^^\n");
    console.log(idArray);

    if(idArray.length == 0){
        res.json({"statusCode":401, "message": "Noting to delete"});
    }else{
        messagePublic.deleteMessageById(idArray,function(response){
            res.json(response);
        });
    }
}