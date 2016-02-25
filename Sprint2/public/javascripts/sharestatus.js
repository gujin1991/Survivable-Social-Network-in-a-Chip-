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

$("status-emergency").click(function(event) {
    event.preventDefault();
    updateStatus('Emergency');
});

function updateStatus(newstatus) {
    var statusContent;
    var labelName;
    if (newstatus == 'OK') {
        statusContent = "OK";
        labelName = "label-ok";
    } else if (newstatus == 'Help') {
        statusContent = "Help";
        labelName = "label-Help";
    } else if (newstatus == 'Help') {
        statusContent = "Emergency";
        labelName = "label-Emergency";
    }

    $("#status-toggle").empty().append(
        'Status:<span class="label ' + labelName + '">' + statusContent + '</span><span class="caret"></span>');
    //Todo:updateUser List
    //Todo: send to server
}