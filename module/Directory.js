var UserDb = require('./UserDb.js');

var directory = new function Directory() {
    this._loggedInUsers = [];   // store the user object which logged in
    this._newUsers = {};        // key value pair
    this._dataUsers = [];       // store the user name which logged in.

    this.userDb = new UserDb();
    
    this.searchOffLine = function (keyword, callback) {
        this.userDb.getOfflineUsersByKey(keyword, this._dataUsers, callback);
    };

    this.searchOnlineUsers = function (keyword, callback) {
        log = [];
        for (var key in this._newUsers) {
            if (key.indexOf(keyword) != -1) log.push(this._newUsers[key]);
        }
        callback(log);
    };

    this.searchOffLineByStatus = function (keyword, callback) {
        this.userDb.getOfflineUsersByStatus(keyword, this._dataUsers, callback);
    };


    this.searchOnlineUsersByStatus = function (keyword, callback) {
        log = [];
        for (var key in this._newUsers) {
            if (this._newUsers[key].status == keyword)log.push(this._newUsers[key]);
        }
        callback(log);
    };

    this.addLoggedInUsers = function (user) {

        this._loggedInUsers.push(user);
        this._newUsers[user.userName] = user;
        this._dataUsers.push(user.userName);

    };

    this.update = function (username, status, callback) {
        log = [];
        for (var key in this._newUsers) {
            log.push(this._newUsers[key]);
        }
        var user = this._newUsers[username];
        user.updateStatus(status, callback);
        this._newUsers[username] = user;
    };

    this.deleteLoggedInUsers = function (user) {

        var index = this._loggedInUsers.indexOf(user);
        if (index > -1) {
            this._loggedInUsers.splice(index, 1);
        }

        index = this._dataUsers.indexOf(user.userName);
        if (index > -1) {
            this._dataUsers.splice(index, 1);
        }
        delete this._newUsers[user.userName];
    };

    this.getOnlineUsers = function (callback) {
        log = [];
        for (var key in this._newUsers) {
            log.push(this._newUsers[key]);
        }
        callback(log);
    };

    this.getOfflineUsers = function (callback) {
        this.userDb.getOfflineUsers(this._dataUsers, callback);
    };


    this.updateUserName = function (oldUsername,username){
        //this._loggedInUsers.push(user);
        //this._newUsers[user.userName] = user;
        //this._dataUsers.push(user.userName);

        if(this._newUsers[oldUsername] == null) return;
        else{
            var index = this._dataUsers.indexOf(oldUsername);
            if (index > -1) {
                this._dataUsers.splice(index, 1);
            }
            this._dataUsers.push(username);


            var user = this._newUsers[oldUsername];
            user.userName = username;
            delete this._newUsers[oldUsername];
            this._newUsers[user.userName] = user;


            index = this._loggedInUsers.indexOf(oldUsername);
            if (index > -1) {
                this._loggedInUsers.splice(index, 1);
            }
            this._loggedInUsers.push(username);

        }

    }

};

module.exports = directory;