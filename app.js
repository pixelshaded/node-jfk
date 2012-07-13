module.exports = JFK;

var app;

function JFK(config, server){
    
    var express = require('express');

    app = express.createServer();
    
    app.connect = require('connect');
    app.fs = require('fs');
    app.logger = require('tracer').colorConsole({
	format : "<{{title}}> {{file}}:{{line}} {{message}}"
    });

    app.config = config;
    app.config.server = server;
    app.config.root = __dirname;

    app.settings.env = app.config.server.env;

    console.log("Express server running in %s mode", app.settings.env);

    require('./config/environments/global')(app);
    require('./config/environments/' + app.settings.env)(app);

    app.listen(app.config.server[app.config.server.env].port, app.config.server[app.config.server.env].domain, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
    
    JFK.prototype.app = app;
}