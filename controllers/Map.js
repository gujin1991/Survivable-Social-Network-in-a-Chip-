/**
 * Created by congshan on 4/15/16.
 */
var Privilege = require('../module/Privilege');
var Location = require('../module/Location.js');
var location = new Location();

exports.directMap = function (req, res) {
    console.log("req user name " + req.params.username);
    if (req.session.privilege != new Privilege().administrator) { // citizen
        res.render('userMap', {'username': req.session.username, 'status': req.session.status});
    } else { // admin
        res.render('adminMap', {'username': req.session.username, 'status': req.session.status});
    }
};

exports.addMark = function (req, res, io) {
    var name = req.body.name;
    var type = req.body.type;
    var location = JSON.parse(req.body.location);
    location.addLocation(name, location.x, location.y, type, time, function (name, code) {
        res.end();
    });
    var newLocations = location.getLocation();
    io.emit("updateMap", newLocations)
};

function now() {
    var date = new Date();
    var time = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
        + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}