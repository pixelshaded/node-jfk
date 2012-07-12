
/**
 * Module dependencies.
 */

express = require('express');
connect = require('connect');
fs = require('fs');
logger = require('tracer').colorConsole({
    format : "<{{title}}> {{file}}:{{line}} {{message}}"
});

app = module.exports = express.createServer();

app.config = require('./config/config');
app.config.server = require('./config/server');
app.config.mysql = require('./config/database');
app.config.cwd = process.cwd();
app.responseAPI = require('./config/responseAPI').responseAPI;

app.settings.env = app.config.server.environment;

console.log("Express server running in %s mode", app.settings.env);

require('./config/environments/global');
require('./config/environments/' + app.settings.env);

//app.listen(app.config.server[app.config.server.environment].port, app.config.server[app.config.server.environment].domain, function(){
//    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
//});