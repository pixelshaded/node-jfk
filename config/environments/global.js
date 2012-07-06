app.configure(function(){
    console.log('Configuring global environment.');

    var twig = require(app.config.cwd + app.config.folders.twig);
    var mysqlSessionStore = require(app.config.cwd + app.config.folders.service + '/mysql-session-store')(express);
    var connect = require('connect');

    //load global modules
    app.mysql = require('mysql');   
    app.passport = require('passport');
    app.mysql = app.mysql.createConnection(app.config.mysql[app.settings.env]);

    app.register('twig', twig);

    app.set('views', app.config.cwd + app.config.folders.view);
    app.set('view engine', 'twig');
    app.set("view options", { layout: false });

    app.use(app.util.requestLogger);
    app.use(app.util.addLoggingToJSON);
    app.use(express.static(app.config.cwd + app.config.folders.web));
    app.use(express.favicon());
    app.use(connect.json());
    
    //if the content-type is application/json but no json is sent to the server
    //we will get an error from the json middleware. Lets catch it and send a
    //response.
    app.use(function(err, req, res, next){
	
	if (err){
	    
	    var json = JSON.stringify(req.body);
	    var msg = '';
	    
	    if (json.length === 2){
		msg = "Server expects json but none was sent.";
		res.json({"errors" : [msg]}, 400);
	    }
	    else {
		msg = "There was an error parsing sent json: " + json;
		logger.error(msg);
		res.json({ "errors" : [msg]}, 400);
	    }
	    
	    app.util.responseLogger(req, res, function(){});
	}
	else next();
    });
    
    app.use(express.query());
    app.use(app.util.paramLogger);
    app.use(express.cookieParser('bro asrif91991kdkaj its a secret'));
    app.use(express.session({secret: 'bro asrif91991kdkaj its a secret', store: new mysqlSessionStore(app.mysql)}));
    app.use(app.passport.initialize());
    app.use(app.passport.session());
    app.use(app.router);
    app.use(app.util.responseLogger);
});