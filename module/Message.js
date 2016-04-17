var MessageDb = require('./MessageDb.js');

function Message(username, message, time) {
    this.username = username;
    this.message = message;
    this.time = time;
    this.messageDb = new MessageDb();
}

Message.prototype.addMessage = function (username, message, time, status,nickName,callback) {
    this.messageDb.messageAdd(username, message, time, status,nickName, callback);
};

Message.prototype.getHistory = function (callback) {
    this.messageDb.getHistory(callback);
};

Message.prototype.getHistoryByKey = function (keyword, callback) {
    this.messageDb.getHistoryByKey(keyword, callback);
};

Message.prototype.updateUserName = function(oldUsername,username) {
    this.messageDb.updatePublicUserName(oldUsername,username);
}

Message.prototype.deleteByUsername = function(username) {
    this.messageDb.deleteByUsername(username);
}

Message.prototype.deleteByUsernamePrivate = function(username) {
    this.messageDb.deleteByUsernamePrivate(username);
}


module.exports = Message;