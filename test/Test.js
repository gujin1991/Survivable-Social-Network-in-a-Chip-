var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');
var MessageDB = require('../module/MessageDb.js');
var Announcement = require('../module/Announcement.js');
var Message = require('../module/Message.js');
var joinCommunity = require('../controllers/JoinCommunity.js');
var PrivateMessage = require('../module/PrivateMessage.js');

// 缺delete tester函数
// 在app.js还得加上getUser的静态函数，实现与getUserInfo大体一致
// 缺将database返回的信息与预想对比的函数

suite('Sprint 2 Test', function(){

	test('Test Register', function(done){
		new User()
		.initialize("TesterJin", "19911991", new Status().ok)
		.userAdd(function(err, user) {
			if(!err) {
				expect(user.userName).to.eql("TesterJin");
				done();
			}else {
				expect(err).to.eql(400);
				done();
			} 
		});
		//new User().initialize("TesterYu", "19931993", new Status().ok);	
	});

	test('Test Register2', function(done){
		new User()
		.initialize("TesterYu", "19931993", new Status().ok)
		.userAdd(function(err, user) {
			//console.log(err);
			if(!err) {
				//console.log(user.userName);
				expect(user.userName).to.eql("TesterYu");
				done();
			}else {

				expect(err).to.eql(400);
				done();
			} 
		});
		//new User().initialize("TesterYu", "19931993", new Status().ok);	

	});




	test('Test getUserInfo', function(done) {
		new User()
		//.initialize("TesterJin", "19911991", new Status().ok)
		.getUserInfo("TesterJin", function(err, user) {
			if(!err) {
				//console.log(user.userName);
				expect(user.userName).to.eql("TesterJin");
				done();
			}else {
				expect(err).to.eql(400);
				done();
			} 
		});
		
	});


	test('Test ShareStatus', function(done){
		//User.getUserInfo()
		new User().getUserInfo("TesterJin", function(err, user) {
			if(!err) {
				new User().initialize(user.userName, "19911991", new Status().ok)
				.updateStatus(new Status().help, function(code) {
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


	test('Test ChatPrivate', function(done) {
		new User()//.initialize("TesterJin", "19911991", new Status().ok)
		.getUserInfo("TesterJin", function(err1, user1) {
			if(!err1) {
				new User()//.initialize("TesterYu", "19931993", new Status().ok)
				.getUserInfo("TesterYu", function(err2, user2) {
					//console.log(user1.userName + "  " + user2.userName);
					if(!err2) {
						new PrivateMessage(user1.userName, user2.userName, "Hello, Yu!", "OK", "03/12/16")
						.addMessage(user1.userName, user2.userName, "Hello, Yu!", "03/12/16", "OK", function(code) {
							expect(code).to.eql(200);
						})
						.getHistory(user1.userName, user2.userName, function(rows) {
							var len = rows.length;
							console.log(rows[len - 1] + "good" + len);
							expect(rows[len - 1].content).to.eql("Hello, Yu!");
							done();
						});	
					} else {
						expect(err2).to.eql(400);
						done();	
					}
				});	
			} else {
				expect(err1).to.eql(400);
				done();
			}
		});
	});

	test('Test SendAnnouncement', function(done) {
		new User().getUserInfo("TesterJin", function(err, user) {
			if(!err) {
				new Announcement(user.userName, "Test announcement!", "03/12/16").addAnnoucement(user.userName, "Test announcement!", "03/12/16", function(code) {
					expect(code).to.eql(200);
				}).getDetails(function(rows) {
					var len = rows.length;
					//console.log(rows[len - 1].content + "  "+ len);
					expect(rows[len - 1].content).to.eql("Test announcement!");
					done();
				});	
			}
		});
	});

});
