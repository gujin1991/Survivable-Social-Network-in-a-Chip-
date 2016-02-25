var express = require('express');
var path = require('path');
var http = require('http');
var ejs = require('ejs');
var url = require('url');

// TODO: Add all controllers here
var signInCtl = require('./Controllers/JoinCommunity.js');
var chatPublicly = require('./Controllers/ChatPublicly.js');
var shareStatus = require('./Controllers/ShareStatus.js');


var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); //pull information from HTML POST(express 4)
var session = require('express-session');

var app = express();

var server = app.listen(3001,function(){
    console.log('Listening on port %d',server.address().port);
});

var io = require('socket.io')(server);
//used to keep the status of online or offline users~
//var loggedInUsers = []
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
    signInCtl.logout(req,res);
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

//app.get('/getUsers', checkSignIn.getOfflineUsers);



app.post('/sendPublicMessage',function(req,res){
    chatPublicly.sendPublicMessage(req,res,io);
});


io.on('connection', function(socket) {
    var myname;

    socket.on('login', function(username) {
        myname = username;
        socket.username = username;

        signInCtl.addLoggedInUsers(socket.username);
        //console.log("log in USER NAME:" + loggedInUsers);
        //chatPublicly.getOfflineUserIo(loggedInUsers,io);
        signInCtl.getOfflineUserIo(io);
    });

    //this part need to be modified.. we can add io to the log out api..
    //tomorrow.
    socket.on('disconnect',function(){
        console.log('disconnect : ' + socket.username);

        signInCtl.deleteLoggedInUsers(socket.username);
       //chatPublicly.getOfflineUserIo(loggedInUsers,io);
        signInCtl.getOfflineUserIo(io);
    });

});

//share status
app.post('/updateStatus', function(req, res){
    shareStatus.updateStatus(req, res,io);
});

app.get('/electStatus', function(req, res){
    shareStatus.electStatus(req,res);
});
