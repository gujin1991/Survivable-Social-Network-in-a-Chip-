/**
 * Created by congshan on 4/15/16.
 */
var Privilege = require('../module/Privilege');
var Location = require('../module/Location.js');
var loc = new Location();
var counter = {};
function Map() {
    counter['medicine'] = 0;
    counter['food'] = 0;
    counter['water'] = 0;
}

Map.prototype.directMap = function (req, res) {
    console.log("req user name " + req.params.username);
    if (req.session.privilege != new Privilege().administrator) { // citizen
        res.render('userMap', {'username': req.session.username, 'status': req.session.status});
    } else { // admin
        res.render('adminMap', {'username': req.session.username, 'status': req.session.status});
    }
};

Map.prototype.addMark = function (req, res, io) {
    var type = req.body.type;
    var name = req.body.name;
    var status = req.body.status;
    if (type != 'user') {
        var count = parseInt(counter[type]) + 1;
        counter[type] = count;
        name = type + count;
    }

    var location = JSON.parse(req.body.location);
    var time = now();
    loc.addLocation(name, status, location.x, location.y, type, time, function (name, code) {
        res.end();
    });
    loc.getLocation(function (err, newLocations) {
        if (err) {
            //TODO
        } else {
            io.emit("updateMap", newLocations)
        }
    });
};

function now() {
    var date = new Date();
    var time = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
        + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}

module.exports = Map;