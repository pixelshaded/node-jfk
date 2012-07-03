app.configure(function(){
    console.log('Configuring global environment.');

    var twig = require(app.config.cwd + app.config.folders.twig);
    var mysqlSessionStore = require(app.config.cwd + app.config.folders.service + '/mysql-session-store')(express);
    var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
    var provider = require(app.config.cwd + app.config.folders.service + '/oauth-provider');
    
    var OAuthConfig = {
	authorizationURL : app.router.generateURL('oauth.client.authorization'),
	tokenURL : app.router.generateURL('oauth.client.token'),
	clientID : '123-456-789',
	clientSecret : 'shhh-its-a-secret',
	callbackURL : app.router.generateURL('oauth.client.callback')
    };

    //load global modules
    app.mysql = require('mysql');   
    app.passport = require('passport');

    app.mysql = app.mysql.createConnection(app.config.mysql[app.settings.env]);

    app.passport.use(new OAuth2Strategy(OAuthConfig, function(accessToken, refreshToken, profile, done){
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
    app.use(express.query());
    app.use(provider.oauth());
    app.use(provider.login());
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