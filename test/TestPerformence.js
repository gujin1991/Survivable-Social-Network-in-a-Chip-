/**
 * Created by guangyu on 3/22/16.
 */
/**
 * Created by guangyu on 3/22/16.
 */
var expect = require('expect.js');
var User = require('../module/User.js');
var TestMessage = require('../module/TestMessage.js');

suite('SSNoC Unit Test - Message', function () {

    test('Send test successfully.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            var currentTime = new Date().toLocaleTimeString();
            var message = new TestMessage(user1.userName, "Hello, Yu!", "OK", currentTime);
            message.addMessage(user1.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                expect(code).to.eql(200);
                done();
            });

        });
    });

    test('Test Get History', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            var currentTime = new Date().toLocaleTimeString();
            var message = new TestMessage(user1.userName, "Hello, Yu!", "OK", currentTime);

            message.getHistory(function (code) {
                expect(code).to.equal(200);
                done();
            });
        });
    });

    test('Test End Test', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            var currentTime = new Date().toLocaleTimeString();
            var message = new TestMessage(user1.userName, "Hello, Yu!", "OK", currentTime);

            message.addMessage(user1.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                expect(code).to.eql(200);
            });

            message.endMeasurement(function (postReq, getReq) {
                expect(postReq).to.equal(1);
                expect(getReq).to.equal(0);
                done();
            });
        });
    });

    test('Test Performance Limit', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            var currentTime = new Date().toLocaleTimeString();
            var message = new TestMessage(user1.userName, "Hello, Yu!", "OK", currentTime);

            var i = 0;
            for (i = 0; i < 100; i++) {
                message.addMessage(user1.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                    expect(code).to.eql(200);
                });
            }

            message.addMessage(user1.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                expect(code).to.eql(413);
            });

            message.endMeasurement(function (postReq, getReq) {
                expect(postReq).to.equal(0);
                expect(getReq).to.equal(0);
                done();
            });
        });
    });
});