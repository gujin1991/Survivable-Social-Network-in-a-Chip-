var MessageDb = require('./MessageDb.js');

function Message(username, message, time) {
    this.username = username;
    this.message = message;
    this.time = time;
    this.messageDb = new MessageDb();
}

Message.prototype.addMessage =  function(username,message,time,callback) {
    this.messageDb.messageAdd(username, message, time, callback);
};

Message.prototype.getHistory = function (callback) {
    this.messageDb.getHistory(callback);
};


module.exports = Message;