/**
 * Created by guangyu on 3/22/16.
 */
var expect = require('expect.js');
var User = require('../module/User.js');
var PublicMessage = require('../module/Message.js');

suite('SSNoC Unit Test - Public Message', function () {

    test('Sending a public message successfully.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = now();
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

    test('Deleting a public message successfully.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = now();
                var message = new PublicMessage(user1.userName, "Hello, Yu!", "OK", currentTime);
                message.addMessage(user1.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                    expect(code).to.eql(200);
                });
                var idArray = []
                message.getHistory(function (rows) {
                    var len = rows.length;
                    expect(rows[len - 1].content).to.eql("Hello, Yu!");
                    expect(rows[len - 1].time).to.eql(currentTime);
                    idArray.push(parseInt(expect(rows[len - 1].messageId)));
                    message.deleteMessageById(idArray,function (code) {
                        expect(code).to.eql(404);
                    });
                });
                message.getHistory(function (rows) {
                    var len = rows.length;
                    expect(rows[len - 1].messageId).not.to.eql(idArray[0]);
                    done();
                });
            });
        });
    });
    test('Deleting a public message does not exist.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = now();
                var message = new PublicMessage(user1.userName, "Hello, Yu!", "OK", currentTime);
                var idArray = [-1];
                message.deleteMessageById(idArray,function (code) {
                    expect(code).to.eql(404);
                    done();
                });
            });
        });
    });

    function now() {
        var date = new Date();
        var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
        return time;
    }
});