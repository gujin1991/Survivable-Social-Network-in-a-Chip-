/**
 * Created by jiyushi1 on 4/1/16.
 */

var skill = $('#skill').val();
var gender = $('#gender').val();
var userName = $('#userName').val();

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
$(function setAll() {
    $("#Gender").val(gender);
    $("#Skill").val(skill);


});