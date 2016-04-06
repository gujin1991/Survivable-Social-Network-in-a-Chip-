/**
 * Created by congshan on 4/6/16.
 */
var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');
var Post = require('../module/Post');

suite('SSNoC Unit Test - Post', function () {
    test('Existing User Send Post', function (done){
        new User().getUserInfo("TesterJin", function (err, user) {
            expect(err).to.equal(null);
            var currentTime = new Date().toLocaleTimeString();
            new Post().addPost(user.userName, new Status().ok, "Test post!", currentTime, function (code) {
                expect(code).to.eql(200);
            }).getPostsByUsername(user.userName, function (rows) {
                var len = rows.length;
                expect(rows[len - 1].content).to.eql("Test post!");
                expect(rows[len - 1].time).to.eql(currentTime);
                done();
            });
        });
    });

    test('Existing User Send Invalid Post', function (done) {
        new User().getUserInfo("TesterJin", function (err, user) {
            expect(err).to.equal(null);
            var currentTime = new Date().toLocaleTimeString();
            new Post().addPost(user.userName, new Status().ok, null, currentTime, function (code) {
                //console.log(code);
                expect(code).to.eql(400);
            });
            done();
        });
    });

    test('Get All Posts', function (done) {
        new User().getUserInfo("TesterJin", function (err, user) {
            expect(err).to.equal(null);
            new Post().getAllPosts(function(rows){
                var len_prev = rows.length;
                var currentTime = new Date().toLocaleTimeString();
                new Post().addPost(user.userName, new Status().ok, "Test all posts!", currentTime, function (code) {
                    expect(code).to.eql(200);
                }).getPostsByUsername(user.userName, function (rows_curr) {
                    var len_curr = rows_curr.length;
                    expect(len_curr).to.eql(len_prev + 1);
                    expect(rows_curr[len_curr - 1].content).to.eql("Test all posts!");
                    expect(rows_curr[len_curr - 1].time).to.eql(currentTime);
                });
            });
            done();
        });
    });
});