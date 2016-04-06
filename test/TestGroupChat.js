var expect = require('expect.js');
var User = require('../module/User.js');
var GroupMessage = require('../module/GroupMessage.js');
//var supertest = require("supertest");
//var server = supertest.agent("http://localhost:3001");


suite('SSNoC Unit Test - UGroup Chat', function () {



    test('Sending a group message.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = new Date().toLocaleTimeString();
                new GroupMessage(user1.userName, user2.userName, "Hello, Yu!", currentTime)
                    .addMessage(user1.userName, user2.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                        expect(code).to.eql(200);
                    }).getHistory(user1.userName, function (rows) {
                    var len = rows.length;
                    expect(rows[len - 1].content).to.eql("Hello, Yu!");
                    expect(rows[len - 1].time).to.eql(currentTime);
                    done();
                });
            });
        });
    });

    test('End the group chat', function(done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = new Date().toLocaleTimeString();
                new GroupMessage(user1.userName, user2.userName, "Hello, Yu!", currentTime)
                    .deleteHistory(function (code) {
                       expect(code).to.equal(200);
                    });
                    done();
                });
            });
    });



});