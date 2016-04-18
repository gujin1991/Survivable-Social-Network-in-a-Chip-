/**
 * Created by guangyu on 2/26/16.
 */
var MessageDb = require('./MessageDb.js');
var Message = require('./Message.js');

PrivateMessage.prototype = new Message();
PrivateMessage.prototype.constructor = PrivateMessage;

function PrivateMessage(fromUser, toUser, message, time) {
    this.fromUser = fromUser;
    this.toUser = toUser;
    this.message = message;
    this.time = time;
    this.messageDb = new MessageDb();
}

PrivateMessage.prototype.addMessage = function (fromUser, toUser, message, time, status,senderNickname,receiverNickname, callback) {
    this.messageDb.privateMessageAdd(fromUser, toUser, message, time, status,senderNickname,receiverNickname,callback);
    // return this;
};

PrivateMessage.prototype.getHistory = function (fromUser, toUser, callback) {
    this.messageDb.getPrivateHistory(fromUser, toUser, callback);
};

PrivateMessage.prototype.getHistoryByKey = function (keyword, user, callback) {
    this.messageDb.getPrivateHistoryByKey(keyword, user, callback);
};

PrivateMessage.prototype.updateUserName = function(oldUsername,username) {
    this.messageDb.updatePrivateUserName(oldUsername,username);
}

PrivateMessage.prototype.deleteByUsernamePrivate = function(username) {
    this.messageDb.deleteByUsernamePrivate(username);
}


module.exports = PrivateMessage;