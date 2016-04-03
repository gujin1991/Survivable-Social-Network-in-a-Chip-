var socket = io.connect();
var username;
var content = $('#msgAnnounce');
var startDate;
var endDate;
var idArray;

// Check if it is a new user
//jQuery( document ).ready(function( $ ) {
//
//});
$('#back-btn').on('click', function(e) {
	//$.get('/announcement', function() {
		window.location.href = "/";
	//});
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
			$.post("/sendAnnouncements",obj,function(){

			});
		});
	} else {
		obj['username']=username;
		obj['text']=text;
		//socket.emit('send message',obj);
		//call api
		$.post("/sendAnnouncements",obj,function(){

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
    // $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    // var chat_body = $('#announce-stream-list');
    // var height = chat_body[0].scrollHeight;
    // chat_body.scrollTop(height);
});

// Display user login information
socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});

// Display the new post message
socket.on('send announcement', function(message){
	prependAnnouncement(message, message.username, message.text);
});


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

/**
 * Delete Message.
 * */
$('#deleteMsg-btn').on('click', function(e) {
	document.getElementById('deleteMsg-btn').style.display = "none";
	document.getElementById('cancel-btn').style.display = "block";
	document.getElementById('deleteAll-btn').style.display = "block";
	displayDatePicker();
	chooseDate();
});
$('#cancel-btn').on('click', function(e) {
	cancelOrDoneDel();
});

function chooseDate(){
	$("#txtFromDate").datepicker({
		maxDate: 0,
		numberOfMonths: 1,
		onSelect: function(selected) {
			$("#txtToDate").datepicker("option","minDate", selected);
			startDate = $(this).val().replace(/\b0(?=\d)/g, '');
			//alert(startDate);
		}
	});
	$("#txtToDate").datepicker({
		maxDate:0,
		numberOfMonths: 1,
		onSelect: function(selected) {
			$("#txtFromDate").datepicker("option","maxDate", selected);
			endDate = $(this).val().replace(/\b0(?=\d)/g, '');
			//alert(endDate);
		}
	});
}

$('#deleteAll-btn').on('click', function(e) {
	if (startDate == undefined || endDate == undefined) {
		sweetAlert("Warning", "You must choose the dates to delete!!", "warning");
		return;
	}
	var dateRange = {"startDate":startDate,"endDate": endDate};
	$.get('/searchAnnounceByDate',dateRange, function(response) {
		if (response === 400) {
			swal({title: "Error!", text: "Error.", type: "error", confirmButtonText: "OK"});
		} if (response  === 0) {
			swal({title: "Error!", text: "No such data.", type: "error", confirmButtonText: "OK"});
		} else {
			var count = response;
			swal({
				title: "Are you sure?",
				text: "You will not be able to recover these messages" + count + " From " + startDate + " To " + endDate + " ?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Yes, delete it!",
				closeOnConfirm: false
			}, function(){
				$.ajax({
					url: '/deleteAnnounceByDate',
					type: 'DELETE',
					data: {"startDate":startDate,"endDate": endDate},
					success: function() {
						swal("Deleted!", count + " messages have been deleted.", "success");
						cancelOrDoneDel();
					}
				});
			});
		}
	});
});

function displayDatePicker() {
	var label = '<span>' +
			'<form class="form-inline" id="date-form">' +
				'<label>From</label>' +
				'<input id="txtFromDate" type="text" class="form-control" placeholder="Start Date">' +
				'<label>To </label>' +
				'<input id="txtToDate" type="text" class="form-control" placeholder="End Date">' +
			'</form></span>';
	var one = $(label);
	$("#dateForm").append(one);
}

function cancelOrDoneDel() {
	$("#dateForm").empty();
	document.getElementById('cancel-btn').style.display = "none";
	document.getElementById('deleteAll-btn').style.display = "none";
	document.getElementById('deleteMsg-btn').style.display = "block";
}