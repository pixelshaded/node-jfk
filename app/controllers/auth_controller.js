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
    
    if (!app.check(req.body.email).isEmail()){
	res.json({"errors" : ["Email was not a valid email."]}, 400);
	return;
    }
    
    var query = 'SELECT * FROM users WHERE email = ' + app.mysql.escape(req.body.email) + ' LIMIT 1';
    
    app.mysql.query(query, function(error, results){
	
	if (app.util.queryFailed(error, results, query)){
	    if (error) res.json({"errors" : ["There was an unexpected error."]}, 500);
	    else res.json({"errors" : ["Incorrect login credentials."]}, 404);
	    return;
	}
	
	var user = results[0];	
	
	//now we have the user. We need to compare the users password to our hashed password in the database
	if (app.auth.validPassword(req.body.password, user.password)){
	    var tokens = app.auth.generateTokens(user);
	    res.json({"tokens" : tokens}, 200);
	}
	else {
	    res.json({"errors" : ["Incorrect login credentials."]}, 404);
	    return;
	}
    })
}

function logout(req, res, next){
    res.json('logout');
}

function register(req, res, next){
    res.json('register');
}