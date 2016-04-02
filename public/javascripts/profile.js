/**
 * Created by jiyushi1 on 4/1/16.
 */

var skill = $('#skill').val();
var gender = $('#gender').val();
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

//set previous skill or gender.
$(function setSkilAndGender() {
    $("#Gender").val(gender);
    $("#Skill").val(skill);
});

//submit the change file.
$submit.on('click', function(e) {

    var email = $('#email').val();
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var gender = $('#Gender').val();
    var skill = $('#Skill').val();




    if(!firstName || firstName.length < 2) {
        swal({title: "Invalid FirstName!",text: "The firstName should be at least 2 character long!", type: "error", confirmButtonText: "OK" });

    } else if (!lastName || lastName.length < 2) {
        swal({title: "Invalid LastName!",text: "The lastName should be at least 2 character long!", type: "error", confirmButtonText: "OK" });

    } else if( !validateEmail(email)) {
        swal({title: "Invalid Email Address!",text: "The Email Address shall have form like \'aaa@bbb.com\'", type: "error", confirmButtonText: "OK" });

    } else {
        $.post("/updateProfile",{
               username : userName,
               email : email,
               firstname : firstName,
               lastname : lastName,
               skill : skill,
               gender: gender
            },
            function(response) {
                //console.log(response);
                if (response.statusCode === 200) {
                    swal("Good job!", "You Update your Information!", "success")
                } else if (response.statusCode === 400) {
                    swal({
                        title: "Something Wrong!",
                        text: "Cannot Update Your Profile",
                        type: "error",
                        confirmButtonText: "OK"
                    });
                }else if(response.statusCode === 410 ){
                    swal("Test Mode!", "We are now in Test!", "warning")
                }
            });
    }
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

