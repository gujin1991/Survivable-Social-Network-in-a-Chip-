/**
 * Created by Pan on 3/20/16.
 */
var page;

$('#search-public-btn').click(function() {
    cancelDelete();
    var keywords = $('#searchPublicMsg').val();
    if (keywords === "") {
        swal({title: "Error!",text: "Please enter!", type: "error", confirmButtonText: "OK" });
    } else {
        var tableID = 'stream-list';
        var tbodyID = 'msg';
        var search = {"keyword": keywords};
        $.post('/searchPublic', search, function(messages){
            console.log(messages);
            document.getElementById("searchResult").style.display = "block";
            if (messages == undefined || messages.length == 0) {
                swal({title: "Message Not Found!",text: "No Matches.", type: "error", confirmButtonText: "OK" });
            } else if (messages.statusCode === 401) {
                swal({title: "Error!",text: "All Stop Words.", type: "error", confirmButtonText: "OK" });
            } else {
                $('#msg').html('');
                displayResult(messages.length, messages,tableID, tbodyID, false);
            }
        });
        $('#searchPublicMsg').val('');
    }
});
$('#cancel-public-btn').click(function() {
    location.reload();
    document.getElementById('deleteMsg-btn').style.display = "block";
});

$('#search-private-btn').click(function() {
    cancelDelete();
    var keywords = $('#searchPrivateMsg').val();
    if (keywords === "") {
        swal({title: "Error!",text: "Please enter!", type: "error", confirmButtonText: "OK" });
    } else {
        var tableID = 'private-stream-list';
        var tbodyID = 'msgPrivate';
        var search = {"keyword": keywords};
        $.post('/searchPrivate', search, function(messages){
            document.getElementById("searchResult").style.display = "block";
            console.log(messages);
            if (messages == undefined || messages.length == 0) {
                swal({title: "Message Not Found!",text: "No Matches.", type: "error", confirmButtonText: "OK" });
            } else if (messages.statusCode === 401) {
                swal({title: "Error!",text: "All Stop Words.", type: "error", confirmButtonText: "OK" });
            } else {
                $('#msgPrivate').html('');
                displayResult(messages.length, messages,tableID, tbodyID, false);
            }
        });
        $('#searchPrivateMsg').val('');
    }
});
$('#cancel-private-btn').click(function() {
    location.reload();
    document.getElementById("searchResult").style.display = "none";
    document.getElementById('deleteMsg-btn').style.display = "block";
});


$('#search-announce-btn').click(function() {
    var keywords = $('#searchAnnounceMsg').val();
    if (keywords === "") {
        swal({title: "Error!",text: "Please enter!", type: "error", confirmButtonText: "OK" });
    } else {
        var tableID = 'announce-stream-list';
        var tbodyID = 'msgAnnounce';
        var search = {"keyword": keywords};
        $.post('/searchAnnouncement', search, function(messages){
            document.getElementById("searchResult").style.display = "block";
            if (messages == undefined || messages.length == 0) {
                swal({title: "Announcement Not Found!",text: "No Matches.", type: "error", confirmButtonText: "OK" });
            } else if (messages.statusCode === 401) {
                swal({title: "Error!",text: "All Stop Words.", type: "error", confirmButtonText: "OK" });
            } else {
                $('#msgAnnounce').html('');
                displayResult(messages.length, messages,tableID, tbodyID, true);
            }
        });
        $('#searchAnnounceMsg').val('');
    }
});
$('#cancel-announce-btn').click(function() {
    location.reload();
    document.getElementById("searchResult").style.display = "none";
});

function displayResult(rows, messages, tableID, tbodyID, reverse) {
    if (reverse) {
        messages = messages.reverse();
    }
    if (document.getElementById(tableID)) {
        page = new PagingClass(3, rows, messages,tbodyID);
        document.getElementById('pageindex').innerHTML = page.pageIndex + 1 + ' / ' + page.pageCount;
    }
}

function nextPage() {
    page.nextPage();
    document.getElementById('pageindex').innerHTML = page.pageIndex + 1 + ' / ' + page.pageCount;
}

function prePage() {
    page.prePage();
    document.getElementById('pageindex').innerHTML = page.pageIndex + 1 + ' / ' + page.pageCount;
}

function cancelDelete() {
    document.getElementById('cancel-btn').style.display = "none";
    document.getElementById('deleteAll-btn').style.display = "none";
    document.getElementById('deleteMsg-btn').style.display = "none";
}