var routes = [
    { uri : '/login', method : 'post', name : 'auth.login', action : login },
    { uri : '/logout', method : 'post', name : 'auth.logout', action : logout },
    { uri : '/register', method : 'post', name : 'auth.register', action : register }
];

exports.routes = routes;

function login(req, res, next){
    
    var result = app.util.getUndefined([req.body.email, req.body.password],['email', 'password']);
    
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
    
    var result = app.util.getUndefined([req.body.email, req.body.password],['email', 'password']);
    
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
	
	logger.debug('select query');
	
	if (app.util.queryFailed(error, results, query, false)){
	    if (error) {
		res.json({"errors" : ["There was an unexpected error."]}, 500);
		return;
	    }
	    else {
		app.auth.hashpassword(req.body.email, req.body.password, function(error, hash){
		    if (error) {
			logger.error('There was an error hashing the password.');
			res.json({"errors" : ["There was an unexpected error."]}, 500);
			return;
		    }
		    else {
			var now = new Date().toISOString();
			var query = app.format('INSERT INTO users (email, password, created, modified) VALUES (%s,"%s","%s","%s")', app.mysql.escape(req.body.email), hash, now, now);
			app.mysql.query(query, function(error, queryInfo){
			   
			   logger.debug('insert query');
			   
			   if (app.util.queryFailed(error, queryInfo, query)){
				res.json({"errors" : ["There was an unexpected error."]}, 500);
				return;
			   }
			   else {
			       var token = app.auth.generateToken();
			       res.json({"token" : token}, 200);
			       return;
			   }
			});
		    }
		});
	    }
	}
	else {
	    res.json({"errors" : ["That email is reserved."]}, 200);
	    return;
	}
    });
}