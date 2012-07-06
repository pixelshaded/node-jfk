app.configure(function(){
    console.log('Configuring global environment.');

    var mysqlSessionStore = require(app.config.cwd + app.config.folders.service + '/mysql-session-store')(express);
    var connect = require('connect'); //express connect is outdated

    //load global modules
    app.mysql = require('mysql');   
    app.passport = require('passport');
    app.mysql = app.mysql.createConnection(app.config.mysql[app.settings.env]);

    app.use(app.util.middleware.requestLogger);
    app.use(app.util.middleware.logJsonResponse);
    app.use(connect.json());
    app.use(app.util.middleware.onJsonError);    
    app.use(express.query());
    app.use(app.util.middleware.paramLogger);
    app.use(express.cookieParser('bro asrif91991kdkaj its a secret'));
    app.use(express.session({secret: 'bro asrif91991kdkaj its a secret', store: new mysqlSessionStore(app.mysql)}));
    app.use(app.passport.initialize());
    app.use(app.passport.session());
    app.use(app.router);
    app.use(app.util.middleware.handleUncaughtRoutes);
});