var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');
var Announcement = require('../module/Announcement');

suite('SSNoC Unit Test - Announcement', function () {

    var testerName = 'TesterJin';

    test('Existed User Post Announcement', function (done) {
        new User().getUserInfo(testerName, function (err, user) {
            expect(err).to.equal(null);
            var currentTime = now();
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

    test('Deleting a announcement successfully.', function (done) {
        new User().getUserInfo("TesterPan", function (err, user) {
                var currentTime = now();
                var announce = new Announcement(user.userName, new Status().ok, "Test announcement!", currentTime);
                announce.addAnnouncement(user.userName, new Status().ok, "Test announcement!", currentTime, function (code) {
                    expect(code).to.eql(200);
                });
                announce.getDetails(function (rows) {
                    var len = rows.length;
                    expect(rows[len - 1].content).to.eql("Test announcement!");
                    expect(rows[len - 1].time).to.eql(currentTime);
                    done();
                });
                announce.deleteAnnounceByDate(currentTime, currentTime,function (code) {
                    expect(code).to.eql(200);
                });
                announce.getDetails.(function (rows) {
                    var len = rows.length;
                    expect(rows[len - 1].content).not.to.eql("Test announcement!");
                    expect(rows[len - 1].time).not.to.eql(currentTime);
                    done();
            });
        });
    });

    function now() {
        var date = new Date();
        var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
        return time;
    }
});
