/**
 * Created by congshan on 3/21/16.
 */
var value = 0;
var interval = setInterval(function() {
    value += 10;
    $("#progress-bar")
        .css("width", value + "%")
        .attr("aria-valuenow", value)
        .text(value + "%");
    if (value >= 100)
        clearInterval(interval);
}, 1000);