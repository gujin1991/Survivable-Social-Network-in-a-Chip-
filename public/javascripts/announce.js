var socket = io.connect();
var username;
var content = $('#msgAnnounce');

$('#back-btn').on('click', function(e) {
	window.location.href = "/";
});

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
			swal.close();
			//socket.emit('send message',obj);
			$.post("/sendAnnouncements",obj,function(response){
				if (response.statusCode === 410) {
					swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
				}
			});
		});
	} else {
		obj['username']=username;
		obj['text']=text;
		$.post("/sendAnnouncements",obj,function(response){
			if (response.statusCode === 410) {
				swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
			}
		});

		$('#focusedInput').val('');
		$('#focusedInput').focus();
	}
	return false;
});
// Display previous messages stored in database
$.get('/getAnnouncements', function(data){
	for(var i=0; i<data.length; i++) {
		var message = data[i];
		prependAnnouncement(message, message.userName, message.content);
	}
});

// Display user login information
socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});

// Display the new post message
socket.on('send announcement', function(message){
	prependAnnouncement(message, message.username, message.text);
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

socket.on('send private message', function(message){
	swal({   title: "Notification!",   text: "You have a new message from " + message.sender,   imageUrl: "../images/icons/message.png" });
});

function prependAnnouncement(message, username, text) {
	var status = message.status;
	var logoName;
	if (status == 'OK') {
		logoName = "ok.png";
	} else if (status == 'Help') {
		logoName = "help.png";
	} else if (status == 'Emergency') {
		logoName = "emergency.png";
	} else if (status == 'Undefined' || status == undefined) {
		logoName = "undefined.png";
	}

	var label = '<div style="color:gray" class="message">' +
		'<div class="messageHeader">' +
		'<span>' +
		'<span>' + username +
		'</span>' +
		'<img alt="' + status + '" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/' + logoName + '">' +
		'<div class="timestamp pull-right">' +
		'<i class="fa fa-clock-o fa-1"></i>' +
		'<small style="margin-left: 5px;">' + message.time + '</small>' +
		'</div>' +
		'</span>' +
		'</div>' +
		'<div class="messageBody">' +
		'<strong>'+ text +' </strong> '+
		'</div>' +
		'</div>';
	var one = $(label);
	content.prepend(one);
}

socket.on('Log out',function() {
	swal({
		title: "Oops...",
		text: "Your session has expired. Please log in again!",
		type: "warning",
		showCancelButton: false,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "OK!",
		closeOnConfirm: false
	}, function(){
		window.location = "/logout";
	});
});