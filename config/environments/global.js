express.logger.format('bodydev', function(tokens, req, res){
    var status = res.statusCode
    , color = 32;

    if (status >= 500) color = 31
    else if (status >= 400) color = 33
    else if (status >= 300) color = 36;

    return '\033[90m' + req.method
	+ ' ' + req.originalUrl + ' '
	+ '\033[' + color + 'm' + res.statusCode
	+ ' \033[90m'
	+ (new Date - req._startTime) + 'ms'
	+ (req.method === 'GET' && JSON.stringify(req.query).length > 2 ? '\nQuery: ' + JSON.stringify(req.query) : '')
	+ (req.method === 'POST' ? '\nBody: ' + JSON.stringify(req.body) : '')
	+ '\033[0m\n';
});

app.configure(function(){
    console.log('Configuring global environment.');

    var twig = require(app.config.cwd + app.config.folders.twig);
    var mysqlSessionStore = require(app.config.cwd + app.config.folders.service + '/mysql-session-store')(express);

    //load global modules
    app.mysql = require('mysql');   
    app.passport = require('passport');
    app.mysql = app.mysql.createConnection(app.config.mysql[app.settings.env]);

    app.register('twig', twig);

    app.set('views', app.config.cwd + app.config.folders.view);
    app.set('view engine', 'twig');
    app.set("view options", { layout: false });

    app.use(express.static(app.config.cwd + app.config.folders.web));
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.query());
    app.use(express.logger({immediate: false, format: 'bodydev'}));
    app.use(express.cookieParser('bro asrif91991kdkaj its a secret'));
    app.use(express.session({secret: 'bro asrif91991kdkaj its a secret', store: new mysqlSessionStore(app.mysql)}));
    app.use(app.passport.initialize());
    app.use(app.passport.session());
    app.use(app.router);
});