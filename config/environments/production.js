app.configure('production', function(){
   console.log('Configuring production environment.');
   
    var mysqlSessionStore = require(app.config.cwd + app.config.folders.app_module + '/mysql-session-store')(express);
    
    app.use(require('connect').json());
    app.use(app.middleware.onJsonError);    
    app.use(express.query());
    app.use(express.cookieParser('bro asrif91991kdkaj its a secret'));
    app.use(express.session({secret: 'bro asrif91991kdkaj its a secret', store: new mysqlSessionStore(app.mysql)}));
    app.use(app.router);
    app.use(app.middleware.handleUncaughtRoutes);
});


