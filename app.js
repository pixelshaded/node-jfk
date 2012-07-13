module.exports = function(){
    
    express = require('express');

    var app = module.exports = express.createServer();
    
    app.connect = require('connect');
    app.fs = require('fs');
    app.logger = require('tracer').colorConsole({
	format : "<{{title}}> {{file}}:{{line}} {{message}}"
    });

    app.config = require('./config/app');
    app.config.server = require('./config/server');
    app.config.root = __dirname;
    app.responseAPI = require('./config/responseAPI').responseAPI;

    app.settings.env = app.config.server.env;

    console.log("Express server running in %s mode", app.settings.env);

    require('./config/environments/global')(app);
    require('./config/environments/' + app.settings.env)(app);

    app.listen(app.config.server[app.config.server.env].port, app.config.server[app.config.server.env].domain, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
}