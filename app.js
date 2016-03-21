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
var measurePerformance = require('./controllers/MeasurePerformance.js');

//save all the socket with the name of it's name.
var sockets = {}

//flag represents test mode
var testModeFlag = false;

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
    if(!testModeFlag) signInCtl.directHome(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

app.get('/index', function(req, res){

    if(!testModeFlag) signInCtl.direct(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});

});

//direct to login page
app.get('/signin', function(req, res){

    if(!testModeFlag) signInCtl.directSignin(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

//direct to login page
app.get('/signup', function(req, res){

    if(!testModeFlag) signInCtl.directSignup(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});


app.get('/logout',function(req, res) {

    if(!testModeFlag) signInCtl.logout(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});



// direct to chat page
app.post('/signin', function(req, res){


    if(!testModeFlag) signInCtl.checkSignIn(req, res);
    else res.json({"statusCode": 410, "message": "In Test"});
});


app.post('/signup', function(req, res) {

    if(!testModeFlag) signInCtl.register(req, res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

//direct to annoucement page
app.get('/announcement', function(req, res){


    if(!testModeFlag) postAnnouce.directAnnoucement(req, res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

app.get('/getHistory', function(req, res) {

    if(!testModeFlag) chatPublicly.getPublicMessages(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

app.get('/users', function(req, res) {

    if(!testModeFlag) userListCtl.directUserList(req, res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

app.get('/measurePerformance', function(req, res) {
    /* TODO: code added just for build UI, might need modification later
     *       Redirect to meadure performance page
     * */
    if(!testModeFlag) measurePerformance.directMeasurePerformance(req, res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

//app.get('/getUsers', checkSignIn.getOfflineUsers);


app.post('/getStatus',function(req,res){

    if(!testModeFlag)  signInCtl.getUserInfo(req.body.username,function(callback){
        //socket.user = callback;
        if(callback == 400){
            res.json({"statusCode":400, "message": "Fail" });
        }else{
            req.session.status = callback.status;
            console.log("test status ----------------------------- " + req.body.username + "      "+ req.session.status);
            res.json({"statusCode":200, "message": "Success" ,"status":callback.status});
        }

    });
    else res.json({"statusCode": 410, "message": "In Test"});


});



app.post('/sendPublicMessage',function(req,res){


    if(!testModeFlag) chatPublicly.sendPublicMessage(req,res,io);
    else res.json({"statusCode": 410, "message": "In Test"});
});

//share status
app.post('/updateStatus', function(req, res){


    if(!testModeFlag) shareStatus.updateStatus(req, res,io);
    else res.json({"statusCode": 410, "message": "In Test"});
});


//get announcement
app.get('/getAnnouncements', function(req, res){


    if(!testModeFlag) postAnnouce.getAnnoucements(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

//post announcement
app.post('/sendAnnouncements',function(req,res){


    if(!testModeFlag) postAnnouce.sendAnnoucements(req,res,io);
    else res.json({"statusCode": 410, "message": "In Test"});
});


//direct to private char page
app.get('/chatPrivately', function(req, res){


    if(!testModeFlag){
        if (req.session.loggedIn) {
            res.render('chatPrivately', {'username': req.session.username, 'status': req.session.status});
        } else {
            res.render('signin');
        }
    }
    else res.json({"statusCode": 410, "message": "In Test"});
});


app.get('/userList', function(req,res){


    if(!testModeFlag) signInCtl.getOfflineUserIo(req,io);
    else res.json({"statusCode": 410, "message": "In Test"});
});

//store status in session

//app.post('/storeStatus',function(req,res){
//    req.session.status = req.body.status;
//    console.log("test status -----------------------------!!!!!!" + req.session.status);
//    res.json({"statusCode":200, "message": "Success"});
//});



//chat privately
app.post('/chatPrivately',function(req,res){



    if(!testModeFlag) chatPrivately.sendPrivateMessage(req,res,sockets[req.body.receiver],sockets[req.body.sender],sockets);
    else res.json({"statusCode": 410, "message": "In Test"});
});

//get previous privately chat message
app.post('/getPrivateMessage',function(req,res){


    if(!testModeFlag) chatPrivately.getPrivateMessages(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});



//search information use case.
app.post('/searchUser', function(req,res){


    if(!testModeFlag)  searchCtl.getUsersByName(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});


app.post('/searchStatus',function(req,res){


    if(!testModeFlag) searchCtl.getUsersByStatus(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

app.post('/searchAnnouncement',function(req,res){


    if(!testModeFlag) searchCtl.searchAnnouncement(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
})

app.post('/searchPublic',function(req,res){


    if(!testModeFlag)  searchCtl.searchPublic(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
})

app.post('/searchPrivate',function(req,res){

    if(!testModeFlag) searchCtl.searchPrivate(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
})



//get postCount
app.post('./testModeEnter',function(req,res){
    if(testModeFlag){
        res.json({"statusCode": 410, "message": "Already in Test"});
    }else {
        testModeFlag = true;
        res.json({"statusCode": 200, "message": "Success"});
    }
});

app.post('./testModeQuit',function(req,res){
    if(testModeFlag){
        testModeFlag = false;
        res.json({"statusCode": 200, "message": "Success"});
    }else {
        res.json({"statusCode": 411, "message": "Not in Test Mode"});

    }
});


app.post('./testPost', function(req,res) {
    if(testModeFlag) measurePerformance.sendTestMessage(req,res);
    else res.json({"statusCode": 411, "message": "Not in Test Mode"});
});

//get getCount
app.get('./testGet', function(req,res) {
    if(testModeFlag) measurePerformance.getTestMessages(req,res);
    else res.json({"statusCode": 411, "message": "Not in Test Mode"});
});

//end measurePerformance
app.post('./endMeasurePerformance', function(req, res) {
    if(testModeFlag) measurePerformance.endMeasurePerformance(req,res);
    else res.json({"statusCode": 411, "message": "Not in Test Mode"});
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