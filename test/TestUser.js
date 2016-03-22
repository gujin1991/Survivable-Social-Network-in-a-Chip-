var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');

//TODO 
//1: implement deleteUser() functions.
//2: seperate the sharestate unit test.
suite('SSNoC Unit Test - User', function () {

    test('Test Register if the user has not registered.', function (done) {
        var currentTime = new Date().toLocaleTimeString();
        new User()
            .initialize("TesterJin", "19911991", new Status().ok)
            .userAdd(function (err, user) {
                if (err) {
                    done();
                } else {
                    expect(user.userName).to.eql("TesterJin");
                    done();
                }
            });
    });

    test('Test Register if the user has registered.', function (done) {
        new User()
            .initialize("TesterJin", "19911991", new Status().ok)
            .userAdd(function (err, user) {
                expect(err).to.eql(400);
                done();
            });
    });


    test('Test Register if the user has not registered and there is already other testers.', function (done) {
        new User()
            .initialize("TesterYu", "19931993", new Status().ok)
            .userAdd(function (err, user) {
                expect(err).to.eql(400);
                done();
            });
    });

    test('Test Register if the user has registered and there is already other testers.', function (done) {
        new User()
            .initialize("TesterYu", "19931993", new Status().ok)
            .userAdd(function (err, user) {
                expect(err).to.eql(400);
                done();
            });
    });


    test('Test getUserInfo if the user exists.', function (done) {
        new User()
            .getUserInfo("TesterJin", function (err, user) {
                expect(user.userName).to.eql("TesterJin");
                done();
            });

    });

    test('Test getUserInfo if the user doesnot exist.', function (done) {
        new User()
            .getUserInfo("TesterNotExists", function (err, user) {
                expect(err).to.eql(400);
                done();
            });

    });


    test('Test ShareStatus ', function (done) {
        new User().getUserInfo("TesterJin", function (err, user) {
            if (!err) {
                new User().initialize(user.userName, "19911991", new Status().ok)
                    .updateStatus(new Status().help, function (code) {
                        expect(code).to.eql(200);
                        expect(user.userName).to.eql("TesterJin");
                        expect(user.status).to.eql("Help");
                        done();
                    });
            } else {
                expect(err).to.eql(400);
                done();
            }
        });

    });


});