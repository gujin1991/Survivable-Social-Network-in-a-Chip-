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
        duration = parseInt(duration) * 1000;
        interval = parseInt(interval);

        the_interval =  setTimeout(testPost, interval);
        setTimeout(stop,duration);

        intervals = setInterval(progress, duration/100);
    }
    return false;
});

function stop() {
    clearInterval(the_interval);
    $('#stop-btn').prop('disabled', true);
}

function testPost() {
    count ++;
    console.log(count);
}

function testGet() {
    alert("get");
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
    clearTimeout(the_duration);
    $('#duration').val('');
    $('#interval').val('');
});