/**
 * Created by jiyushi1 on 4/17/16.
 */
var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');

suite('SSNoC Unit Test - Administer', function () {
    test('Get Profile of a user.', function (done) {

        new User().getUserProfile('SSNAdmin',function(err,user){
            expect(err).to.equal(null);
            expect(user[0].userName).to.eql('SSNAdmin');
            expect(user[0].privilege).to.eql('Administrator');
            expect(user[0].status).to.eql('OK');
            expect(user[0].accountStatus).to.eql('active');
            expect(user[0].password).to.eql('admin');
            done();

        });

    });

    test('Get Profile of a non-existed user .', function (done) {

        new User().getUserProfile('NonExistedTest',function(err,user){
            expect(err).to.equal(400);

            done();

        });

    });



    test('Update Profile.', function (done) {
        var temp = new User();
        temp.initializeForAdmin("SSNAdmin","SSNAdminTest","1234","Citizen","inactive").updateProfileByAdmin(function(result) {

        });
        temp.getUserProfile('SSNAdmin',function(err,user){
            expect(err).to.equal(400);

        });
        temp.getUserProfile('SSNAdminTest',function(err,user){
            expect(err).to.equal(null);
            expect(user[0].userName).to.eql('SSNAdminTest');
            expect(user[0].privilege).to.eql('Citizen');
            expect(user[0].status).to.eql('OK');
            expect(user[0].accountStatus).to.eql('inactive');
            expect(user[0].password).to.eql('1234');

        });
        temp.initializeForAdmin("SSNAdminTest","SSNAdmin","admin","Administrator","active").updateProfileByAdmin(function(result) {
            done();
        });

    });

});