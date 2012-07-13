module.exports = function(app){
    app.configure('production', function(){
	console.log('Configuring production environment.');

	app.use(require('connect').json());
	app.use(app.middleware.onJsonError);    
	app.use(app.middleware.jsonValidator);
	app.use(app.middleware.firewall);
	app.use(app.router);
	app.use(app.middleware.handleUncaughtRoutes);
    });
}


