var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');

//TODO 
//1: implement deleteUser() functions.
//2: seperate the sharestate unit test.
suite('SSNoC Unit Test - User', function () {

    test('Register Unregistered User', function (done) {
        var currentTime = new Date().toLocaleTimeString();
        new User()
            .initialize(currentTime, "19911991", new Status().ok)
            .userAdd(function (err, user) {
                expect(err).to.equal(null);
                expect(user.userName).to.eql(currentTime);
                done();
            });
    });

    /*test('Register Unregistered UserYu', function (done) {
        var currentTime = new Date().toLocaleTimeString();
        new User()
            .initialize("TesterYu", "19933991", new Status().ok)
            .userAdd(function (err, user) {
                expect(err).to.equal(null);
                expect(user.userName).to.eql("TesterYu");
                done();
            });
    });*/

    test('Register Existed UserJin', function (done) {
        new User()
            .initialize("TesterJin", "19911991", new Status().ok)
            .userAdd(function (err, user) {
                expect(err).to.eql(400);
                done();
            });
    });


    test('Check Existed User', function (done) {
        new User()
            .initialize("TesterJin", "19911991", new Status().ok)
            .exist(function (code) {
                expect(code).to.eql(303);
                done();
            });
    });

    test('Check Non-Existed User', function (done) {
        new User()
            .initialize("TesterWrong", "19911991", new Status().ok)
            .exist(function (code) {
                expect(code).to.eql(305);
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

    test('Test getUserInfo if the user does not exist.', function (done) {
        new User().getUserInfo("TesterNotExists", function (err, user) {
            expect(err).to.eql(400);
            done();
        });

    });

    test('Test ShareStatus', function (done) {
        new User().getUserInfo("TesterJin", function (err, user) {
            expect(err).to.equal(null);

            new User().initialize(user.userName, "19911991", new Status().ok)
                .updateStatus(new Status().help, function (code) {
                    expect(code).to.eql(200);
                    expect(user.userName).to.eql("TesterJin");
                    expect(user.status).to.eql("Help");
                    done();

                });
        });
    });


});