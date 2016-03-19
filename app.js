var express = require('express');
var path = require('path');
var http = require('http');
var ejs = require('ejs');
var url = require('url');

// TODO: Add all controllers here
var signInCtl = require('./controllers/JoinCommunity.js');
var chatPublicly = require('./controllers/ChatPublicly.js');
var shareStatus = require('./controllers/ShareStatus.js');
var userListCtl = require('./controllers/UserList.js');
var chatPrivately = require('./controllers/ChatPrivately.js');
var postAnnouce = require('./controllers/PostAnnouncement.js');

var searchCtl = require('./controllers/SearchInformation.js');

//save all the socket with the name of it's name.
var sockets = {}

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

//direct to annoucement page
app.get('/announcement', function(req, res){

    postAnnouce.directAnnoucement(req, res);
});

app.get('/getHistory', function(req, res) {
    chatPublicly.getPublicMessages(req,res);
});

app.get('/users', function(req, res) {
    userListCtl.directUserList(req, res);
});

//app.get('/getUsers', checkSignIn.getOfflineUsers);


app.post('/getStatus',function(req,res){

    signInCtl.getUserInfo(req.body.username,function(callback){
        //socket.user = callback;
        if(callback == 400){
            res.json({"statusCode":400, "message": "Fail" });
        }else{
            req.session.status = callback.status;
            console.log("test status ----------------------------- " + req.body.username + "      "+ req.session.status);
            res.json({"statusCode":200, "message": "Success" ,"status":callback.status});
        }

    });
});



app.post('/sendPublicMessage',function(req,res){
    chatPublicly.sendPublicMessage(req,res,io);
});

//share status
app.post('/updateStatus', function(req, res){
    shareStatus.updateStatus(req, res,io);
});


//get announcement
app.get('/getAnnouncements', function(req, res){
    postAnnouce.getAnnoucements(req,res);
});

//post announcement
app.post('/sendAnnouncements',function(req,res){
    postAnnouce.sendAnnoucements(req,res,io);
});


//direct to private char page
app.get('/chatPrivately', function(req, res){
    if (req.session.loggedIn) {
        res.render('chatPrivately', {'username': req.session.username, 'status': req.session.status});
    } else {
        res.render('signin');
    }
});


app.get('/userList', function(req, res){
    signInCtl.getOfflineUserIo(req,res,io);
});

//store status in session

//app.post('/storeStatus',function(req,res){
//    req.session.status = req.body.status;
//    console.log("test status -----------------------------!!!!!!" + req.session.status);
//    res.json({"statusCode":200, "message": "Success"});
//});



//chat privately
app.post('/chatPrivately',function(req,res){

    console.log(req.body.receiver);
    console.log(req.body.sender);
    chatPrivately.sendPrivateMessage(req,res,sockets[req.body.receiver],sockets[req.body.sender],sockets);
});

//get previous privately chat message
app.post('/getPrivateMessage',function(req,res){
    chatPrivately.getPrivateMessages(req,res);
});


//search information use case.
app.post('/searchUser', function (req,res) {
    searchCtl.getUsers();
});



io.on('connection', function(socket) {
    var myname;
    //var user;
    socket.on('login', function(username) {
        myname = username;
        signInCtl.getUserInfo(myname,function(callback){
            //socket.user = callback;
            socket.user = signInCtl.newUser(callback);
            sockets[myname] = socket;
            signInCtl.addLoggedInUsers(socket.user);
            signInCtl.getOfflineUserIo(socket.user,io);
        });
    });

    //this part need to be modified.. we can add io to the log out api..
    //tomorrow.
    socket.on('disconnect',function(){
        //console.log('disconnect : ' + socket.username);
        signInCtl.deleteLoggedInUsers(socket.user);
        //signInCtl.deleteLoggedInUsers(socket.username);
       //chatPublicly.getOfflineUserIo(loggedInUsers,io);
        signInCtl.getOfflineUserIo(socket.user,io);
        delete sockets[myname];
    });

});