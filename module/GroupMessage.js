/**
 * Created by Jin GU on 4/1/16.
 */
var MessageDb = require('./MessageDb.js');
var Message = require('./Message.js');

GroupMessage.prototype = new Message();
GroupMessage.prototype.constructor = GroupMessage;

function GroupMessage(sender, groupName, message, time) {
    this.sender = sender;
    this.groupName = groupName;
    this.message = message;
    this.time = time;
    this.messageDb = new MessageDb();
}

GroupMessage.prototype.addMessage = function (sender, groupName, message, time,status, callback) {
    this.messageDb.groupMessageAdd(sender, groupName, message, time, status,callback);
    return this;
};

GroupMessage.prototype.getHistory = function (groupName, callback) {
    this.messageDb.getGroupHistory(groupName, callback);
};


/*GroupMessage.prototype.deleteHistory = function (groupName, callback) {
    this.messageDb.deleteGroupHistory(groupName, callback);
};*/


//new added function for get private history by key
/*GroupMessage.prototype.getHistoryByKey = function (keyword,user, callback) {
    this.messageDb.getPrivateHistoryByKey(keyword,user, callback);
};*/

module.exports = GroupMessage;