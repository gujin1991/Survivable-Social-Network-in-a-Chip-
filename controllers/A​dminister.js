/**
 * Created by jiyushi1 on 4/9/16.
 */

var User = require('../module/User.js');
var directory = require('../module/Directory.js')
var Privilege = require('../module/Privilege');
var AccountStatus = require('../module/AccountStatus');

var messageePub = require('../module/Message.js');
var messageePriv = require('../module/PrivateMessage.js');
var messagePublic = new messageePub();
var messagePrivate = new messageePriv();

var nameReserved = ['about','access','account','accounts','add','address','adm','admin','administration',
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


//exports.directToProfile = function (req,res) {
//    //console.log("req user name " + req.params.username);
//    new User().getUserProfile(req.body.username,function(err,user){
//        if (err){
//            res.json({"statusCode":401, "message": "Cannot get data from database"});
//        }else{
//
//            res.render('profile', user[0]);
//        }
//    });
//};

exports.updateProfile = function(req, res,sockets) {

    var oldUsername = req.body.oldUsername;
    var username = req.body.username;
    var password = req.body.password;
    var privilege = req.body.privilege;
    var accountStatus = req.body.accountStatus;
    var oldAccountStatus = req.body.oldAccountStatus;

    if(req.session.privilege != new Privilege().administrator) {
        res.json({"statusCode": 401, "message": "You're not Administrator"});
    }

    if (!qualifiedUsernamePassword(username, password)) {
        res.json({"statusCode": 405, "message": "Username/Password invalid"});
        return;
    }



    //update database first.
    new User().initializeForAdmin(oldUsername,username,password,privilege,accountStatus).updateProfileByAdmin(function(result) {
        if (result == 400) {
            res.json({"statusCode":400, "message": "Cannot save"});
        } else if(result == 200) {

            //used only for  updating user name  what if the status changed?
            if(oldUsername != username || oldAccountStatus != accountStatus){
                //update all the message? - - how...
                //1.update all message in the database...
                //2. when change the message to invisiable?
                directory.updateUserName(oldUsername,username);
                updateMessage(oldUsername,username);
                messagePublic.getHistory(function(data){
                    //new added emit . need to negotiate with front end about this
                    socket.emit('update publicMessage',data)
                });

                //do not need to emit to specific socket because we will kick the user out of chat room
            }



            //find the user and kick him out... if changed to inactive..
            var socket = sockets[oldUsername];

            //if online
            if(socket != null){
                socket.emit('Log out');
            }

            directory.getOfflineUsers(function(offUsers){
                var cur = {};
                cur.userName = user.userName;
                cur.status = user.status;
                message.currentUser = cur;
                message.offline = offUsers;
                directory.getOnlineUsers(function(onlineUsers){
                    message.online = onlineUsers;
                });
                io.emit('updatelist',message);
            });


            res.json({"statusCode":200, "message": "Info Saved."});
        }else if(result == 401){
            res.json({"statusCode":401, "message": "This Username is already existed"});
        }
    });
}

exports.viewProfile = function (req,res) {
    console.log("req user name " + req.params.username);
    if(req.session.privilege != new Privilege().administrator){
        res.json({"statusCode":401, "message": "You're not Administrator"});
    }else{
        new User().getUserProfile(req.params.username,function(err,user){
            if (err){
                res.json({"statusCode":400, "message": "Cannot get data from database"});
            }else{
                res.render('otherProfile', user[0]);
            }
        });
    }

};





function qualifiedUsernamePassword(username,password) {
    if (username.length < 3 || password.length < 4 || nameReserved.indexOf(username) >= 0) {
        return false;
    } else {
        return true;
    }

}

function updateMessage(oldUsername,username){

    var message = req.body;
    message.time = now();
    message.status = req.session.status;

    messagePublic.updateUserName(oldUsername,username);
    messagePrivate.updateUserName(oldUsername,username);


}

