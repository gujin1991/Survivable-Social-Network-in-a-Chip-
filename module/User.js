/**
 * Created by guangyu on 2/21/16.
 */
var UserDb = require('./UserDb.js');

function User() {
    this.userName = null;
    this.password = null;
    this.status = null;
    this.userDb = new UserDb();
    this.oldUsername = null;
    this.privilege = null;
    this.accountStatus = null;
}

User.prototype.initialize = function (userName, password, status,privilege,accoountStatus,nickName) {
    this.userName = userName;
    this.password = password;
    this.status = status;
    this.accountStatus = accoountStatus;
    this.privilege = privilege;
    this.nickName = nickName;
    return this;
};

User.prototype.initializeForAdmin = function (oldUsername,username,password, privilege,accountStatus) {
    this.userName = username;
    this.password = password;
    this.oldUsername = oldUsername;
    this.privilege = privilege;
    this.accountStatus = accountStatus;
    return this;
};


User.prototype.updateProfileByAdmin = function (callback) {
    this.userDb.updateProfile(this.oldUsername, this.userName ,this.password,this.privilege , this.accountStatus,callback);
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
            //this.userName = dbData.userName;
            //this.status = dbData.status;
            //this.accountStatus = dbData.accountStatus;
            //this.privilege = dbData.privilege;
            callback(null, dbData);
        }

        return this;
    });
};

User.prototype.getUserProfile = function (userName, callback) {
    this.userDb.getUserProfile(userName, function (err, dbData) {
        if (err) {
            callback(400, null);
        } else {
            callback(null, dbData);
        }

        return this;
    });
};

module.exports = User;