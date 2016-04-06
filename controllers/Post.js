/**
 * Created by congshan on 4/6/16.
 */
var User = require('../module/User.js');
var user = new User();

var Post = require('../module/Post.js');
var post = new Post();

exports.directPost = function(req,res){
    console.log("loggedIn = " + req.session.loggedIn);
    if (!req.session.loggedIn) {
        res.render('index', {'username': req.session.username});
    } else {
        res.render('posts', {'username': req.session.username, 'status': req.session.status});
    }
};

exports.getPosts = function(req, res) {
    post.getAllPosts(function(data) {
        res.json(data);
    });
};

exports.getPostsByUsername = function(req, res) {
    var username = req.body.postUsername;
    console.log(username);
    post.getPostsByUsername(username, function(data) {
        res.json(data);
    });
};

exports.sendPost = function(req, res, io) {
    var pst = req.body;
    pst.time = now();
    pst.status = req.session.status;
    post.addPost(pst.username, pst.status, pst.content, pst.time, function(callback){
        if (callback == 200) {
            console.log("200 OK",pst.username, pst.status, pst.content, pst.time);
            io.emit('send post', pst);
        }
    });
};

function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}