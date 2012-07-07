
/**
 * Module dependencies.
 */

express = require('express');
fs = require('fs');
logger = require('tracer').colorConsole({
    format : "<{{title}}> {{file}}:{{line}} {{message}}"
});
app = module.exports = express.createServer();

require('./config/environments/global');
require('./config/environments/' + app.settings.env);

app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});