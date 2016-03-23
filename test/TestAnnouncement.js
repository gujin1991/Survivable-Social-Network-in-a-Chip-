var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');
var Announcement = require('../module/Announcement');

suite('SSNoC Unit Test - Announcement', function () {

    var testerName = 'TesterJin';

    test('Existed User Post Announcement', function (done) {
        new User().getUserInfo(testerName, function (err, user) {
            expect(err).to.equal(null);
            var currentTime = new Date().toLocaleTimeString();
            new Announcement().addAnnouncement(user.userName, new Status().ok, "Test announcement!", currentTime, function (code) {
                expect(code).to.eql(200);
            }).getDetails(function (rows) {
                var len = rows.length;
                expect(rows[len - 1].content).to.eql("Test announcement!");
                expect(rows[len - 1].time).to.eql(currentTime);
                done();
            });
        });
    });

    test('Reject Illegal User Posting Announcement', function (done) {
        new User().getUserInfo("TesterWrong", function (err, user) {
            expect(err).to.not.equal(null);
            expect(err).to.equal(400);
            done();
        });
    });
});
