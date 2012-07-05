var routes = [
    { uri : '/authorization', method : 'get', name : 'oauth.client.authorization', action : authorization },
    { uri : '/token', method : 'get', name : 'oauth.client.token', action : token },
    { uri : '/callback', method : 'get', name : 'oauth.client.callback', action : callback },
    { uri : '/provider', method : 'get', name : 'oauth.client.provider', action : provider },
    { uri : '/login', method : 'get', name : 'oauth.client.login', action : login }
];

exports.prefix = '/oauth/client';
exports.routes = routes;

function authorization(req, res, next){
    res.render('index.html.twig', { title: 'Oauth Controller: Authorization' });
}

function token(req, res, next){
    res.render('index.html.twig', { title: 'Oauth Controller: Token' });
}

function login(req, res, next){
    res.render('index.html.twig', {title: 'Oauth Controller: Login'});
}

function callback(req, res, next){
    app.passport.authenticate('provider', {
	successRedirect: app.router.generateURL('main.index'),
	failureRedirect: app.router.generateURL('oauth.login')
    })(req, res, next);
}

function provider(req, res, next){
    passport.authenticate('provider')(req, res, next);
}