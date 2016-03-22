/**
 * Created by congshan on 3/21/16.
 */
var value = 0;
var duration;
var interval;
var the_interval;
var the_duration;
var intervals;
var count = 0;
$('#start-btn').click(function() {
    duration = $('#duration').val();
    interval = $('#interval').val();
    if(duration ==="" || interval ==="") {
        swal({title: "Error!",text: "Please enter!", type: "error", confirmButtonText: "OK" });
    } else if (duration > 20) {
        swal({title: "Error!",text: "cannot greater than 5s!", type: "error", confirmButtonText: "OK" });
    } else {
        $('#stop-btn').prop('disabled', false);
        $('#start-btn').prop('disabled', true);
        duration = parseInt(duration) * 1000;
        interval = parseInt(interval);
        $.post('/testModeStart',function(response){
            if (response.statusCode === 410) {
                swal({title: "Error!",text: "Already in Test!", type: "error", confirmButtonText: "OK" });
            } else if (response.statusCode === 412) {
                swal({title: "Error!",text: "Time Exceed!", type: "error", confirmButtonText: "OK" });
            }
        });
        the_interval =  setInterval(testPost, interval);
        the_duration = setTimeout(next,duration/2);

        intervals = setInterval(progress, duration/10);
    }
    return false;
});
function next() {
    clearInterval(the_interval);
    the_interval = setInterval(testGet, interval);
    the_duration = setTimeout(stop,duration/2);
}
function stop() {
    clearInterval(the_interval);
    $.post('/endMeasurePerformance',function(response){
        if (response.statusCode === 411) {
            swal({title: "Error!",text: "Not in Test Mode!", type: "error", confirmButtonText: "OK" });
        } else {
            $('#number-of-post').val(response.postCount)
            $('#number-of-get').val(response.getCount)
        }
    });
    $('#stop-btn').prop('disabled', true);
    $('#duration').val('');
    $('#interval').val('');
}

function testPost() {
    count ++;
    var username = $('#myname').val();
    var message = {'username': username, 'text': "This is a test message when testing POST: No.'" + count};
    console.log(message);
    $.post("/testPost",message,function(response){
        if (response.statusCode === 400) {
            swal({title: "Error!",text: "Cannot get Messages!", type: "error", confirmButtonText: "OK" });
        } else if (response.statusCode === 411) {
            swal({title: "Error!",text: "Not in Test Mode!", type: "error", confirmButtonText: "OK" });
        }
    });
}

function testGet() {
    console.log("here");
    $.get("/testGet",function(response){
        if (response.statusCode === 411) {
            swal({title: "Error!",text: "Not in Test Mode!", type: "error", confirmButtonText: "OK" });
        }
    });
}
function progress() {
    value += 10;
    $("#progress-bar")
        .css("width", value + "%")
        .attr("aria-valuenow", value)
        .text(value + "%");
    if (value >= 100)
        clearInterval(intervals);
}

$('#stop-btn').click(function() {
    clearInterval(the_interval);
    clearInterval(intervals);
    $("#progress-bar")
        .css("width", 0 + "%")
        .attr("aria-valuenow", 0)
        .text(0+ "%");
    $.post('/testModeQuit',function(response){
        if (response.statusCode === 411) {
            swal({title: "Error!",text: "Not in Test Mode!", type: "error", confirmButtonText: "OK" });
        }
    });
    $('#stop-btn').prop('disabled', true);
    $('#duration').val('');
    $('#interval').val('');
});