/**
 * Created by jiyushi1 on 4/1/16.
 */

var userName = $('#userName').val();
var $submit = $('#submit');

$.post('/getStatus',{'username':userName},function(response){

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

$submit.on('click', function(e) {

    var oldP = $('#oPassword').val();
    var newP = $('#nPassword').val();
    var retype = $('#retype').val();

    if(!validatePassword(newP,retype)) {
        swal({title: "Hey Dude!",text: "Your Password Doesn't match", type: "error", confirmButtonText: "OK" });
    } else if(!newP || newP.length < 4){
        swal({title: "Invalid New Password!",text: "Your Password must have at least four Characters", type: "error", confirmButtonText: "OK" });
    }else {
        $.post("/updatePassword",{
                username : userName,
                password : newP,
                oldpassword : oldP
             
            },
            function(response) {
                //console.log(response);
                if (response.statusCode === 200) {
                    swal("Good job!", "You Update your Password!", "success");

                } else if (response.statusCode === 400) {
                    swal({
                        title: "Wrong Old Password!",
                        text: "Please input correct password",
                        type: "error",
                        confirmButtonText: "OK"
                    });

                }else if(response.statusCode === 410 ){
                    swal("Test Mode!", "We are now in Test!", "warning");

                }else{
                    swal({
                        title: "Sorry!",
                        text: "Something Wrong with our system",
                        type: "error",
                        confirmButtonText: "OK"
                    });

                }
                clear();
            });
    }
});

function validatePassword(p1,p2) {
    return p1 == p2;
}

function clear(){
    $('#oPassword').val("");
    $('#nPassword').val("");
    $('#retype').val("");
}