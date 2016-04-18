// /*
// <<<<<<< HEAD
//  * Created by Jin Gu 04/16/2016
// =======
//     Created by Jin Gu 04/16/2016
// >>>>>>> 2b22c24997d9008787bba84cec245ea71a5fc565
//  */
//
// var Location = require('../module/Location.js');
// var location = new Location();
//
// <<<<<<< HEAD
// exports.getLocations = function (req, res) {
//     location.get(function (err, locations) {
//         if (err) {
//             res.json({"locationInfo": locations, "statusCode": 200, "message": "Success"})
//         } else {
//             res.json({"locationInfo": null, "statusCode": 400, "message": "Fail"})
//         }
//     });
// };
//
// exports.updateLocation = function (req, res) {
//     var time = now();
//     location.add(req.body.name, req.body.longitude, req.body.latitude, req.body.type, time, function (updatename, code) {
//         if (code == 200) {
//             res.json({"statusCode": 200, "message": "Success"});
//         }
//     });
// };
//
// exports.deleteLocation = function (req, res) {
//     location.delete(req.body.name, function (name, code) {
//         if (code == 400) {
//             res.json({"statusCode": 400, "message": "Fail"});
//         } else {
//             res.end();
//         }
//     });
// };
//
// function now() {
//     var date = new Date();
//     var time = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
//         + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
// =======
// exports.getLocations = function(req, res) {
//     location.get(function(locations, code) {
//        if(code == 200) {
//            res.json({"locationInfo":locations, "statusCode":200, "message":"Success"})
//        } else {
//            res.json({"locationInfo":null, "statusCode":400, "message":"Fail"})
//        }
//     });
//
// }
//
// exports.updateLocation = function(req, res) {
//     var time = now();
//     location.add(req.body.name, req.body.longitude, req.body.latitude, req.body.type, time, function(updatename, code) {
//        if(code == 200) {
//            res.json({"statusCode":200, "message": "Success"});
//        }
//     });
// }
//
// /*exports.deleteLocation = function(req, res) {
//     //maybe just a name is okay
//     location.delete(req.body.name, req.body.longitude, req.body.latitude, req.body.type, function(updatename, code) {
//         if(code == 200) {
//             res.json({"statusCode":200, "message": "Success"});
//         } else {
//             res.json({"statusCode":400, "message": "Fail"});
//         }
//     });
// }*/
//
//
// function now() {
//     var date = new Date();
//     var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
// >>>>>>> 2b22c24997d9008787bba84cec245ea71a5fc565
//     return time;
// }