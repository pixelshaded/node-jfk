app.configure(function(){
   console.log('Configuring global environment.');
   
   var cwd = process.cwd();
   var twig = require(cwd + app.config.folders.twig);
   var mysqlConfig = require('../database.json');
   var mysqlSessionStore = require(cwd + '/app/services/mysql-session-store')(express);
   
   //load global modules
   fs = require('fs');
   app.mysql = require('mysql');   
      
   app.mysql = app.mysql.createConnection(mysqlConfig[app.settings.env]);
   app.register('twig', twig);
   
   app.use(express.static(cwd + app.config.folders.web));
   app.use(express.favicon());
   app.use(express.bodyParser());
   app.use(express.cookieParser('bro asrif91991kdkaj its a secret'));
   app.use(express.session({
      secret: 'bro asrif91991kdkaj its a secret',
      store: new mysqlSessionStore(app.mysql)
   }));
   app.use(express.logger('dev'));
   app.use(function(req, res, next){
      console.log('Body: %s', JSON.stringify(req.body));
      next();
   });
   app.use(express.methodOverride());
   app.use(app.router);
   
   app.set('views', cwd + app.config.folders.views);
   app.set('view engine', 'twig');
   app.set("view options", { layout: false });
});