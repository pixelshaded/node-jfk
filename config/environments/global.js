module.exports = function(app){
    
    //objects
    var Utilities = require(app.config.root + app.config.folders.prototype + '/Utilities');
    var Router = require(app.config.root + app.config.folders.prototype + '/Router');
    var Authentication = require(app.config.root + app.config.folders.prototype + '/Authentication');
    var Middleware = require(app.config.root + app.config.folders.prototype + '/Middleware');
    
    app.configure(function(){
	
	console.log('Configuring global environment.');
	
	app.util = new Utilities(app);
	app.router = new Router(app);
	app.middleware = new Middleware(app);
	app.auth = new Authentication(app);
	
	app.jsonValidator = require('amanda')('json');
	app.Date = require('cromag'); 
	app.mysql = require('mysql').createConnection(app.config.server[app.config.server.env].database);
	app.check = require('validator').check;
	app.sanitize = require('validator').sanitize;
	app.format = require('format').format;
    });
}