/**
 * Created by congshan on 2/25/16.
 */
exports.directUserList = function(req,res){
    if (!req.session.loggedIn) {
        res.render('index', {'username': req.session.username});
    } else if (req.session.privilege == 'Administrator'){
        res.render('adminUsers', {'username': req.session.username, 'status': req.session.status,'privilege' : req.session.privilege});
    } else {
        res.render('users', {'username': req.session.username, 'status': req.session.status,'privilege' : req.session.privilege});
    }
};
