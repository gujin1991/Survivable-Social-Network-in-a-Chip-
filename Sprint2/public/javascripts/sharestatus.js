/**
 * Created by Pan on 2/25/16.
 */
$(document).ready(function() {

});

$("#status-ok").click(function(evenet) {
    evenet.preventDefault();
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
    console.log(statusContent);
    console.log(logoName);
    username = $('#myname').val();
    var obj = {'username':username,'status':statusContent};
    $.post("/updateStatus",obj,function(response){
        if (response.statusCode === 200) {
            $("#status-toggle").empty().append(
                'Status:<span><img src="../images/icons/' + logoName + '">' + statusContent + '</span><span class="caret"></span>');
        } else {
            swal({title: "Error!",text: "The status cannot status!", type: "error", confirmButtonText: "OK" });

        }
    });
    //Todo:updateUser List
    //Todo: send to server
}