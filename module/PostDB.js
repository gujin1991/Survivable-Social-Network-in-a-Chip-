/**
 * Created by congshan on 4/6/16.
 */
var sqlite3 = require('sqlite3').verbose();

function PostDB() {
    this.db = new sqlite3.Database('./fse.db');
}
/**
 * @function postAdd: add a post to the database.
 * */
PostDB.prototype.postAdd = function (username, status, content, time, callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.run("CREATE TABLE IF NOT EXISTS posts (postId INTEGER PRIMARY KEY AUTOINCREMENT, userName TEXT, status TEXT, time TEXT, content TEXT)");
        var insertPost = dbTemp.prepare("insert into posts Values(?, ?, ?, ?, ?)");
        insertPost.run(null, username, status, time, content);
        callback(200);
    });
};
/**
 * @function getAllPosts: get all posts from the database.
 * */
PostDB.prototype.getAllPosts = function (callback) {
    var dbTemp = this.db;
    dbTemp.serialize(function () {
        dbTemp.all("SELECT * FROM posts", function (err, rows) {
            callback(rows);
        })
    });
};

PostDB.prototype.getPostsByUsername = function (username, callback) {
    var dbTemp = this.db;
    var q = "SELECT * FROM posts WHERE userName = \"" + username + "\"";

    dbTemp.serialize(function () {
        dbTemp.all(q, function (err, rows) {
            callback(rows);
        })
    });
};

//PostDB.prototype.getPostByKey = function (strArr, callback) {
//    var dbTemp = this.db;
//
//    var q = "SELECT * FROM posts WHERE content Like \'%" + strArr.join('%\' and content Like \'%') + '%\'';
//
//    dbTemp.serialize(function () {
//        dbTemp.all(q, function (err, rows) {
//            callback(rows);
//        })
//    });
//};

module.exports = PostDB;