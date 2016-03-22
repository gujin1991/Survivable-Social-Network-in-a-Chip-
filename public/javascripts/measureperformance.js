/**
 * Created by congshan on 3/21/16.
 */
var value = 0;
var duration;
var interval;
var the_interval;
var another_interval;
var the_duration;
var intervals;
var count = 0;
$('#start-btn').click(function() {
    duration = $('#duration').val();
    interval = $('#interval').val();
    value = 0;
    $("#progress-bar")
        .css("width", value + "%")
        .attr("aria-valuenow", value)
        .text(value+ "%");
    if(duration ==="" || interval ==="") {
        swal({title: "Error!",text: "Please enter!", type: "error", confirmButtonText: "OK" });
    } else if (duration > 5) {
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

    another_interval = setInterval(testGet, interval);
    the_duration = setTimeout(stop,duration/2);
}

function stop() {
    clearInterval(another_interval);
    $.post('/endMeasurePerformance',function(response){
        console.log(response);
        if (response.statusCode === 411) {
            swal({title: "Error!",text: "Testing Outages!", type: "error", confirmButtonText: "OK" });
        } else {
<<<<<<< HEAD
            var time = duration / (interval * 2);
            document.getElementById('number-of-post').innerHTML = response.postCount / time + "";
            document.getElementById('number-of-get').innerHTML = response.getCount / time + "";
=======

            document.getElementById('number-of-post').innerHTML = response.postCount * 2 *1000 / duration + "";
            document.getElementById('number-of-get').innerHTML = response.getCount * 2 * 1000 / duration + "";

>>>>>>> 2d24c7b124f9b5065a48f8a4f051f542e956da95
        }
    });
    clear();
}

function testPost() {
    count ++;

    var username = $('#myname').val();
    var message = {'username': username, 'text': "This is a test message when testing POST: No.'" + count};
    //console.log(message);
    $.post("/testPost",message,function(response){


        if (response.statusCode === 400) {
            swal({title: "Error!",text: "Cannot get Messages!", type: "error", confirmButtonText: "OK" });
        } else if (response.statusCode === 411) {
<<<<<<< HEAD
            swal({title: "Error!",text: "Testing Outages!", type: "error", confirmButtonText: "OK" });
=======

            swal({title: "Error!",text: "Testing Outages!", type: "error", confirmButtonText: "OK" });
        }else if (response.statusCode === 413) {

            clearInterval(intervals);
            clearInterval(another_interval);
            clearInterval(the_interval);

            $.post('/testModeQuit',function(response){
                if (response.statusCode === 411) {
                    swal({title: "Error!",text: "Testing Outages!", type: "error", confirmButtonText: "OK" });
                }
            });

            $("#progress-bar")
                .css("width", 0 + "%")
                .attr("aria-valuenow", 0)
                .text(0+ "%");
            clear();
            document.getElementById('number-of-post').innerHTML = "0";
            document.getElementById('number-of-get').innerHTML = "0";

            swal({title: "Error!",text: "Post more than Limit !", type: "error", confirmButtonText: "OK" });


>>>>>>> 2d24c7b124f9b5065a48f8a4f051f542e956da95
        }
    });

}

function testGet() {
    //console.log("here");
    $.get("/testGet",function(response){
        if (response.statusCode === 411) {
            swal({title: "Error!",text: "Testing Outages!", type: "error", confirmButtonText: "OK" });
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
    clearInterval(another_interval);
    clearInterval(intervals);

    $.post('/testModeQuit',function(response){
        if (response.statusCode === 411) {
            swal({title: "Error!",text: "Testing Outages!", type: "error", confirmButtonText: "OK" });
        }
    });

    $("#progress-bar")
        .css("width", 0 + "%")
        .attr("aria-valuenow", 0)
        .text(0+ "%");
    clear();
    document.getElementById('number-of-post').innerHTML = "0";
    document.getElementById('number-of-get').innerHTML = "0";
});

function clear() {
    $('#stop-btn').prop('disabled', true);
    $('#start-btn').prop('disabled', false);
    $('#duration').val('');
    $('#interval').val('');
}