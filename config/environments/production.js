app.configure('production', function(){
    console.log('Configuring production environment.');
    
    app.use(require('connect').json());
    app.use(app.middleware.onJsonError);    
    app.use(app.router.jsonValidator);
    app.use(app.router);
    app.use(app.middleware.handleUncaughtRoutes);
});


