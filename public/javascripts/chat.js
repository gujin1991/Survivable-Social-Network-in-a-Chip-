/**
 * @chat.js
 * Provides front end support for user case ChatPublicly.
 *
 * ChatPublicly is the feature for users to chat with others
 * publicly. The chat history is loaded every time the user
 * logs in. Users can see all the messages from other people.
 */

/** @global */
var socket = io.connect();
var username = $('#myname').val();
var content = $('#msg');
var deleteFlag = false;
/**
 * Get user status.
 */
$.post('/getStatus',{'username':username},function(response){

	if (response.statusCode === 200) {
		var mystatus = response.status;
        var statusContent;
		if (mystatus == 'OK') {
			statusContent = "OK";
			logoName = "ok.png";
		} else if (mystatus == 'Help') {
			statusContent = "Help";
			logoName = "help.png";
		} else if (mystatus == 'Emergency') {
			statusContent = "Emergency";
			logoName = "emergency.png";
		}
		//swal({title: "Test Success!",text: "just a test !", type: "error", confirmButtonText: "OK" });
        if (statusContent != undefined) {
            $("#status-toggle").empty().append(
                'Status:<span><img alt="'+ statusContent +'" height="20px" width="20px" src="../images/icons/' + logoName + '">' + '</span><span class="caret"></span>');
        }
    }else{
		console.log("err");
	}

});

/**
 * Update the current user status.
 * */
socket.on('updatelist', function(response){
	console.log("in chat. js -----------------status : " + response.currentUser.status);
	$("#mystatus").val(response.currentUser.status);
	mystatus = $("#mystatus").val();

	if (mystatus == 'OK') {
		statusContent = "OK";
		logoName = "ok.png";
	} else if (mystatus == 'Help') {
		statusContent = "Help";
		logoName = "help.png";
	} else if (mystatus == 'Emergency') {
		statusContent = "Emergency";
		logoName = "emergency.png";
	}

});
/**
 * Delete Message.
 * */
$('#deleteMsg-btn').on('click', function(e) {
	document.getElementById('deleteMsg-btn').style.display = "none";
	document.getElementById('cancel-btn').style.display = "block";
	document.getElementById('deleteAll-btn').style.display = "block";
	deleteFlag = true;
	$.get('/getHistory', function(data){
		displayHistory(data);
	});
});
$('#cancel-btn').on('click', function(e) {
	cancelOrDoneDel();
});
function cancelOrDoneDel() {
	document.getElementById('cancel-btn').style.display = "none";
	document.getElementById('deleteAll-btn').style.display = "none";
	document.getElementById('deleteMsg-btn').style.display = "block";
	deleteFlag = false;
	$.get('/getHistory', function(data){
		displayHistory(data);
	});
}
$('#deleteAll-btn').on('click', function(e) {
	var idArray = "";
	var count = 0;
	$.each($("input[name='messages']:checked"), function(){
		idArray += $(this).val() + ",";
		count++;
	});
	if (idArray == "") {
		sweetAlert("Warning", "You must choose at least one message to delete!!", "warning");
		return;
	}
	swal({
		title: "Are you sure?",
		text: "You will not be able to recover these " + count + " messages!",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, delete it!",
		closeOnConfirm: false
	}, function(){
		$.ajax({
			url: '/deleteMessage',
			type: 'DELETE',
			data: {"idArray":idArray},
			success: function() {
				swal("Deleted!", count + " messages have been deleted.", "success");
				//$.get('/getHistory', function(data){
				//	displayHistory(data);
				//});
				cancelOrDoneDel();
			}
		});
	});
});
/**
 * Post a New Message.
 * */
