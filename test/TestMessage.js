var expect = require('expect.js');
var User = require('../module/User.js');
var PrivateMessage = require('../module/PrivateMessage.js');

suite('SSNoC Unit Test - Message', function () {

    test('Sending a private message successfully.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = new Date().toLocaleTimeString();
                new PrivateMessage(user1.userName, user2.userName, "Hello, Yu!", "OK", currentTime)
                    .addMessage(user1.userName, user2.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                        expect(code).to.eql(200);
                    }).getHistory(user1.userName, user2.userName, function (rows) {
                    var len = rows.length;
                    expect(rows[len - 1].content).to.eql("Hello, Yu!");
                    expect(rows[len - 1].time).to.eql(currentTime);
                    done();
                });
            });
        });
    });

    test('Sending a private message unsuccessfully.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = new Date().toLocaleTimeString(); 
                new PrivateMessage(user1.userName, user2.userName, "Hello, Yu!", "OK", currentTime)
                    .addMessage(user1.userName, user2.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                        expect(code).to.eql(200);
                    }).getHistory(user1.userName, "TesterNotExists", function (code) {
                    expect(code).to.eql(400);
                    done();
                });
            });
        });
    });
});