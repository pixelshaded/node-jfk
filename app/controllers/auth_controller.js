var routes = [
    { uri : '/login', method : 'post', name : 'auth.login', action : login },
    { uri : '/logout', method : 'post', name : 'auth.logout', action : logout },
    { uri : '/register', method : 'post', name : 'auth.register', action : register }
];

exports.routes = routes;

function login(req, res, next){
    
    var result = app.util.getUndefined([req.body.password, req.body.email],['password', 'email']);
    if (result) {
	res.json({ "errors" : result}, 400);
	return;
    }
    
    
    
    res.json('login');
}

function logout(req, res, next){
    res.json('logout');
}

function register(req, res, next){
    res.json('register');
}