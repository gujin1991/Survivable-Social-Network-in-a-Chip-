/**
 * Created by guangyu on 4/8/16.
 */
var expect = require('expect.js');
var http = require('http');
var request = require('request');

// TODO app.js may need to run first

var requestBody = {
    type: 'Great News!',
    content: 'integration test',
    sender: 'guangyuc'
};

suite('SSNoC Unit Test - Notification', function () {
    test('Test Get History', function (done) {
        request({
            url: "http://localhost:3001/notification",
            method: "POST",
            json: true,
            body: requestBody
        }, function (error, response, body) {
            if (error) {
                expect(error.code).to.equal('ECONNREFUSED');
                done();
            } else if (response) {
                console.log(response.statusCode);
                expect(response.statusCode).to.equal(200);
                done();
            }
        });
    });
});