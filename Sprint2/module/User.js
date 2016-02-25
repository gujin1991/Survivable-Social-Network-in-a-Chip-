/**
 * Created by guangyu on 2/21/16.
 */
var UserDb = require('./UserDB.js');

function User() {
    this.userName = null;
    this.password = null;
    this.logged = false;
    this.userDb = new UserDb();
}

User.prototype.initialize = function (userName, password) {
    this.userName = userName;
    this.password = password;
    return this;
};

User.prototype.userAdd = function (callback) {
    this.userDb.userAdd(this.userName, this.password, callback);
};

User.prototype.exist = function (callback) {
    this.userDb.exist(this.userName, callback);
};

User.prototype.userAuth = function (callback) {
    this.userDb.userAuth(this.userName, this.password, callback);
};

//
//User.prototype.getHistory = function (callback) {
//    this.userDb.getHistory(callback);
//};

User.prototype.getOfflineUsers = function (onlineUsers, callback) {
    this.userDb.getOfflineUsers(onlineUsers, callback);
};

module.exports = User;