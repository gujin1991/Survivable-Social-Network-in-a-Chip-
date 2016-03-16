var expect = require('expect.js');
var User = require('../module/User.js');
var PrivateMessage = require('../module/PrivateMessage.js');

//TODO: review the addAnnoucement function in Announcement.js
suite('Unit Test for User', function () {
	test('Unit Test for sending announcement successfully', function (done) {
        new User().getUserInfo("TesterJin", function (err, user) {
        	var currentTime = new Date().toLocaleTimeString();  //maybe a sync problem?
            new Announcement(user.userName, "Test announcement!", currentTime)
            .addAnnoucement(user.userName, "Test announcement!", currentTime, function (code) {
                expect(code).to.eql(200);
            }).getDetails(function (rows) {
                var len = rows.length;
                expect(rows[len - 1].content).to.eql("Test announcement!");
                expect(rows[len - 1].time).to.eql(currentTime);
                done();
            });
            
        });
    });

});
