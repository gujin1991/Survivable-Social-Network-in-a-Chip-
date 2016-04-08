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

var groupChat = require('./controllers/GroupChat.js')

//save all the socket with the name of it's name.
var sockets = {};

//save all current the group users here.
var groupUsers = [];

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

//direct to announcement page
app.get('/announcement', function(req, res){


    if(!testModeFlag) postAnnouce.directAnnouncement(req, res);
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


    if(!testModeFlag) postAnnouce.getAnnouncements(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});

//post announcement
app.post('/sendAnnouncements',function(req,res){


    if(!testModeFlag) postAnnouce.sendAnnouncements(req,res,io);
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
app.post('/testModeStart',function(req,res){
    if(testModeFlag){
        res.json({"statusCode": 410, "message": "Already in Test"});
    }else {
        // if(req.body.duration >  5) res.json({"statusCode": 412, "message": "Time Exceed"});
        // else {
            testModeFlag = true;
            res.json({"statusCode": 200, "message": "Success"});
        //}
    }
});

//used for unexpected stops or mannual stops.
app.post('/testModeQuit',function(req,res){
    if(testModeFlag){
        testModeFlag = false;
        measurePerformance.reset();
        res.json({"statusCode": 200, "message": "Success"});
    }else {

        res.json({"statusCode": 411, "message": "Not in Test Mode"});

    }
});



app.post('/testPost', function(req,res) {
    if(testModeFlag) measurePerformance.sendTestMessage(req,res);
    else res.json({"statusCode": 411, "message": "Not in Test Mode"});

    //measurePerformance.sendTestMessage(req,res);
});

//get getCount
app.get('/testGet', function(req,res) {
    if(testModeFlag) measurePerformance.getTestMessages(req,res);
    else res.json({"statusCode": 411, "message": "Not in Test Mode"});
    //measurePerformance.getTestMessages(req,res);
});

//end measurePerformance , used for normal stops.
app.post('/endMeasurePerformance', function(req, res) {
    if(testModeFlag) {
        testModeFlag = false;
        measurePerformance.endMeasurePerformance(req,res);
    }
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

app.post('/sendGroupInvitation', function(req, res) {
    groupChat.addNewGroupUser(req,res);
    console.log("sender" + req.body.sender);
    console.log("sender" + req.body.receiver);
    console.log("sender" + req.body.groupName);
    var invitaion = {'sender': req.body.sender, 'receiver':req.body.receiver, 'groupName':req.body.groupName};
    io.emit('get group invitation', invitaion);
});

//send message
app.post('/groupChat',function(req,res){
    //console.log('good'+ req.body.receiver);
    //console.log('good'+ groupUsers);
    if(!testModeFlag) {
        groupChat.sendGroupMessage(req, res,io);
        
    }
    else res.json({"statusCode": 410, "message": "In Test"});
});


//get previous group chat message
app.get('/getGroupMessage',function(req,res){


    if(!testModeFlag) groupChat.getMessages(req,res);
    else res.json({"statusCode": 410, "message": "In Test"});
});


//end the group chat
app.post('/endGroupChat', function(req,res) {
    if(!testModeFlag) groupChat.endGroupChat(req,res,io);
    else res.json({"statusCode": 410, "message": "In Test"});
});



//direct to group chat page
app.get('/groupChat', function(req, res){


    if(!testModeFlag){
        if (req.session.loggedIn) {
            res.render('groupChat', {'username': req.session.username, 'status': req.session.status});
        } else {
            res.render('signin');
        }
    }
    else res.json({"statusCode": 410, "message": "In Test"});
});

//direct to group page
app.get('/groupPage', function(req, res){

    console.log(req.query.hostname);
    if(!testModeFlag){
        if (req.session.loggedIn) {
            console.log("true");

            res.render('groupPage', {'username': req.session.username, 'status': req.session.status, 'hostname':req.query.hostname});
        } else {
            res.render('signin');
        }
    }
    else res.json({"statusCode": 410, "message": "In Test"});
});

app.post('/createNewGroup', function(req, res) {
    console.log(req.body.groupName + "test");
    groupChat.addNewGroup(req,res);

});


/*app.post('/addGroupUser', function(req, res) {
    console.log(req.body.userName + "testUser");
    groupChat.addNewGroupUser(req,res);

});*/

app.get('/getGroup', function(req,res) {
    console.log(req + "getGroup");
    groupChat.getGroup(req,res);
});



