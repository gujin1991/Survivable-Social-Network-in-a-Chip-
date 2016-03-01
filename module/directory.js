var UserDb = require('./userDB.js');
var User = require('./User.js')


var directory = new function Directory(){
    this._loggedInUsers = [];
    this._newUsers = {};
    this._dataUsers = [];
    this.userDb = new UserDb();

    this.addLoggedInUsers = function (user) {
        this._loggedInUsers.push(user);
        this._newUsers[user.userName] =  user;
        this._dataUsers.push(user.userName);

    };

    //new added
    this.update = function(username,status,callback){

        console.log("***********************"+ username);
        console.log("***********************"+ status);

        log = [];
        for (var key in this._newUsers){
            console.log("print the list in update **********************" + key);
            log.push(this._newUsers[key]);
        }
        //console.log(user);
        var user = this._newUsers[username];
        console.log("user === **************" +user);
        user.updateStatus(status,callback);
        this._newUsers[username] = user;
    };

    this.deleteLoggedInUsers = function(user){
        console.log("delete **************************** " + user.userName);
        var index = this._loggedInUsers.indexOf(user);
        if (index > -1) {
            this._loggedInUsers.splice(index, 1);
        }
        var index = this._dataUsers.indexOf(user.userName);
        if (index > -1) {
            this._dataUsers.splice(index, 1);
        }
        delete this._newUsers[user.userName];
    };

    this.getOnlineUsers = function(callback){
        log = [];
        for (var key in this._newUsers){
            console.log("print the list in get online **********************" + key);
            log.push(this._newUsers[key]);
        }
        callback(log);
    };

    this.getOfflineUsers = function(callback){
        this.userDb.getOfflineUsers(this._dataUsers,callback);
    };


};

module.exports = directory;