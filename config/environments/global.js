app.configure(function(){
   console.log('Configuring global environment.');
   
   var cwd = process.cwd();
   var twig = require(cwd + app.config.folders.twig);
   
   //load global modules
   fs = require('fs');
   
   app.register('twig', twig);
   
   app.use(express.static(cwd + '/public')) ;
   app.use(express.favicon());
   app.use(express.logger('dev'));
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(app.router);
   
   app.set('views', cwd + '/views');
   app.set('view engine', 'twig');
   app.set("view options", { layout: false });
});