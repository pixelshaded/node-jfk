app.configure('development', function(){
   console.log('Configuring development environment.');
   
    var mysqlSessionStore = require(app.config.cwd + app.config.folders.app_module + '/mysql-session-store')(express);
    
    app.use(app.util.middleware.requestLogger);
    app.use(app.util.middleware.logJsonResponse);
    app.use(require('connect').json());
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