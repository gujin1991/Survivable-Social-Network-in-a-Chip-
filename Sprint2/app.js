var express = require('express');
var path = require('path');
var http = require('http');
var ejs = require('ejs');
var url = require('url');

// TODO: Add all controllers here
var signInCtl = require('./Controllers/joinCommunity.js');
var chatPublicly = require('./Controllers/chatPublicly');

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
    signInCtl.directHome(req,res);
});

app.get('/index', function(req, res){
    signInCtl.direct(req,res);

});

//direct to login page
app.get('/signin', function(req, res){
    signInCtl.directSignin(req,res);
});

//direct to login page
app.get('/signup', function(req, res){
    signInCtl.directSignup(req,res);

});


app.get('/logout',function(req, res) {
    signInCtl.logout(req,res,loggedInUsers);
});

// direct to chat page
app.post('/signin', function(req, res){
    signInCtl.checkSignIn(req, res);
});

app.post('/signup', function(req, res) {
    signInCtl.register(req, res);
});

app.get('/getHistory', function(req, res) {
    chatPublicly.getPublicMessages(req,res);
});

app.get('/getUsers', chatPublicly.getOfflineUsers);

var server = app.listen(3001,function(){
	console.log('Listening on port %d',server.address().port);
});

var io = require('socket.io')(server);

app.post('/sendPublicMessage',function(req,res){
    chatPublicly.sendPublicMessage(req,res,io);
});


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

