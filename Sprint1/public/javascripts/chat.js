var socket = io.connect();
var username;
var content = $('.msg');

// Post New message
$('#post-btn').on('click', function(e) {
	var text = $('#focusedInput').val();
    username = $('#myname').val();
	var obj = {'username': '', 'text':'', 'time':''};
	if(text ==="") {
		console.log("Empty!");
		return false;
	} else {
		obj['username']=username;
		obj['text']=text;
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
		var label = '<div style="color:gray"><span><span style="font-style: italic;">' + message.username + '</span> said: <strong>'+ message.text +' </strong> <small class="pull-right">' + message.time + '</small></span></div><br/>';
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

// Display system message
socket.on('system_message', function (time, content) {
    var msg_list = $(".msg-list");
    msg_list.append(
        '<div class="pull-left">' + content + '</div><div class="pull-right"><small>(At ' + time + ')</small></div>');
	var chat_body = $('.msg-list');
    var height = chat_body[0].scrollHeight;
    chat_body.scrollTop(height);
});

// Display the new post message
socket.on('send message', function(message){
	console.log(message);
	var label = '<div><span><span style="font-style: italic;">' + message.username + '</span> says: <strong>'+ message.text +' </strong> <small class="pull-right">' + now() + '</small></span></div><br/>';
    var one = $(label);
	content.append(one);
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	var chat_body = $('#stream-list');
    var height = chat_body[0].scrollHeight;
    chat_body.scrollTop(height);
});
// Log out
function logout(){
    window.location.replace(window.location);
}

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
