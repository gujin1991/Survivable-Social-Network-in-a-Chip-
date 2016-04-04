var expect = require('expect.js');
var User = require('../module/User.js');
var PrivateMessage = require('../module/PrivateMessage.js');

suite('SSNoC Unit Test - Private Message', function () {

    test('Sending a private message successfully.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = now();
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
                var currentTime = now();
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

    test('Deleting a private message successfully.', function (done) {
        new User().getUserInfo("TesterJin", function (err1, user1) {
            new User().getUserInfo("TesterYu", function (err2, user2) {
                var currentTime = now();
                var privateMessage = new PrivateMessage(user1.userName, user2.userName, "Hello, Yu!", "OK", currentTime);
                privateMessage.addMessage(user1.userName, user2.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                    expect(code).to.eql(200);
                });
                var idArray = [];
                privateMessage.getHistory(user1.userName, user2.userName, function (rows) {
                    var len = rows.length;
                    expect(rows[len - 1].content).to.eql("Hello, Yu!");
                    expect(rows[len - 1].time).to.eql(currentTime);
                    idArray.push(parseInt(expect(rows[len - 1].messageId)));
                });
                privateMessage.deletePrivateMessageById(idArray,function (code) {
                    expect(code).to.eql(200);
                });
                privateMessage.getHistory(user1.userName, user2.userName, function (rows) {
                    var len = rows.length;
                    expect(rows[len - 1].messageId).not.to.eql(idArray[0]);
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