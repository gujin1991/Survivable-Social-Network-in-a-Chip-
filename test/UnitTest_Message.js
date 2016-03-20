var expect = require('expect.js');
var User = require('../module/User.js');
var PrivateMessage = require('../module/PrivateMessage.js');

//TODO: review the addMessage function in PrivateMessage.js
suite('Unit Test for User', function () {

	test('Unit Test for sending a private message successfully.', function (done) {
        new User()
            .getUserInfo("TesterJin", function (err1, user1) {               
                new User()
                    .getUserInfo("TesterYu", function (err2, user2) {
                    	var currentTime = new Date().toLocaleTimeString();  //maybe a sync problem?
                        new PrivateMessage(user1.userName, user2.userName, "Hello, Yu!", "OK", currentTime)
                            .addMessage(user1.userName, user2.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                                expect(code).to.eql(200);
                            })
                            .getHistory(user1.userName, user2.userName, function (rows) {
                                var len = rows.length;
                                expect(rows[len - 1].content).to.eql("Hello, Yu!");
                                expect(rows[len - 1].time).to.eql(currentTime);
                                done();
                            });
                    
                    });
                
            });
    });

	test('Unit Test for sending a private message unsuccessfully.', function (done) {
        new User()
            .getUserInfo("TesterJin", function (err1, user1) {
                
                new User()
                    .getUserInfo("TesterYu", function (err2, user2) {
                        var currentTime = new Date().toLocaleTimeString();  //maybe a sync problem?
                        new PrivateMessage(user1.userName, user2.userName, "Hello, Yu!", "OK", currentTime)
                            .addMessage(user1.userName, user2.userName, "Hello, Yu!", currentTime, "OK", function (code) {
                                expect(code).to.eql(200);
                            })
                            .getHistory(user1.userName, "TesterNotExists", function (code) {	                              
                                expect(code).to.eql(400);
                                done();
                            });

                    });
                
            });
    });

});