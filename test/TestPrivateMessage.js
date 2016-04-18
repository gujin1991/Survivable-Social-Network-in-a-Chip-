var expect = require('expect.js');
var User = require('../module/User.js');
var PrivateMessage = require('../module/PrivateMessage.js');
var testMsgPri = new PrivateMessage();

suite('SSNoC Unit Test - Private Message', function () {
    var tester1 = "TesterJin";
    var tester2 = "TesterYu";

    test('Sending a private message successfully.', function (done) {

                var currentTime = new Date().toLocaleTimeString();
                testMsgPri.addMessage(tester1, tester2, "Hello, Yu!", currentTime, "OK", "", "", function (code) {
                    expect(code).to.eql(200);
                    testMsgPri.getHistory(tester1, tester2, function (rows) {
                        var len = rows.length;
                        //console.log(rows);
                        expect(rows[len - 1].content).to.eql("Hello, Yu!");
                        expect(rows[len - 1].time).to.eql(currentTime);
                        done();
                    });
                });


        //new PrivateMessage().deleteByUsernamePrivate("TesterJin");
    });

    test('Sending a private message unsuccessfully.', function (done) {

                var currentTime = new Date().toLocaleTimeString();

                testMsgPri.addMessage(tester1, tester2, "Hello, Yu!", currentTime, "OK", "", "", function (code) {
                    expect(code).to.eql(200);
                    testMsgPri.getHistory(tester1, "TesterNotExists", function (code) {
                        expect(code).to.eql(400);
                        done();
                    });
                });
    });
});