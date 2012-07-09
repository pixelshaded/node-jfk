app.configure(function(){
    console.log('Configuring global environment.');
    
    app.config = {};
    app.config.cwd = process.cwd();
    app.config.folders = require('../folders');
    app.config.server = require('../server');
    app.config.mysql = require('../database');
    app.util = require(app.config.cwd + app.config.folders.app_module + '/utilities');

    app.router = require(app.config.cwd + app.config.folders.app_module + '/router')(app.router);
    app.middleware = require(app.config.cwd + app.config.folders.app_module + '/middleware');
    app.mysql = require('mysql').createConnection(app.config.mysql[app.settings.env]);
    app.orm = require('orm').connect('mysql', app.mysql, function(success, db){
	if (!success) logger.error('The orm could not connect to the database.');
	else {
	    require(app.config.cwd + app.config.folders.app_module + '/schema-loader').load(app.config.cwd + app.config.folders.entity, db, true);
	}
    })
    app.check = require('validator').check;
    app.sanitize = require('validator').sanitize;
    app.auth = require(app.config.cwd + app.config.folders.app_module + '/authentication');
});