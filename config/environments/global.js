app.configure(function(){
    console.log('Configuring global environment.');

    var cwd = process.cwd();
    var twig = require(cwd + app.config.folders.twig);
    var mysqlConfig = require('../database.json');
    var OAuthConfig = require('../oauth.json');
    var mysqlSessionStore = require(cwd + '/app/services/mysql-session-store')(express);
//    var OAuthStrategy = require('passport-oauth').Strategy;

    //load global modules
    app.mysql = require('mysql');   
    app.passport = require('passport');

    app.mysql = app.mysql.createConnection(mysqlConfig[app.settings.env]);

//    app.passport.use(new OAuthStrategy(OAuthConfig[app.settings.env], function(accessToken, refreshToken, profile, done){
//	User.findOrCreate(function (err, user) {
//	    done(err, user);
//	});
//    }));

    app.register('twig', twig);

    app.set('views', cwd + app.config.folders.views);
    app.set('view engine', 'twig');
    app.set("view options", { layout: false });

    app.use(express.static(cwd + app.config.folders.web));
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.cookieParser('bro asrif91991kdkaj its a secret'));
    app.use(express.session({secret: 'bro asrif91991kdkaj its a secret', store: new mysqlSessionStore(app.mysql)}));
    app.use(app.passport.initialize());
    app.use(app.passport.session());
    app.use(express.logger('dev'));
    app.use(function(req, res, next){
	console.log('Body: %s', JSON.stringify(req.body));
	next();
    });
    app.use(express.methodOverride());
    app.use(app.router);
});