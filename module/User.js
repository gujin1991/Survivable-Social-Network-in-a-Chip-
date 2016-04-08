/**
 * Created by guangyu on 2/21/16.
 */
var UserDb = require('./UserDb.js');

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

User.prototype.updateStatus = function (status, callback) {
    this.status = status;
    this.userDb.updateStatus(this.userName, status, callback);
};

User.prototype.getUserInfo = function (userName, callback) {
    this.userDb.getUserInfo(userName, function (err, dbData) {
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

User.prototype.addGroup = function(userName, callback) {
    this.userDb.addGroup(userName, userName, function(code) {
        callback(code);
    });
};

User.prototype.addGroupUser = function(GroupName, username, callback) {
    this.userDb.addGroupUser(GroupName, username, function(code) {
        callback(code);
    });
}


User.prototype.getGroup_User = function(userName, callback) {
    this.userDb.getGroup_DB(userName, function(code) {
        callback(code);
    });
};

User.prototype.deleteGroup_User = function (groupName, callback) {
    this.userDb.deleteGroup_DB(groupName, callback);
};


module.exports = User;