/**
 * Created by congshan on 4/15/16.
 */
var Privilege = require('../module/Privilege');

exports.directMap = function (req,res) {
    console.log("req user name " + req.params.username);
    if(req.session.privilege != new Privilege().administrator){ // citizen
        res.render('userMap', {'username': req.session.username, 'status': req.session.status});
    } else { // admin
        res.render('adminMap', {'username': req.session.username, 'status': req.session.status});
    }
};