/**
 * Created by guangyu on 3/22/16.
 */
var expect = require('expect.js');
var User = require('../module/User.js');
var PublicMessage = require('../module/Message.js');

suite('SSNoC Unit Test - Message', function () {

    test('Sending a public message successfully.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = new Date().toLocaleTimeString();
                var message = new PublicMessage(user1.userName, "Hello, Yu!", "OK", currentTime);
                message.addMessage(user1.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                        expect(code).to.eql(200);
                    });
                message.getHistory(function (rows) {
                    var len = rows.length;
                    expect(rows[len - 1].content).to.eql("Hello, Yu!");
                    expect(rows[len - 1].time).to.eql(currentTime);
                    done();
                });
            });
        });
    });
});