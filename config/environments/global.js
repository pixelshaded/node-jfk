app.configure(function(){
    console.log('Configuring global environment.');

    var twig = require(app.config.cwd + app.config.folders.twig);
    var mysqlSessionStore = require(app.config.cwd + '/app/services/mysql-session-store')(express);
    var OAuthStrategy = require('passport-oauth').OAuthStrategy;

    //load global modules
    app.mysql = require('mysql');   
    app.passport = require('passport');

    app.mysql = app.mysql.createConnection(app.config.mysql[app.settings.env]);

    app.passport.use(new OAuthStrategy(app.config.oauth[app.settings.env], function(accessToken, refreshToken, profile, done){
	User.findOrCreate(function (err, user) {
	    done(err, user);
	});
    }));

    app.register('twig', twig);

    app.set('views', app.config.cwd + app.config.folders.view);
    app.set('view engine', 'twig');
    app.set("view options", { layout: false });

    app.use(express.static(app.config.cwd + app.config.folders.web));
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