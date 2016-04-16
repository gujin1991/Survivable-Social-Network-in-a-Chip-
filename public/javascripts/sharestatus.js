/**
 * Created by Pan on 2/25/16.
 */
var mystatus = $("#mystatus").val();

$(document).ready(function() {

    if (mystatus == "OK") {
        var logoName = "ok.png";
        $("#status-toggle").empty().append(
            'Status:<span><img alt="'+ mystatus +'" height="20px" width="20px" src="../images/icons/' + logoName + '">' + '</span><span class="caret"></span>');
    } else if (mystatus == "Help") {
        var logoName = "help.png";
        $("#status-toggle").empty().append(
            'Status:<span><img alt="'+ mystatus +'" height="20px" width="20px" src="../images/icons/' + logoName + '">' + '</span><span class="caret"></span>');
    } else if (mystatus == "Emergency") {
        var logoName = "emergency.png";
        $("#status-toggle").empty().append(
            'Status:<span><img alt="'+ mystatus +'" height="20px" width="20px" src="../images/icons/' + logoName + '">' + '</span><span class="caret"></span>');
    }
});

$("#status-ok").click(function(event) {
    event.preventDefault();
    updateStatus('OK');
});

$("#status-help").click(function(event) {
    event.preventDefault();
    updateStatus('Help');
});

$("#status-emergency").click(function(event) {
    event.preventDefault();
    updateStatus('Emergency');
});

function updateStatus(newstatus) {
    var statusContent;
    var logoName;
    if (newstatus == 'OK') {
        statusContent = "OK";
        logoName = "ok.png";
    } else if (newstatus == 'Help') {
        statusContent = "Help";
        logoName = "help.png";
    } else if (newstatus == 'Emergency') {
        statusContent = "Emergency";
        logoName = "emergency.png";
    }

    username = $('#myname').val();
    var obj = {'username':username,'status':statusContent};
    $.post("/updateStatus",obj,function(response){
        if (response.statusCode === 200) {
            $("#status-toggle").empty().append(
                'Status:<span><img alt="'+ statusContent +'" height="20px" width="20px" src="../images/icons/' + logoName + '">' + '</span><span class="caret"></span>');
            $("#mystatus").val(newstatus);
        } else if (response.statusCode === 410) {
            swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
        } else {
            swal({title: "Error!",text: "The status cannot status!", type: "error", confirmButtonText: "OK" });
        }
    });
}

socket.on('Log out',function() {
    swal({
        title: "Sorry! You are out...",
        text: "You were kicked out by Administrator!",
        type: "warning",
        showCancelButton: false,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "OK!",
        closeOnConfirm: false
    }, function(){
        window.location = "/logout";
    });
});