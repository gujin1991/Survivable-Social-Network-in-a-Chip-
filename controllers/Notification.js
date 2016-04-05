/**
 * Created by guangyu on 4/4/16.
 */
exports.getNotification = function (req, res) {
    if (!req.session.loggedIn) {
        res.render('index', {'username': req.session.username});
    } else {
        res.render('notification', {'username': req.session.username, 'status': req.session.status})
    }
};

exports.postNotification = function (req, res, io) {
    if (!req.session.loggedIn) {
        res.render('index', {'username': req.session.username});
    } else {
        var notification = req.body;
        io.emit('broadcast notification', notification);
    }
};