/**
 * Created by guangyu on 2/26/16.
 */
var MessageDb = require('./MessageDb.js');
var Message = require('./Message.js');

//TODO no need to inherent actually
PrivateMessage.prototype = new Message();
PrivateMessage.prototype.constructor = PrivateMessage;

function PrivateMessage(fromUser, toUser, message, time) {
    this.fromUser = fromUser;
    this.toUser = toUser;
    this.message = message;
    this.time = time;
    this.messageDb = new MessageDb();
}

PrivateMessage.prototype.addMessage = function (fromUser, toUser, message, time,status, callback) {
    this.messageDb.privateMessageAdd(fromUser, toUser, message, time, status,callback);
    return this;
};

PrivateMessage.prototype.getHistory = function (fromUser, toUser, callback) {
    this.messageDb.getPrivateHistory(fromUser, toUser, callback);
};

//new added function for get private history by key
PrivateMessage.prototype.getHistoryByKey = function (keyword,fromUser, toUser, callback) {
    this.messageDb.getPrivateHistoryByKey(keyword,fromUser, toUser, callback);
};

module.exports = PrivateMessage;