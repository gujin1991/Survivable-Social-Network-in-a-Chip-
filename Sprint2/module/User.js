/**
 * Created by guangyu on 2/21/16.
 */
var UserDb = require('./UserDB.js');

function User() {
    this.userName = null;
    this.password = null;
    this.logged = false;
    this.status = null;
    this.userDb = new UserDb();
}

User.prototype.initialize = function (userName, password, status) {
    this.userName = userName;
    this.password = password;
    this.status = status;
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

//new method add for update status
User.prototype.updateStatus = function(status, callback) {
    this.status = status;
    this.userDb.updateStatus(this.userName,status,callback);
};

User.prototype.getUserInfo = function(userName, callback) {
    this.userDb.getUserInfo(userName, function(err, dbData){
        if (err) {
            callback(400, null);
        } else {
            this.userName = dbData.userName;
            this.status = dbData.status;
            callback(null, dbData);
        }

        return this;
    });
};

module.exports = User;