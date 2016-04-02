/**
 * Created by jiyushi1 on 2/25/16.
 */

var User = require('../module/User.js');

//TODO
//tow methods to submit profile info, one is when goes to the password page a popup window will show up,
//the second is that you click save button.
//

exports.directToProfile = function (req,res) {
    //console.log("req user name " + req.params.username);
    new User().getUserProfile(req.params.username,function(err,user){
        if (err){
            res.json({"statusCode":401, "message": "Cannot get data from databse"});
        }else{
            //res.json(user);
            //
            //console.log(user[0].email);
            //console.log(user[0].userName);
            res.render('profile', user[0]);
        }
    });
};

//wrapper function to change password page.
exports.directToPassword = function (req,res) {
    res.render('changePassword');
};


exports.updateProfile = function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var skill = req.body.skill;
    var gender = req.body.gender;


    new User().initializeForChangeFile(username, email,firstname,lastname,skill,gender).updateProfile(function(result) {
        if (result == 400) {
            res.json({"statusCode":400, "message": "User existed"});
        } else {
            res.json({"statusCode":200, "message": "Info Saved."});
        }
    });
}


exports.updatePassword = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var oldpassword = req.body.oldpassword;

    if(password == oldpassword) res.json({"statusCode":200, "message": "Password Updated!"});
    else{
        new User().initializeForChangePassword(username, oldpassword, password).updatePassword(function(result) {
            if (result == 400) {
                res.json({"statusCode":400, "message": "Wrong Old Password"});
            } else if(result == 200) {
                res.json({"statusCode":200, "message": "Password Updated!"});
            }else{
                res.json({"statusCode":401, "message": "Something Wrong with DB"});
            }
        });
    }
}

exports.viewProfile = function (req,res) {

    new User().getUserProfile(req.body.username,function(err,user){
        if (err){
            res.json({"statusCode":400, "message": "Cannot get data from databse"});
        }else{
            res.json(user);
        }
    });
};

