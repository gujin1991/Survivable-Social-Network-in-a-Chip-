/**
 * Created by congshan on 3/21/16.
 */
var value = 0;
var the_timer = 0;
var duration;
var interval;
var halfDuration;
var the_interval;
var the_duration;
$('#start-btn').click(function() {
    duration = $('#duration').val();
    interval = $('#interval').val();
    if(duration ==="" || interval ==="") {
        swal({title: "Error!",text: "Please enter!", type: "error", confirmButtonText: "OK" });
    } else if (duration > 20) {
        swal({title: "Error!",text: "cannot greater than 5s!", type: "error", confirmButtonText: "OK" });
    } else {
        $('#stop-btn').prop('disabled', false);
        duration = parseInt(duration) * 1000;
        interval = parseInt(interval);
        halfDuration = duration / 2;
        //the_interval =  setInterval(testGet(), interval);
        //the_duration = setTimeout(stop,duration);
        timedCount(duration, interval, halfDuration);
    }
    return false;
});
function stop() {
    clearInterval(the_interval);
    $('#stop-btn').prop('disabled', true);
}

function timedCount(duration, interval, halfDuration) {
    while (duration > halfDuration) {
        the_interval =  setInterval(testPost(duration), interval);
        duration = duration - 1000;
    } clearInterval(the_interval);
    while (duration > 0) {
        the_interval =  setInterval(testGet(duration), interval);
        duration = duration - 1000;
    } clearInterval(the_interval);
    alert("stop");

}
function testPost(duration) {
    alert("post" + duration);
}

function testGet(duration) {
    alert("get" + duration);
}

var intervals = setInterval(function() {
    value += 10;
    $("#progress-bar")
        .css("width", value + "%")
        .attr("aria-valuenow", value)
        .text(value + "%");
    if (value >= 100)
        clearInterval(intervals);
}, 1000);

$('#stop-btn').click(function() {
    //clearTimeout(the_timer);
    $('#duration').val('');
    $('#interval').val('');
});