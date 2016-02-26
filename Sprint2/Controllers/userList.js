/**
 * Created by congshan on 2/25/16.
 */
var directory = require('../module/Directory.js');

exports.directUserList = function(req,res){
    res.render('users', {"username":req.session.username});
}