/**
 * Created by Pan on 4/15/16.
 */
var user = $('#user');
var oldAccount = $('#account').val();
var oldPrivilege = $('#privilege').val();
var oldName = $('#userName').val();
var oldPassword = $('#password').val();
var adminName = $('#adminName').val();
var $submit = $('#submit');
if (oldAccount == 'active') {
    $('.BSswitch').bootstrapSwitch('state', true);
} else {
    $('.BSswitch').bootstrapSwitch('state', false);
}
$.post('/getStatus',{'username':adminName},function(response){

    if (response.statusCode === 200) {
        var mystatus = response.status;
        var statusContent;
        if (mystatus == 'OK') {
            statusContent = "OK";
            logoName = "ok.png";
        } else if (mystatus == 'Help') {
            statusContent = "Help";
            logoName = "help.png";
        } else if (mystatus == 'Emergency') {
            statusContent = "Emergency";
            logoName = "emergency.png";
        }
        if (statusContent != undefined) {
            $("#status-toggle").empty().append(
                'Status:<span><img alt="'+ statusContent +'" height="20px" width="20px" src="../images/icons/' + logoName + '">' + '</span><span class="caret"></span>');
        }
    } else if (response.statusCode === 410) {
        swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
    }

});

var newPrivilege = oldPrivilege;
$('#new_privilege').change(function(){
    newPrivilege = $(this).val();
});
//submit the change file.
$submit.on('click', function(e) {
    var newName = $('#new_userName').val();
    var newPassword = $('#new_password').val();
    var temp = $("#new_account").bootstrapSwitch('state');
    var newAccount;
    if (temp) {
        newAccount = "active";
    } else {
        newAccount = "inactive";
    }
    if (!newName || newName.length < 2) {
        swal({title: "Invalid username!",text: "The username should be at least 2 character long!", type: "error", confirmButtonText: "OK" });

    } else if( !newPassword || newPassword.length < 4) {
        swal({title: "Invalid password!",text: "The password should be at least 4 character long!", type: "error", confirmButtonText: "OK" });

    } else if(newAccount == oldAccount && newPrivilege == oldPrivilege && newName == oldName && newPassword == oldPassword) {
        swal({title: "Nothing Changed!",text: "Nothing is changed! If you want to administer this profile, please make some difference!", type: "warning", confirmButtonText: "OK" });

    } else {
        $.ajax({
            url: '/updateProfile',
            type: 'PUT',
            data: {
                username : newName,
                oldUsername: oldName,
                accountStatus : newAccount,
                oldAccountStatus: oldAccount,
                password : newPassword,
                oldPassword : oldPassword,
                privilege : newPrivilege,
                oldPrivilege : oldPrivilege
            },
            success: function(response) {
                //console.log(response);
                if (response.statusCode === 200) {
                    swal({
                        title: "Good job!",
                        text: "You Update your Information!",
                        type: "success",
                        showCancelButton: false,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK!",
                        closeOnConfirm: false
                    }, function(){
                        window.location = "/seeProfile/" + newName;
                    });
                } else if (response.statusCode === 401) {
                    swal({
                        title: "Something Wrong!",
                        text: "This Username is already existed",
                        type: "error",
                        confirmButtonText: "OK"
                    });
                } else if (response.statusCode === 410) {
                    swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
                }
            }
        });
    }
});

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
