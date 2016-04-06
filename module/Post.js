/**
 * Created by congshan on 4/6/16.
 */
var PostDB = require('./PostDB.js');

function Post(username, status, content, time) {
    this.username = username;
    this.status = status;
    this.content = content;
    this.time = time;
    this._postDb = new PostDB();
}

Post.prototype.addPost =  function(username,status,content,time,callback) {
    this._postDb.postAdd(username, status, content, time, callback);
};

Post.prototype.getAllPosts = function (callback) {
    this._postDb.getAllPosts(callback);
};

Post.prototype.getPostsByUsername = function(username, callback) {
    this._postDb.getPostsByUsername(username, callback);
}
//Post.prototype.getDetailsByKey = function (strArr,callback) {
//    this._postDb.getPostByKey(strArr,callback);
//};

module.exports = Post;