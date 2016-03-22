var TestMessageDb = require('./TestMessageDB.js');

function TestMessage(username, message, time) {
    this.username = username;
    this.message = message;
    this.time = time;
    this.messageDb = new TestMessageDb();
}

TestMessage.prototype.addMessage =  function(username,message,time,status,callback) {
    this.messageDb.messageAdd(username, message, time, status,callback);
};

TestMessage.prototype.getHistory = function (callback) {
    this.messageDb.getHistory(callback);
};

TestMessage.prototype.endMeasurement = function(callback) {
    this.messageDb.endMeasurement(callback);
}

TestMessage.prototype.reset = function() {
    this.messageDb.reset();
}

module.exports = TestMessage;