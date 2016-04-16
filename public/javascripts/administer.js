/**
 * Created by Pan on 4/15/16.
 */
/**
 * Created by jiyushi1 on 4/1/16.
 */

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
        //swal({title: "Test Success!",text: "just a test !", type: "error", confirmButtonText: "OK" });
        if (statusContent != undefined) {
            $("#status-toggle").empty().append(
                'Status:<span><img alt="'+ statusContent +'" height="20px" width="20px" src="../images/icons/' + logoName + '">' + '</span><span class="caret"></span>');
        }
    }else{
        console.log("err");
    }

});

////set previous skill or gender.
//$(function setSkilAndGender() {
//    $("#Gender").val(gender);
//    $("#Skill").val(skill);
//});

//submit the change file.
$submit.on('click', function(e) {
    var newAccount = $('#new_account').val();
    var newPrivilege = $('#new_privilege').val();
    var newName = $('#new_userName').val();
    var newPassword = $('#new_password').val();

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
                    swal("Good job!", "You Update your Information!", "success")
                } else if (response.statusCode === 401) {
                    swal({
                        title: "Something Wrong!",
                        text: "This Username is already existed",
                        type: "error",
                        confirmButtonText: "OK"
                    });
                }else if(response.statusCode === 410 ){
                    swal("Test Mode!", "We are now in Test!", "warning")
                }
            }
        });
    }
});
