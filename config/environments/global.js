app.configure(function(){
   console.log('Configuring global environment.');
   
   var cwd = process.cwd();
   
   //load global modules
   fs = require('fs');
   
   app.set('views', cwd + '/views');
   app.set('view engine', 'jade');
   
   app.use(express.static(cwd + '/public')) ;
   app.use(express.favicon());
   app.use(express.logger('dev'));
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(app.router);
});