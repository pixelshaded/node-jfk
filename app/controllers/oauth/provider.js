var routes = [
    { uri : '/logout', method : 'get', name : 'oauth.provider.logout', action : logout },
    { uri : '/login', method : 'post', name : 'oauth.provider.login', action : login },
    { uri : '/secret', method: 'get', name: 'oauth.providr.secret', action : secret}
];

exports.prefix = '/oauth/provider';
exports.routes = routes;

function login(req, res, next){
    req.session.user = app.mysql.escape(req.body.username);
    res.writeHead(303, {Location: req.body.next || app.router.generateURL('main.index')});
    res.end();
}

function logout(req, res, next){
    req.session.destroy(function(error){
	if (error) logger.error(error);
	res.writeHead(303, {Location: app.router.generateURL('main.index')});
	res.end();
    });
}

function secret(req, res, next){
    if (req.session.user) {
	res.end('proceed to secret lair, extra data: ' + JSON.stringify(req.session.data));
    }
    else {
	res.writeHead(403);
	res.end('no');
    }
}