var TestMessage = require('../module/TestMessage.js')
var testMessage = new TestMessage();

//var directoryy = require('../module/Directory.js')
//var directory = new directoryy();

exports.directMeasurePerformance = function(req, res) {
    console.log("loggedIn = " + req.session.loggedIn);

    if (!req.session.loggedIn) {
        res.render('index', {'username': req.session.username});
    } else {
        console.log("fine!");
        res.render('measurePerformance', {'username': req.session.username, 'status': req.session.status});
    }
};

exports.getTestMessages = function(req,res) {
    testMessage.getHistory(function(data){
        res.json({"message":data});
    });

}


exports.sendTestMessage = function(req,res) {
    var message = req.body;
    message.time = now();
    message.status = req.session.status;

    //console.log("display status------------------message status "+ message.username + "    "+req.session.status);

    testMessage.addMessage(message.username,message.text,message.time,req.session.status ,function(code, postCount){
        if (code == 200) {
            res.json({"statusCode":200, "message": "Success", "postCount": postCount});
        }
        else res.json({"statusCode":400, "message": "Fail", "postCount": postCount});
    });

}

exports.endMeasurePerformance = function(req,res) {
    testMessage.endMeasurement(function(postCount, getCount) {
        res.json({"postCount":postCount, "getCount":getCount});
    });
}



function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}