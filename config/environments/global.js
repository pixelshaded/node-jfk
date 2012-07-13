module.exports = function(app){
    
    var prototypeFolder = app.config.root + '/prototypes/';
    
    var Utilities = require(prototypeFolder + 'Utilities');
    var Router = require(prototypeFolder + 'Router');
    var Middleware = require(prototypeFolder + 'Middleware');
    
    app.configure(function(){
	
	console.log('Configuring global environment.');
	
	app.util = new Utilities(app);
	app.router = new Router(app);
	app.middleware = new Middleware(app);
	
	app.jsonValidator = require('amanda')('json');
	app.Date = require('cromag'); 
	app.format = require('format').format;
    });
}