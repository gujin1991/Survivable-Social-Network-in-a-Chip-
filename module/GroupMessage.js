/**
 * Created by Jin GU on 4/1/16.
 */
var MessageDb = require('./MessageDb.js');
var Message = require('./Message.js');

GroupMessage.prototype = new Message();
GroupMessage.prototype.constructor = GroupMessage;

function GroupMessage(fromUser, toUser, message, time) {
    this.fromUser = fromUser;
    this.toUser = toUser;
    this.message = message;
    this.time = time;
    this.messageDb = new MessageDb();
}

GroupMessage.prototype.addMessage = function (fromUser, toUser, message, time,status, callback) {
    this.messageDb.groupMessageAdd(fromUser, toUser, message, time, status,callback);
    return this;
};

GroupMessage.prototype.getHistory = function (fromUser, callback) {
    this.messageDb.getGroupHistory(fromUser, callback);
};


GroupMessage.prototype.deleteHistory = function (callback) {
    this.messageDb.deleteGroupHistory(callback);
};


//new added function for get private history by key
/*GroupMessage.prototype.getHistoryByKey = function (keyword,user, callback) {
    this.messageDb.getPrivateHistoryByKey(keyword,user, callback);
};*/

module.exports = GroupMessage;