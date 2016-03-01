var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');
var MessageDB = require('../module/MessageDb.js');
var AnnouncementDB = require('../module/AnnouncementDb.js');
var Message = require('../module/Message.js');
var joinCommunity = require('../controllers/JoinCommunity.js');

suite('Sprint 2 Test', function () {

    test('Test User', function (done) {
        new User().initialize("jiyu", null, null).updateStatus(new Status().help, function (code) {
            expect(code).to.eql(200);
            done();
        });
    });

    test('Test joinCommunity', function (done) {
        joinCommunity.getUserInfo("guangyuc", function (err, data) {
            if (err) {
                expect(err).to.eql(400);
                done();
            } else {
                expect(data.length).to.not.eql(0);
                done();
            }
        });
    });

    test('Test MessageDB', function (done) {
        new MessageDB().messageAdd("jiyu", null, null, function (code) {
            expect(code).to.eql(200);
            done();
        });
    });

    test('Test AnnouncementDB', function (done) {
        new AnnouncementDB().annoucementAdd("jiyu", null, null, function (code) {
            expect(code).to.eql(200);
            done();
        });
    });

    test('Test Message', function (done) {
        new Message().getHistory(function (data) {
            if (data == 400) {
                expect(data).to.eql(0);
                done();
            } else {
                expect(data.length).to.not.eql(0);
                done();
            }
        });
    });


});
