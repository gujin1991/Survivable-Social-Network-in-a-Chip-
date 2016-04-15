var User = require('../module/User.js');

var directory = require('../module/Directory.js')
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

// check login
exports.checkSignIn = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    new User().initialize(username).exist(function(result){

        if (result == 401){

            console.log("user not exist");
            res.json({"statusCode":401, "message": "User not found"});

        } else if (result == 403){

            console.log("user exist");
            new User().initialize(username, password).userAuth(function(result,user) {
                if (result == 403) {
                    res.json({"statusCode": 403, "message": "Wrong password"});
                } else {
                    req.session.username = user.userName;
                    req.session.privilege = user.privilege;
                    req.session.nickName = user.nickName;
                    req.session.loggedIn = true;
                    req.session.status = user.status;
                    res.json({"statusCode":200, "message": "Success"});
                }
            });
        }else if(result == 407){
            console.log("user not active");
            res.json({"statusCode":407, "message": "Inactive User"});
        }
    });
}

exports.register = function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    //var status = req.body.userstatus;
    if (!qualifiedUsernamePassword(username, password)) {
        res.json({"statusCode":405, "message": "Username/Password invalid"});
    } else {
        new User().initialize(username, password).userAdd(function(result) {
            if (result == 400) {
                res.json({"statusCode":400, "message": "User existed"});
            } else {
                req.session.username = req.body.username;
                req.session.nickName = req.body.username;
                req.session.privilege = 'Citizen';
                req.session.loggedIn = true;
                res.json({"statusCode":200, "message": "Success"});
            }
        });
    }
}

exports.logout = function(req,res){
    var myname = req.session.username;
    //console.log('User ' + myname + " left the room.");
    directory.getOnlineUsers(function(onlineUsers){
        var index = onlineUsers.indexOf(myname);
        if (index > -1) {
            onlineUsers.splice(index, 1);
        }
        req.session.destroy();
        res.redirect('/');
    });

}

exports.directSignin = function(req,res){
    if (req.session.loggedIn) {

        res.render('index', {'username': req.session.username,'status':req.session.status});
    } else {
        res.render('signin');
    }
};

exports.directSignup = function(req,res){
    if (req.session.loggedIn) {
        res.render('index', {'username': req.session.username,'status': req.session.status});
    } else {
        res.render('signup');
    }
};

exports.directHome = function (req,res) {
    if (!req.session.loggedIn) {
        res.render('signin');
    } else {

        res.render('index', {'username': req.session.username,'status': req.session.status});

    }
};


exports.direct = function (req,res) {
    res.redirect('/');
};


exports.addLoggedInUsers = function(user){
    directory.addLoggedInUsers(user);
}

exports.deleteLoggedInUsers = function(user){
    directory.deleteLoggedInUsers(user);
}

exports.getOfflineUserIo = function(user,io){
    var message  = {};
    directory.getOfflineUsers(function(offUsers){
        var cur = {};
        cur.userName = user.userName;
        cur.status = user.status;
        cur.nickName = user.userName;

        message.currentUser = cur;
        message.offline = offUsers;
        directory.getOnlineUsers(function(onlineUsers){
            message.online = onlineUsers;
        });
        io.emit('updatelist',message);
    });
}

exports.getUserInfo = function(userName,callback){

    new User().getUserInfo(userName,function(err,user){
        if (err){
            callback(err) // changed this to pass test
        }else{
            callback(user);
        }
    });
}

exports.newUser = function(input){
    return new User().initialize(input.userName,null ,input.status,input.privilege,input.accountStatus,input.nickName);
}

function qualifiedUsernamePassword(username,password) {
    if (username.length < 3 || password.length < 4 || nameReserved.indexOf(username) >= 0) {
        return false;
    } else {
        return true;
    }
}