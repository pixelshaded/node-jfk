app.configure('development', function(){
    console.log('Configuring development environment.');
    
    app.use(app.middleware.requestLogger);
    app.use(app.middleware.logJsonResponse);
    app.use(require('connect').json());
    app.use(app.middleware.onJsonError);    
    app.use(app.middleware.paramLogger);
    app.use(app.router.jsonValidator);
    app.use(app.middleware.firewall);
    app.use(app.router);
    app.use(app.middleware.handleUncaughtRoutes);
});