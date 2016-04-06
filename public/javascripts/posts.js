/**
 * Created by congshan on 4/6/16.
 */
var socket = io.connect();
var unread = 0;

socket.on('connect', function () {
    socket.emit('login',$("#myname").val());
});

socket.on('send post', function(post) {
    var myname = $('#myname').val();
    addPost(post, post.username, post.content);
    // pop out alert
    if (post.username != myname) {
        $.notify({
            title: 'New Post by '+post.username+": ",
            message: post.content
        },{
            newest_on_top: true
        });
    }
});

socket.on('send private message', function(message){
    swal({
        title: "Notification!",
        text: "You have a new message from " + message.sender,
        imageUrl: "../images/icons/message.png"
    });
});

$.get('/getPosts', function(data){
    for(var i=0; i<data.length; i++) {
        var post = data[i];
        addPost(post, post.userName, post.content);
    }
});

/**
 * show all posts.
 * */
$('#post-all-btn').on('click', function(e) {
    var div = $('#posts');
    div.empty();
    $('#post-mine-btn').text("My Posts");
    $('#post-mine-btn').removeAttr("disabled");
    $.get('/getPosts', function(data){
        for(var i=0; i<data.length; i++) {
            var post = data[i];
            addPost(post, post.userName, post.content);
        }
    });
});

/**
 * show my posts.
 * */
$('#post-mine-btn').on('click', function(e) {
    var div = $('#posts');
    var myname = $('#myname').val();
    div.empty();
    $.post('/getPostsByUsername', {'postUsername':myname}, function(data){
        for(var i=0; i<data.length; i++) {
            var post = data[i];
            addPost(post, post.userName, post.content);
        }
    });
});

/**
 * get the posts of user by clicking on his/her name.
 * */
$(document).on('click', '.my-btn-link', function(e){
    console.log("this is working ----- ");
    var div = $('#posts');
    var myname = $(this).text();
    console.log(myname);
    div.empty();
    $.post('/getPostsByUsername', {'postUsername':myname}, function(data){
        console.log(myname + data.length);
        for(var i=0; i<data.length; i++) {
            var post = data[i];
            addPost(post, post.userName, post.content);
        }
        $('#post-mine-btn').text(myname + "'s Posts");
        $('#post-mine-btn').attr("disabled", true);
    });
});

/**
 * send a new post.
 * */
$('#post-btn').on('click', function(e) {
    var content = $('#focusedInput').val();
    var username = $('#myname').val();
    var obj = {'userName': '', 'content':'', 'time':''};
    if(content === "") {
        swal({
            title: "Empty input!",
            text: "Post cannot be empty.",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: "Write something"
        }, function (inputValue) {
            if (inputValue === false) return false;
            if (inputValue === "") {
                swal.showInputError("Post cannot be empty!");
                return false;
            }
            obj['username'] = username;
            obj['content'] = inputValue;
            swal.close();
            $.post("/sendPost", obj, function () {});
        });
    } else {
        obj['username'] = username;
        obj['content'] = content;
        $.post("/sendPost",obj,function(){});
        $('#focusedInput').val('');
        $('#focusedInput').focus();
    }
    return false;
});

$('#focusedInput').on("keydown", function(e){
    if(e.which === 13){
        $('#post-btn').click();
        return false;
    }
});

function addPost(post, username, content) {
    var status = post.status;
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

    var div = $('#posts');
    var label = '<div class="panel panel-default">' +
                    '<div class="panel-heading">' +
                        '<button class="my-btn-link btn btn-link" type="submit">' + username + '</button>' +
                        '<img alt="' + status + '" height="20px" width="20px" style="margin-left: 5px;" src="../images/icons/' + logoName + '">' +
                        '<div class="timestamp pull-right">' +
                            '<i class="fa fa-clock-o fa-1"></i>' +
                            '<small style="margin-left: 5px;">' + post.time + '</small>' +
                        '</div>' +
                    '</div>' +
                    '<div class="panel-body">' +
                        '<p>' + content + '</p>' +
                    '</div>' +
                '</div>';
    var one = $(label);
    div.prepend(one);
}

