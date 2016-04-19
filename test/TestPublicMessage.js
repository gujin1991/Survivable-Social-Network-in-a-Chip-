/**
 * Created by guangyu on 3/22/16.
 */
var expect = require('expect.js');
var User = require('../module/User.js');
var PublicMessage = require('../module/Message.js');
var message = new PublicMessage();


suite('SSNoC Unit Test - Public Message', function () {
    var tester1 = "TesterJin";

    test('Sending a public message successfully.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            var currentTime = new Date().toLocaleTimeString();
            //var message = new PublicMessage();
            message.addMessage(user1.userName, "Hello, Yu!", currentTime, "OK", "", function (code) {
                expect(code).to.eql(200);
            });
            message.getHistory(function (rows) {
                var len = rows.length;
                expect(rows[len - 1].content).to.eql("Hello, Yu!");
                expect(rows[len - 1].time).to.eql(currentTime);
                done();
            });
            message.deleteByUsername("TesterJin");
        });
    });

    test('Test update public username', function(done) {
        message.updateUserName(tester1, "Jin");
        message.updateUserName("Jin", tester1);
        done();
    });

    test('Test delete public message', function(done) {
        message.deleteByUsername(tester1);
        done();
    })


});