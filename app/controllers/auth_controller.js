var loginSchema = registerSchema = { 
    type: 'object', properties: {
	email: { required: true, type: 'string', format: 'email' },
	password: { required: true, type: 'string' },
	apn: { required: true, type: 'string', length: 64}
    }
};

var routes = [
    { uri : '/login', method : 'post', name : 'auth.login', action : login, schema: loginSchema },
    { uri : '/register', method : 'post', name : 'auth.register', action : register, schema: registerSchema },
    { uri : '/logout', method : 'post', name : 'auth.logout', action : logout }
];

exports.routes = routes;
exports.prefix = "/auth";

function login(req, res, next){
    
    var query = 'SELECT * FROM users WHERE email = ' + app.mysql.escape(req.body.email) + ' LIMIT 1';
    
    app.mysql.query(query, function(error, results){
	
	if (app.util.queryFailed(error, results, query, false)){
	    if (error) app.responseAPI.internalError(res);
	    else app.responseAPI.badCredentials(res);
	    return;
	}
	
	var user = results[0];
	
	app.auth.validatePassword(user.email, req.body.password, user.password, function(error, valid){
	    
	    if (error){
		logger.error(error);
		app.responseAPI.internalError(res);
		return;
	    }
	    
	    if (valid){
		app.auth.generateToken(user.id, req.body.apn, function(error, token){
		    if (error) {
			app.responseAPI.internalError(res);
		    }
		    else{
			res.json({"token" : token}, 200);
		    }
		});
	    }
	    else {
		app.responseAPI.badCredentials(res);
		return;
	    }
	});
    })
}

function logout(req, res, next){
    //the firewall will always validate that we have a token
    
    var query = app.format('UPDATE users SET token = null WHERE token = %s', app.mysql.escape(req.body.token));
    
    app.mysql.query(query, function(error, queryInfo){
	if (app.util.queryFailed(error, queryInfo, query)){
	    if (queryInfo.affectedRows === 0) logger.error('Logging out did not unset the token.');    
	    app.responseAPI.internalError(res);
	}
	else {
	    res.json({}, 200);
	}
    });
}

function register(req, res, next){
    
    var query = app.format('SELECT * FROM users WHERE email = %s LIMIT 1', app.mysql.escape(req.body.email));
    
    app.mysql.query(query, function(error, results){
	
	if (app.util.queryFailed(error, results, query, false)){
	    if (error) {
		app.responseAPI.internalError(res);
		return;
	    }
	    else {
		app.auth.hashpassword(req.body.email, req.body.password, function(error, hash){
		    if (error) {
			logger.error('There was an error hashing the password.');
			app.responseAPI.internalError(res);
			return;
		    }
		    else {
			var now = new Date().toISOString();
			
			var query = app.format('INSERT INTO users (email, password, created, modified) VALUES (%s,"%s","%s","%s")', app.mysql.escape(req.body.email), hash, now, now);
			
			app.mysql.query(query, function(error, queryInfo){
			   
			   if (app.util.queryFailed(error, queryInfo, query)){
				app.responseAPI.internalError(res);
				return;
			   }
			   else {
				app.auth.generateToken(queryInfo.insertId, req.body.apn, function(error, token){
				    if (error) {
					app.responseAPI.internalError(res);
				    }
				    else{
					res.json({"token" : token}, 200);
				    }
				});
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