/**
 * Created by Pan on 2/26/16.
 */
var PrivateMessage = require('./module/PrivateMessage.js');

new PrivateMessage().addMessage("jiyu", "panli", "test message", "test time", function (code) {
    console.log(code);
});

new PrivateMessage().getHistory("panli", "jiyu", function (code) {
    console.log(code);
});