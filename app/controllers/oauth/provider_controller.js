var routes = [
    { uri : '/logout', method : 'get', name : 'oauth.provider.logout', action : logout },
    { uri : '/login', method : 'get', name : 'oauth.provider.getLogin', action : getLogin },
    { uri : '/login', method : 'post', name : 'oauth.provider.login', action : login },
    { uri : '/secret', method : 'get', name : 'oauth.providr.secret', action : secret},
    { uri : '/', method : 'get', name : 'oauth.provider.index', action : index }
];

exports.prefix = '/oauth/provider';
exports.routes = routes;

function index(req, res, next){
    res.end('home, logged in? ' + !!req.session.user);
}

function getLogin(req, res, next){
    
    if(req.session.user) {
      res.writeHead(303, {Location: app.router.generateURL('oauth.provider.index')});
      res.end();
      return;
    }

    var next_url = req.query.next ? req.query.next : app.router.generateURL('oauth.provider.index');

    res.end('<html><form method="post" action="' + app.router.generateURL('oauth.provider.login') + '"><input type="hidden" name="next" value="' + next_url + '"><input type="text" placeholder="username" name="username"><input type="password" placeholder="password" name="password"><button type="submit">Login</button></form>');
}

function login(req, res, next){
    req.session.user = req.body.username;

    res.writeHead(303, {Location: req.body.next || app.router.generateURL('oauth.provider.index')});
    res.end(); 
}

function logout(req, res, next){
    req.session.destroy(function(error){
	if (error) logger.error(error);
	res.writeHead(303, {Location: app.router.generateURL('oauth.provider.index')});
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