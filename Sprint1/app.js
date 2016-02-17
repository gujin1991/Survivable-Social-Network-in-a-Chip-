var express = require('express');
var path = require('path');
var http = require('http');
var ejs = require('ejs');
var url = require('url');

//get database
var userDB = require('./module/userDB.js');
var userDb = new userDB();

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); //pull information from HTML POST(express 4)
var session = require('express-session');

var app = express();

//used to keep the status of online or offline users~
var loggedInUsers = []
//var loggedOutUsers = []

// view engine setup
app.engine('.html', ejs.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret : 'app', cookie : {maxAge : 3600000 }}));

app.use(function(request, response, next) {
    next();
})

app.get('/', function(req, res){
    if (!req.session.loggedIn) {
        res.render('signin');
    } else {
        res.render('index', {'username': req.session.username});
    }
});

app.get('/index', function(req, res){
    res.redirect('/');
});

//direct to login page
app.get('/signin', function(req, res){
    if (req.session.loggedIn) {
        res.render('index', {'username': req.session.username});
    } else {
        res.render('signin');
    }
});

//direct to login page
app.get('/signup', function(req, res){
    if (req.session.loggedIn) {
        res.render('index', {'username': req.session.username});
    } else {
        res.render('signup');
    }
});

app.get('/logout', function(req, res) {
    var myname = req.session.username;
    console.log('User ' + myname + " left the room.");

    var index = loggedInUsers.indexOf(myname);
    if (index > -1) {
        loggedInUsers.splice(index, 1);
    }

    console.log(loggedInUsers);
    req.session.destroy();
    res.redirect('/');
});


// direct to chat page
app.post('/signin', function(req, res){
    var username = req.body.username;
    var password = req.body.password;

    userDb.userAuth(username,password,function(result){
        console.log(result);
        if (result == 200){
            //return success.
            req.session.username = req.body.username;
            req.session.loggedIn = true;
            res.json({"statusCode":200, "message": "success"});

        }else if (result == 401){
            res.json({"statusCode":401, "message": "No user found"});
        } else {
            res.json({"statusCode":403, "message": "Password and User not match"});
        }
    });

});

app.post('/signup', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var status = req.body.userstatus;
    userDb.userAdd(username, password,status,function(result) {
        if (result == 400) {
            res.json({"statusCode":400, "message": "User existed"});
        } else {
            req.session.username = req.body.username;
            req.session.loggedIn = true;
            res.json({"statusCode":200, "message": "Success"});
        }
    });
});

// load the chat history
app.get('/getHistory', function(req, res) {
    userDb.getHistory(function(data){
        //console.log(data);
        res.json(data);
    });
});


app.get('/getUsers', function(req,res){
    userDb.getOfflineUsers(loggedInUsers,function(offUsers){
        var offU = [];
        for (var i = 0 ; i < offUsers.length;i++){
            offU.push(offUsers[i].userName);
        }
        console.log("inside  get user api : loged in  -----" + loggedInUsers + "    logged out ----"+  offU);
        res.json({"online":loggedInUsers,"offline":offU});
    });

});

var server = app.listen(3001,function(){
	console.log('Listening on port %d',server.address().port);
});

var io = require('socket.io')(server);


io.on('connection', function(socket) {
    var myname;

    socket.on('login', function(username) {
        myname = username;
        socket.username = username;
        if(loggedInUsers.indexOf(myname)== -1){
            loggedInUsers.push(myname);
        }
        console.log("log in USER NAME:" + loggedInUsers);
        updateList();
    });


    //socket.on('get users',function(message){
    //    message.online(loggedInUsers);
    //
    //    userDb.getOfflineUsers(loggedInUsers,function(offUsers){
    //        var offU = [];
    //        for (var i = 0 ; i < offUsers.length;i++){
    //            offU.push(offUsers[i].userName);
    //        }
    //        message.offline(offU);
    //    });
    //
    //    io.emit('get users',message);
    //});


    socket.on('send message', function(message) {
        console.log('message: ' + message);
        message.time = now();

        userDb.messageAdd(message.username,message.text,message.time,function(callback){
            if (callback == 200) console.log(message.username,message.text,message.time);
        });
        io.emit('send message', message);
    });


    socket.on('disconnect',function(data){
        console.log('disconnect : ' + socket.username);
        var index = loggedInUsers.indexOf(socket.username);
        if (index > -1) {
            loggedInUsers.splice(index, 1);
        }
        updateList();
    });

    function updateList(){
        var message  = {};
        userDb.getOfflineUsers(loggedInUsers,function(offUsers){
            var offU = [];
            for (var i = 0 ; i < offUsers.length;i++){
                offU.push(offUsers[i].userName);
            }

            console.log("inside dynamic update : loged in  -----" + loggedInUsers + "    logged out ----"+  offU);
            message.online = loggedInUsers;
            message.offline = offU;
            io.emit('updatelist',message);
        });
    }

});

//get current time
function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}
