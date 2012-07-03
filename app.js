
/**
 * Module dependencies.
 */

express = require('express');
fs = require('fs');
logger = require('tracer').colorConsole({
    format : "<{{title}}> {{file}}:{{line}} {{message}}"
});
app = module.exports = express.createServer();

app.config = {};
app.config.folders = require('./config/folders');
app.config.server = require('./config/server');
app.config.oauth = require('./config/oauth');
app.config.mysql = require('./config/database');
app.config.cwd = process.cwd();

app.util = require('.' + app.config.folders.service + '/utilities');
app.router = require('.' + app.config.folders.service + '/router')(app.router);

require('.' + app.config.folders.environment + '/global');
require('.' + app.config.folders.environment + '/' + app.settings.env);

app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});