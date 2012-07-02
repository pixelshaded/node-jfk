
/**
 * Module dependencies.
 */

express = require('express');
app = module.exports = express.createServer();

var config = require('./config/config');
var cwd = process.cwd();

require(cwd + config.folders.environment + '/global');
require(cwd + config.folders.environment + '/' + app.settings.env);
require(cwd + '/route-mapper')(cwd, config.folders.route, config.folders.controller);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});