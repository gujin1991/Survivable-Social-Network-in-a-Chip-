var socket = io.connect();
var username;
var content = $('.msg');

// Check if it is a new user
//jQuery( document ).ready(function( $ ) {
//
//});



// Post New message
$('#post-btn').on('click', function(e) {
	var text = $('#focusedInput').val();
    username = $('#myname').val();
	var obj = {'userName': '', 'content':'', 'time':''};
	if(text ==="") {
		swal({
			title: "Empty input!",
			text: "You need to write something!",
			type: "input",
			showCancelButton: true,
			closeOnConfirm: false,
			animation: "slide-from-top",
			inputPlaceholder: "Write something"
		}, function(inputValue){
			if (inputValue === false) return false;
			if (inputValue === "") {
				swal.showInputError("You need to write something!");
				return false
			}
			obj['username'] = username;
			obj['text'] = inputValue;
			console.log("client : "+ username +  text);
			swal.close()
			socket.emit('send message',obj);
		});
	} else {
		obj['username']=username;
		obj['text']=text;
		console.log("client : "+ username +  text);
		socket.emit('send message',obj);
		$('#focusedInput').val('');
		$('#focusedInput').focus();
	}
	return false;
});
// Display previous messages stored in database
$.get('/getHistory', function(data){

	for(var i=0; i<data.length; i++) {
		var message = data[i];
		var label = '<div style="color:gray"><span><span style="font-style: italic;">' + message.userName + '</span> said: <strong>'+ message.content +' </strong> <small class="pull-right">' + message.time + '</small></span></div><br/>';
		var one = $(label);
		content.append(one);
	};
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	var chat_body = $('#stream-list');
    var height = chat_body[0].scrollHeight;
    chat_body.scrollTop(height);
});

// Display user login information
socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});




// Display online user
//$.get('/getUsers', function(message){
//	console.log("-----------------online : "+ message.online);
//	console.log("-----------------offline : "+ message.offline);
//	var online_list = $(".online-list");
//	online_list.val('');
//	var online_users = message.online;
//	for(var i=0; i<online_users.length; i++) {
//		var label = '<div style="color:black"><span>' +  online_users[i] + '</span></div><br/>';
//		var one = $(label);
//		online_list.append(one);
//	}
//	var offline_list = $(".offline-list");
//	offline_list.val('');
//	var offline_users = message.offline;
//	for(var i=0; i<offline_users.length; i++) {
//		var label = '<div style="color:gray"><span>' +  offline_users[i] + '</span></div><br/>';
//		var one = $(label);
//		offline_list.append(one);
//	}
//});

// Display the new post message
socket.on('send message', function(message){
	var label = '<div><span><span style="font-style: italic;">' + message.username + '</span> says: <strong>'+ message.text +' </strong> <small class="pull-right">' + now() + '</small></span></div><br/>';
    var one = $(label);
	content.append(one);
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	var chat_body = $('#stream-list');
    var height = chat_body[0].scrollHeight;
    chat_body.scrollTop(height);
});

//updating the list of online and offline users
socket.on('updatelist',function(message){
	console.log("-----------------online : "+ message.online);
	console.log("-----------------offline : "+ message.offline);
	var online_list = $(".online-list");
	online_list.html("");
	var online_users = message.online;
	for(var i=0; i<online_users.length; i++) {
		var label = '<div style="color:black"><span>' +  online_users[i] + '</span></div><br/>';
		var one = $(label);
		online_list.append(one);
	}
	var offline_list = $(".offline-list");
	offline_list.html("");
	var offline_users = message.offline;
	for(var i=0; i<offline_users.length; i++) {
		var label = '<div style="color:gray"><span>' +  offline_users[i] + '</span></div><br/>';
		var one = $(label);
		offline_list.append(one);
	}
});



//get current time
function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}
$('#focusedInput').on("keydown", function(e){
	if(e.which === 13){
		$('#post-btn').click();
		return false;
	}
});
