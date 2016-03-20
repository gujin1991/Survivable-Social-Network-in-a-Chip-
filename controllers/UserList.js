/**
 * Created by congshan on 2/25/16.
 */
//var directory = require('../module/Directory.js');

exports.directUserList = function(req,res){
    if (!req.session.loggedIn) {
        res.render('index', {'username': req.session.username, 'status': req.session.status});
    } else {
        res.render('users', {'username': req.session.username, 'status': req.session.status});
    }
};
