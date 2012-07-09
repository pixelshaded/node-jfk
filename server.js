var connect = require('connect');

var server = connect.createServer()
.use(connect.vhost('dev.meetsync.com', require('./app')))
.use(function(req, res, next){
   //anything not caught by the sub domain
   res.writeHead(200, {});
   res.end();
})
.listen(3000, function(){
    console.log("Connect server listening on port %d", server.address().port);
});


