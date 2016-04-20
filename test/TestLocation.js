/**
 * Created by guangyu on 4/20/16.
 */
var expect = require('expect.js');
var LocationDb = require('../module/LocationDB.js');

var location, name;

suite('SSNoC Unit Test - Location ', function () {

    setup(function () {
        location = new LocationDb();
        name = "testName";
    });
  
    suite('SSNoC Unit Test - Location - Add ', function () {

        test('Test add location', function (done) {
            location.addLocation(name, "status", 0.5, 0.5, "type", "time", function (retName, code) {
                expect(retName).to.eql("testName");
                expect(code).to.eql("200");
                done();
                // location.deleteLocation("name", function () {
                //
                // });
            })
        });
    });  

    suite('SSNoC Unit Test - Location - Delete ', function () {
        var testName = new Date().toLocaleDateString();
        var malformatName = "hello'world";

        setup(function () {
            location.addLocation(testName, "status", 0.5, 0.5, "type", "time", function (retName, code) {
                location.getLocation(function (err, locations) {
                    var length = locations.length;
                    expect(locations[length - 1].name).to.eql(testName)
                });  
            });   
        });

        test('Test delete location', function (done) {
            location.deleteLocation(testName, function (retName, code) {
                expect(code).to.eql(200);
                expect(retName).to.eql(testName);
                location.getLocation(function (err, locations) {
                    var length = locations.length;
                    expect(locations[length - 1].name).to.not.eql(testName);
                    done();
                });
            });
        }); 

        test('Test delete location err', function (done) {
            location.deleteLocation(malformatName, function (retName, code) {
                expect(code).to.eql(400);
                expect(retName).to.eql(malformatName);
                done(); 
            });  
        }); 
    });
}); 