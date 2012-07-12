
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

app.config = {};
app.config.cwd = process.cwd();
app.config.folders = require('./config/folders');
app.config.server = require('./config/server');
app.config.mysql = require('./config/database');
app.config.auth = require('./config/auth');

app.settings.env = app.config.server.environment;

console.log("Express server running in %s mode", app.settings.env);

require('./config/environments/global');
require('./config/environments/' + app.settings.env);

//app.listen(3000, 'dev.meetsync.com', function(){
//    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
//});