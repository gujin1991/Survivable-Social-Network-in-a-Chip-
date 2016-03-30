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
    this.email = null;
    this.firstname = null;
    this.lastname = null;
    this.skill = null;
    this.gender = null;
    this.oldpassword = null;
}

User.prototype.initialize = function (userName, password, status) {
    this.userName = userName;
    this.password = password;
    this.status = status;
    return this;
};

//new added function for change profile.. to instaniate a new user object
User.prototype.initializeForChangeFile = function (userName, email,firstname,lastname,skill,gender) {
    this.userName = userName;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.skill =  skill;
    this.gender = gender;
    return this;
};

User.prototype.initializeForChangePassword = function (userName, oldpassword,password) {
    this.userName = userName;
    this.oldpassword =oldpassword;
    this.password = password;
    return this;
};

//update those information to databse
User.prototype.updateProfile = function (callback) {
    this.userDb.updateProfile(this.userName, this.email ,this.firstname,this.lastname , this.skill,this.gender ,callback);
};

//update password to database
User.prototype.updatePassword = function (callback) {
    this.userDb.updatePassword(this.userName, this.oldpassword ,this.password,callback);
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