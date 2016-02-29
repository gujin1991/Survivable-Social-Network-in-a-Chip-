var socket = io.connect();
var username;
var content = $('.msg');

$('#check-btn').on('click', function(e) {
	$.get('/announcement', function() {
		console.log("Click check-btn");
		window.location.href = "/announcement";
	});
});


// Post New message
$('#post-btn').on('click', function(e) {
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
// Display previous messages stored in database
$.get('/getHistory', function(data){
	for(var i=0; i<data.length; i++) {
		var message = data[i];
		var label = '<div style="color:gray" class="message">' +
						'<div class="messageHeader">' +
							'<span>' +
								'<span>' + message.userName +
								'</span>' +
								//'<img alt="OK" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/ok.png">' +
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
});

// Display user login information
socket.on('connect', function () {
	socket.emit('login',$("#myname").val());
});

// Display the new post message
socket.on('send message', function(message){
	//var label = '<div><span><span style="font-style: italic;">' + message.username + '</span> says: <strong>'+ message.text +' </strong> <small class="pull-right">' + now() + '</small></span></div><br/>';
	var label = '<div style="color:black" class="message">' +
			'<div class="messageHeader">' +
			'<span><span>' + message.username + '</span>' +
			//'<img alt="OK" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/ok.png">' +
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

//get current time
function now() {
    var date = new Date();
    var time = (date.getMonth() + 1)+ '/' + date.getDate() + '/' + date.getFullYear()  + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes());
    return time;
}

function sendMessage(){

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