$('#post-btn').on('click', function(e) {
	if (deleteFlag) {
		alert("Please cancel delete first");
		return;
	}
	var text = $('#focusedInput').val();
    username = $('#myname').val();
	var obj = {};
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
			//socket.emit('send message',obj);
			$.post("/sendPublicMessage",obj,function(response){
				if (response.statusCode === 400) {
					swal({title: "Error!",text: "Cannot get Messages!", type: "error", confirmButtonText: "OK" });
				}
			});
		});
	} else {
		obj['username']=username;
		obj['text']=text;
		console.log("client : "+ username +  text);

		//socket.emit('send message',obj);
		//call api
		$.post("/sendPublicMessage",obj,function(response){
			if (response.statusCode === 400) {
				swal({title: "Error!",text: "Cannot get Messages!", type: "error", confirmButtonText: "OK" });
			}
		});

		$('#focusedInput').val('');
		$('#focusedInput').focus();
	}
	return false;
});

/**
 * Display previous messages stored in database.
 * */
$.get('/getHistory', function(data){
	displayHistory(data);
});

function displayHistory(data) {
	content.empty();
	for(var i=0; i<data.length; i++) {
		var message = data[i];

		var status = message.status;
		var logoName;
		if (status == 'OK') {
			logoName = "ok.png";
		} else if (status == 'Help') {
			logoName = "help.png";
		} else if (status == 'Emergency') {
			logoName = "emergency.png";
		} else if (status == 'Undefined') {
			logoName = "undefined.png";
		}
		var label = '<div style="color:gray" class="message">' +
						'<div class="messageHeader">';
		if (message.userName == username && deleteFlag) {
			label += '<span><input type="checkbox" name="messages" value="'+message.messageId +'" /></span>';
		}
		label += '<span>' + message.userName +
				'</span>' +
				'<img alt="' + status + '" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/' + logoName + '">' +
				'<div class="timestamp pull-right">' +
				'<i class="fa fa-clock-o fa-1"></i>' +
				'<small style="margin-left: 5px;">' + message.time + '</small>' +
				'</div>' +
				'</span>' +
				'</div>' +
				'<div class="messageBody">' +
				'<strong>'+ message.content +' </strong> '+
				'</div>' +
				'</div>';
		var one = $(label);
		content.append(one);
	}
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	var chat_body = $('#stream-list');
	var height = chat_body[0].scrollHeight;
	chat_body.scrollTop(height);
}
/**
 * Display user login information.
 * */
socket.on('connect', function () {
	socket.emit('login',$("#myname").val());
});

/**
 * Display the new post message.
 * */
socket.on('send message', function(message){
	//var label = '<div><span><span style="font-style: italic;">' + message.username + '</span> says: <strong>'+ message.text +' </strong> <small class="pull-right">' + now() + '</small></span></div><br/>';
	var status = message.status;
	var logoName;
	if (status == 'OK') {
		logoName = "ok.png";
	} else if (status == 'Help') {
		logoName = "help.png";
	} else if (status == 'Emergency') {
		logoName = "emergency.png";
	} else if (status == 'Undefined') {
		logoName = "undefined.png";
	}

	console.log("*******************\nstatus:" + status);

	var label = '<div style="color:black" class="message">' +
			'<div class="messageHeader">' +
			'<span><span>' + message.username + '</span>' +
			'<img alt="' + status + '" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/' + logoName + '">' +
			'<div class="timestamp pull-right">' +
			'<i class="fa fa-clock-o fa-1"></i>' +
			'<small style="margin-left: 5px;">' + now() + '</small>' +
			'</div>' +
			'</span>' +
			'</div>' +
			'<div class="messageBody"><strong>'+ message.text +' </strong></div></div>';
	var one = $(label);
	content.append(one);
	$("html, body").animate({ scrollTop: $(document).height() }, 1000);
	var chat_body = $('#stream-list');
	var height = chat_body[0].scrollHeight;
	chat_body.scrollTop(height);
});

/**
 * Get the Current Time.
 * */
function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}

/**
 * Enable the usage of '\n' to send a message.
 * */
$('#focusedInput').on("keydown", function(e){
	if(e.which === 13){
		$('#post-btn').click();
		return false;
	}
});

/**
 * New private message alert.
 * */
socket.on('send private message', function(message){
	swal({   title: "Notification!",   text: "You have a new message from " + message.sender,   imageUrl: "../images/icons/message.png" });
});