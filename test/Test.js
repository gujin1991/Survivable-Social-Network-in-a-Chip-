var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');
var MessageDB = require('../module/MessageDB.js');
var AnnouncementDB = require('../module/AnnouncementDB.js');
var Message = require('../module/Message.js');
var joinCommunity = require('../Controllers/joinCommunity.js');

suite('Sprint 2 Test', function(){

	test('Test User', function(done){
		new User().initialize("jiyu", null, null).updateStatus(new Status().help, function (code) {
			expect(code).to.eql(200);
			done();
		});
	});

	test('Test joinCommunity', function(done){
		joinCommunity.getUserInfo("jin", function(data) {
			expect(data.length).to.not.eql(0);
			done();
		});
	});


	test('Test MessageDB', function(done){
		new MessageDB().messageAdd("jiyu", null, null, function(code) {
			expect(code).to.eql(200);
			done();
		});
	});

	test('Test AnnouncementDB', function(done){
		new AnnouncementDB().annoucementAdd("jiyu", null, null, function(code) {
			expect(code).to.eql(200);
			done();
		});
	});

	test('Test Message', function(done){
		new Message().getHistory(function(data) {
			expect(data.length).to.not.eql(0);
			done();
		});
	});


});
