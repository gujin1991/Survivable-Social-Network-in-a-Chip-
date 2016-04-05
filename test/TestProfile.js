/**
 * Created by jiyushi1 on 4/3/16.
 */
var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');

suite('SSNoC Unit Test - ChangeProfile', function () {
    test('Get Profile of a user.', function (done) {

        new User().getUserProfile('TesterJin',function(err,user){
            expect(err).to.equal(null);
            expect(user[0].userName).to.eql('TesterJin');
            expect(user[0].email).to.eql('null');
            expect(user[0].firstName).to.eql('null');
            expect(user[0].lastName).to.eql('null');
            expect(user[0].skill).to.eql('null');
            expect(user[0].gender).to.eql('null');
            done();

        });

    });

    test('Get Profile of a non-existed user .', function (done) {

        new User().getUserProfile('NonExistedTest',function(err,user){
            expect(err).to.equal(400);

            done();

        });

    });

    test('Update Password Successfully.', function (done) {
        var temp = new User();
        temp.initializeForChangePassword('TesterJin', '19911991', 'testPassword').updatePassword(function(result) {
            expect(result).to.equal(200);
            done();
        });
    });

    test('Update Password With WrongPassword.', function (done) {
        var temp = new User();
        temp.initializeForChangePassword('TesterJin', '19911991', 'testPassword').updatePassword(function(result) {
            expect(result).to.equal(400);

        });

        temp.initializeForChangePassword('TesterJin', 'testPassword', '19911991').updatePassword(function(result) {
            expect(result).to.equal(200);
            done();
        });
    });


    test('Update Profile.', function (done) {
        var temp = new User();
        temp.initializeForChangeFile('TesterJin','test@t.com','Tester','Jin','Computer Science','Male').updateProfile(function(result) {

        });
        temp.getUserProfile('TesterJin',function(err,user){
            expect(err).to.equal(null);
            expect(user[0].userName).to.eql('TesterJin');
            expect(user[0].email).to.eql('test@t.com');
            expect(user[0].firstName).to.eql('Tester');
            expect(user[0].lastName).to.eql('Jin');
            expect(user[0].skill).to.eql('Computer Science');
            expect(user[0].gender).to.eql('Male');


        });
        temp.initializeForChangeFile('TesterJin','null','null','null','null','null').updateProfile(function(result) {
            done();
        });

    });

});