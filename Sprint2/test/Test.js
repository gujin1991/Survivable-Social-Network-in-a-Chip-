var expect = require('expect.js');
var User = require('../module/User.js');
var Status = require('../module/Status.js');

suite('Sprint 2 Test', function(){

	test('Test Hello World', function(done){
		new User().initialize("jiyu", null, null).updateStatus(new Status().help, function (code) {
			expect(code).to.eql(200);
			done();
		});
	});


});
