/**
 * Created by guangyu on 3/22/16.
 */

var expect = require('expect.js');
var Status = require('../module/Status.js');
//var server = supertest.agent("http://localhost:3001");

var PrivateMessage = require('../module/PrivateMessage.js')
var testMessagePri = new PrivateMessage();

var User = require('../module/User.js');
var directory = require('../module/Directory.js')

var publicMessage = require('../module/Message.js')
//var testMessagePub = new publicMessage();

var Announcement = require('../module/Announcement.js');
//var testAnnoucement = new Announcement();

suite('SSNoC Unit Test - SearchInformation', function () {

    var testerName = "TesterJin";

    test('Search online user by name', function (done) {
        var onlineUser = "onlineUser";
        directory.addLoggedInUsers(new User().initialize(testerName, "19911991", new Status().ok));
        directory.searchOnlineUsers(testerName, function(onlineUser) {
            //console.log(onlineUser[0]);
            //onlineUser += "append";
            expect(onlineUser[0].userName).eql(testerName);
            done();
        });
    });

    test('Search offline user by name', function (done) {
        var offlineUser = "offlineUser";
        directory.deleteLoggedInUsers(new User().initialize(testerName, "19911991", new Status().ok));
        directory.searchOffLine(testerName, function(offlineUser) {
            //console.log(offlineUser);
            expect(offlineUser[0].userName).eql(testerName);
            done();
        });

    });

    test('Search online user by status', function (done) {
        var onlineUser = "onlineUser";
        directory.addLoggedInUsers(new User().initialize(testerName, "19911991", new Status().ok));
        directory.searchOnlineUsersByStatus(new Status().ok, function(onlineUser) {
            //console.log(onlineUser[0]);
            //onlineUser += "append";
            expect(onlineUser[0].userName).eql(testerName);
            done();
        });
    });

    test('Search offline user by status', function (done) {
        var offlineUser = "offlineUser";
        directory.deleteLoggedInUsers(new User().initialize(testerName, "19911991", new Status().ok));
        directory.searchOffLineByStatus(new Status().help, function(offlineUser) {
            //console.log(offlineUser);
            expect(offlineUser[0].userName).eql(testerName);
            done();
        });

    });

    test('Search announcement', function (done) {
        new Announcement().addAnnouncement(testerName, new Status().ok, "Hello, Jin!", new Date().toLocaleTimeString(), function(code) {
            expect(code).eql(200);
        }).getDetailsByKey(["Jin"], function(row) {
            expect(row[row.length - 1].content).eql("Hello, Jin!");
            done();
        });
    });

    test('Search public message', function (done) {
        new publicMessage().addMessage(testerName, "Hello, Jin!", new Date().toLocaleTimeString(), new Status().ok, function(code) {
            expect(code).eql(200);

        });
        new publicMessage().getHistoryByKey(["Jin"], function(row) {
            //console.log(row);
            expect(row[row.length - 1].content).eql("Hello, Jin!");
            done();
        });
    });

    test('Search private message', function(done) {
       testMessagePri.addMessage(testerName, "testerYu", "Hello, Yu!", new Date().toLocaleTimeString(),new Status().ok, function(code) {
           expect(code).eql(200);
       });
       testMessagePri.getHistoryByKey(["Hello"], testerName, function(row) {
           //console.log(row);
           expect(row[row.length - 1].content).eql("Hello, Yu!");
           done();
       });

    });






});