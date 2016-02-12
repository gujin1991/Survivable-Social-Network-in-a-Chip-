var express = require('express');
var path = require('path');
var http = require('http');
var ejs = require('ejs');
var url = require('url');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.engine('.html', ejs.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(request, response, next) {
    next();
})
// direct to sign in page
app.get('/', function(req, res){
    res.render('signin');
});
// direct to chat page
app.post('/', function(req, res){
    var username = req.body.username;
    res.render('index', {'username':username});
});
// load the chat history
app.get('/getHistory', function(req, res) {
    db.all("SELECT * FROM history", function(err, rows) {
        res.json(rows);
    })
});

var server = app.listen(3001,function(){
	console.log('Listening on port %d',server.address().port);
});

var io = require('socket.io')(server);

var dbFile = './history.db';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

io.on('connection', function(socket) {
    var myname;
    socket.on('login', function(username) {
        myname = username;
        console.log('User ' + myname + ' log in!');
        io.emit('system_message', now(), myname + ' Enter the chatroom');
    });

    socket.on('send message', function(message) {
        console.log('message: ' + message);
        message.time = now();
        db.serialize(function() {
            db.run("CREATE TABLE IF NOT EXISTS history (username String, text String, time String)");
            var stmt = db.prepare("INSERT INTO history VALUES (?, ?, ?)");
            stmt.run([message.username,message.text, message.time]);
            stmt.finalize();
        });
        io.emit('send message', message);
    });

    socket.on('disconnect', function(){
        console.log('User ' + myname + " left the room.");
        io.emit('system_message', now(), myname + ' Left the chatroom');
    });
});

//get current time
function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}
