var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');
var AccountStatus = require('../module/AccountStatus.js');
var directory = require('../module/Directory.js');
//var testUser = new User();

suite('SSNoC Unit Test - User', function () {

    test('Register Unregistered User', function (done) {
        var currentTime = new Date().toLocaleTimeString();
        new User()
            .initialize('T' + currentTime, "19911991", new Status().ok, "", "", "")
            .userAdd(function (err, user) {
                expect(err).to.equal(null);
                //console.log(user);
                expect(user.userName).to.eql('T' + currentTime);
                done();
            });
    });

    test('Register Existed UserJin', function (done) {
        new User()
            .initialize("TesterJin", "19911991", new Status().ok, "", "", "")
            .userAdd(function (err, user) {
                expect(err).to.eql(400);
                done();
            });
    });


    test('Check Existed User', function (done) {
        new User()
            .initialize("TesterJin", "19911991", new Status().ok, "", "", "")
            .exist(function (code) {
                expect(code).to.eql(403);
                done();
            });
    });

    test('Check Non-Existed User', function (done) {
        new User()
            .initialize("TesterWrong", "19911991", new Status().ok, "", "", "")
            .exist(function (code) {
                expect(code).to.eql(401);
                done();
            });
    });

    /*test('Check Inactive User', function (done) {
        new User()
            .initialize("TesterYu", "admin", new Status().ok, "", new AccountStatus().inactive, "")
            .exist(function (code) {
                expect(code).to.eql(407);
                done();
            });
    });*/



    test('Test getUserInfo if the user exists.', function (done) {
        new User()
            .getUserInfo("TesterJin", function (err, user) {
                expect(user.userName).to.eql("TesterJin");
                done();
            });

    });

    test('Test getUserInfo if the user does not exist.', function (done) {
        new User().getUserInfo("TesterNotExists", function (err, user) {
            expect(err).to.eql(400);
            done();
        });

    });

    test('Test ShareStatus', function (done) {
        new User().getUserInfo("TesterJin", function (err, user) {
            expect(err).to.equal(null);

            new User().initialize(user.userName, "19911991", new Status().ok, "", "", "")
                .updateStatus(new Status().help, function (code) {
                    expect(code).to.eql(200);
                    expect(user.userName).to.eql("TesterJin");
                    new User().getUserInfo("TesterJin", function (err, user){
                        expect(err).to.equal(null);
                        expect(user.status).to.eql("Help");
                        done();
                    });
                });
        });
    });

    test('Test delete logged user', function(done) {
        var user = new User().initialize("TesterJin", "19911991", new Status().ok, "", "", "");
        directory.addLoggedInUsers(user);
        directory.deleteLoggedInUsers(user);
        done();

    });

    test('Test get online users', function(done) {
        var user = new User().initialize("TesterJin", "19911991", new Status().ok, "", "", "");
        directory.addLoggedInUsers(user);
        directory.getOnlineUsers(function(usersInfo) {
            directory.deleteLoggedInUsers(user);
            expect(usersInfo[usersInfo.length - 1].userName).to.eql("TesterJin");
            done();
        });
    });

    test('Test get offline users', function(done) {
        var user1 = new User().initialize("TesterJin", "19911991", new Status().ok, "", "", "");
        var user2 = new User().initialize("TesterYu", "admin", new Status().ok, "", "", "");
        directory.addLoggedInUsers(user1);
        directory.addLoggedInUsers(user2);
        directory.deleteLoggedInUsers(user1);
        directory.deleteLoggedInUsers(user2);
        directory.getOfflineUsers(function(offlineUser) {
            for(var i = 0; i < offlineUser.length; i++) {
                //console.log(user.userName + "username");
                if(offlineUser[i].userName === "TesterYu") {
                    done();
                }
            }

        });

    });

    test('Test update a non-existed name', function(done) {
        directory.updateUserName("NotExisited", "NoName");
        done();
    });

    test('Test update a existed user name', function(done) {
        var user1 = new User().initialize("TesterJin", "19911991", new Status().ok, "", "", "");
        directory.addLoggedInUsers(user1);
        directory.updateUserName("TesterJin", "Jin");
        directory.updateUserName("Jin", "TesterJin");
        directory.deleteLoggedInUsers(user1);
        done();
    });

    test('Test get user with wrong name', function(done) {
        var user = new User().initialize("WrongName", "wrong", new Status().ok, "", "", "");
        user.userAuth(function(code, data) {
           expect(code).to.eql(401);
           expect(data).to.eql(null);
            done();
        });
    });

    test('Test get user by wrong password', function(done) {
        var user = new User().initialize("TesterJin", "wrong", new Status().ok, "", "", "");
        user.userAuth(function(code, data) {
            expect(code).to.eql(403);
            expect(data).to.eql(null);
            done();
        });
    });

    test('Test get user by userAuth', function(done) {
        var user = new User().initialize("TesterJin", "19911991", new Status().ok, "", "", "");
        user.userAuth(function(code, userInfo) {
            expect(code).to.eql(null);
            expect(userInfo.userName).to.eql("TesterJin");
            done();
        });
    });



});