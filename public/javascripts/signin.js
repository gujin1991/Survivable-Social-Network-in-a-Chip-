var $username = $('#username');
var $password = $('#password');
var $signin = $('#signin');
var nameReserved =['about','access','account','accounts','add','address','adm','admin','administration',
    'adult','advertising','affiliate','affiliates','ajax','analytics','android','anon','anonymous',
    'api','app','apps','archive','atom','auth','authentication','avatar','backupbanner','banners','bin',
    'billing','blog','blogs','board','bot','bots','business','chat','cache','cadastro','calendar',
    'campaign','careers','cgi','client','cliente','code','comercial','compare','config','connect',
    'contact','contest','create','code','compras','css','dashboard','data','db','design','delete',
    'demo','design','designer','dev','devel','dir','directory','doc','docs','domain','download',
    'downloads','edit','editor','email','ecommerce','forum','forums','faq','favorite','feed','feedback',
    'flog','follow','file','files','free','ftpg','adget','gadgets','games','guest','group','groups',
    'help','home','homepage','host','hosting','hostname','html','http','httpd','https','hpg','info',
    'information','image','img','images','imap','index','invite','intranet','indice','ipad','iphone',
    'irc','java','javascript','job','jobs','js','knowledgebase','log','login','logs','logout','list',
    'lists','mail','mail1','mail2','mail3','mail4','mail5','mailer','mailing','mx','manager','marketing',
    'master','me','media','message','microblog','microblogs','mine','mp3','msg','msn','mysql','messenger',
    'mob','mobile','movie','movies','music','musicas','my','name','named','net','network','new','news',
    'newsletter','nick','nickname','notes','noticias','ns','ns1','ns2','ns3','ns4','old','online',
    'operator','order','orders','page','pager','pages','panel','password','perl','pic','pics','photo',
    'photos','photoalbum','php','plugin','plugins','pop','pop3','post','postmaster','postfix','posts',
    'profile','project','projects','promo','pub','public','python','random','register','registration',
    'root','ruby','rss','sale','sales','sample','samples','script','scripts','secure','send','service',
    'shop','sql','signup','signin','search','security','settings','setting','setup','site','sites',
    'sitemap','smtp','soporte','ssh','stage','staging','start','subscribe','subdomain','suporte',
    'support','stat','static','stats','status','store','stores','system','tablet','tablets','tech',
    'telnet','test','test1','test2','test3','teste','tests','theme','themes','tmp','todo','task','tasks',
    'tools','tv','talk','update','upload','url','user','username','usuario','usage','vendas','video',
    'videos','visitor','win','ww','www','www1','www2','www3','www4','www5','www6','www7','wwww','wws',
    'wwws','web','webmail','website','websites','webmaster','workshop','xxx','xpg','you','yourname',
    'yourusername','yoursite','yourdomain'];

$signin.on('click', function(e) {
    username = $username.val().trim();
    password = $password.val();
    var errMsg;
    if(!username || username.length < 3) {
        swal({title: "Invalid Username!",text: "The username should be at least 3 character long!", type: "error", confirmButtonText: "OK" });
        $username.val('');
    } else if (nameReserved.indexOf(username) >= 0) {
        swal({title: "Invalid Username!",text: "The username is reserved, please change another one!", type: "error", confirmButtonText: "OK" });
        $username.val('');
    } else if(password.length < 4) {
        swal({title: "Invalid Password!",text: "The password should be at least 4 character long!", type: "error", confirmButtonText: "OK" });
        $password.val('');
    } else {
        $.post("/signin",{
                username: username,
                password: password
            },
            function(response) {
                console.log(response);
                if (response.statusCode === 200) {
                    window.location = "/index?username=" + username;
                } else if (response.statusCode === 403) {
                    swal({
                        title: "Wrong Password!",
                        text: "Password and User not match! Please re-enter the username or password!",
                        type: "error",
                        confirmButtonText: "OK"
                    });
                    $password.val('');
               } else if (response.statusCode === 405) {
                    swal({
                         title: "Invalid Username and/or Password!",
                         text: "Password and User not valid! Please re-enter the username or password!",
                         type: "error",
                         confirmButtonText: "OK"
                    });
                    $password.val('');
               } else if (response.statusCode === 407) {
                    swal({
                        title: "Inactive User!",
                        text: "Sorry! You are the inactive user new and cannot log in anymore!",
                        type: "error",
                        confirmButtonText: "OK"
                    });
                    $password.val('');
                } else if (response.statusCode === 410) {
                    swal({title: "Error!",text: "Monitor is testing systems now! Please wait...", type: "error", confirmButtonText: "OK" });
                } else if (response.statusCode === 401) {
                    swal({
                            title: "No user found!",
                            text: "Would you want to create new account?",
                            type: "info",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            showLoaderOnConfirm: true,
                        },
                        function () {
                            $.post("/signup", {
                                username: username,
                                password: password
                            }, function (response) {
                                console.log(response);
                                if (response.statusCode === 200) {
                                    window.location.href = "/";
                                } else if (response.statusCode === 400) {
                                    swal({
                                        title: "Username existed!",
                                        text: "Please re-enter the username!",
                                        type: "error",
                                        confirmButtonText: "OK"
                                    });
                                }
                            });
                    });
                    clearForm()
                }
            });
    }
});

function clearForm() {
    $username.val('');
    $password.val('');
}