app.configure('production', function(){
    console.log('Configuring production environment.');
    
    app.use(require('connect').json());
    app.use(app.middleware.onJsonError);    
    app.use(express.query());
    app.use(app.router);
    app.use(app.middleware.handleUncaughtRoutes);
});


