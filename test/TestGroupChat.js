var expect = require('expect.js');
var User = require('../module/User.js');
var GroupMessage = require('../module/GroupMessage.js');
//var supertest = require("supertest");
//var server = supertest.agent("http://localhost:3001");


suite('SSNoC Unit Test - Group Chat', function () {



    test('Sending a group message.', function (done) {
        var currentTime = new Date().toLocaleTimeString();
        new GroupMessage()
            .addMessage("TesterJin", "GUU", "Hello, GUU!", currentTime, "OK", function (code) {
                expect(code).to.eql(200);
                done();
            });
    });

    test('Get group message', function(done) {
        new GroupMessage()
            .getHistory("GUU", function (rows) {
                var len = rows.length;
                expect(rows[len - 1].content).to.eql("Hello, GUU!");
                done();
            });
    });

    test('Initialize the group', function(done) {
        new User().deleteGroup_User("GUU",function(code) {
            expect(code).to.eql(200);
            done();
        })
    });

    test('Add new group', function(done) {
        new User().addGroup("GUU", function(code) {
            expect(code).to.eql(200);
            done();
        });
    });

    test('Add new group user', function(done) {
        new User().addGroupUser("GUU", "Jin", function(code) {
            expect(code).to.eql(200);
            done();
        });
    });

    test('Get available group', function(done) {
       new User().getGroup_User("Jin", function(data) {
            console.log(data);
            var len = data.group.length;
            expect(data.group[len - 1].GroupName  ).to.eql("GUU");
            done();
       });
    });

    test('End the group chat', function(done) {
       new User().deleteGroup_User("GUU",function(code) {
           expect(code).to.eql(200);
           done();
       })
    });



});