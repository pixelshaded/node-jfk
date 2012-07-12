var connect = require('connect');
var config = require('./config/server');

var server = connect.createServer()
.use(connect.vhost(config[config.env].domain, require('./app')))
.use(function(req, res, next){
   //anything not caught by the sub domain
   res.writeHead(200, {});
   res.end();
})
.listen(config[config.env].port, function(){
    console.log("Connect server listening running in %s mode on port %d", config.env, server.address().port);
});


