var UserDb = require('./UserDB.js');

var directory = new function Directory(){
    this._loggedInUsers = [];
    this.userDb = new UserDb();
    this.addLoggedInUsers = function (user) {
        this._loggedInUsers.push(user);
    };

    this.deleteLoggedInUsers = function(user){
        console.log("delete " + user);
        var index = this._loggedInUsers.indexOf(user);
        if (index > -1) {
            this._loggedInUsers.splice(index, 1);
        }
    };

    this.getOnlineUsers = function(callback){
        callback(this._loggedInUsers);
    }

    this.getOfflineUsers = function(callback){
        this.userDb.getOfflineUsers(this._loggedInUsers,callback);
    }

    //new added
    this.updateStatus = function(username,status,callback){
        var user = this._loggedInUsers[username];
        user.updateStatus(status,callback);
    }

    this.getAllStatus = function(){

    }
};





module.exports = directory;