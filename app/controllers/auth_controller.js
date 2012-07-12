var loginSchema = registerSchema = { 
    type: 'object', properties: {
	email: { required: true, type: 'string', format: 'email' },
	password: { required: true, type: 'string' }
    }
};

var routes = [
    { uri : '/login', method : 'post', name : 'auth.login', action : login, schema: loginSchema },
    { uri : '/register', method : 'post', name : 'auth.register', action : register, schema: registerSchema },
    { uri : '/logout', method : 'post', name : 'auth.logout', action : logout }
];

exports.routes = routes;

var responseAPI = {
    "internalError" : function(res) { res.json({"errors" : ["There was an unexpected error."]}, 500);},
    "badCredentials": function(res) { res.json({"errors" : ["Incorrect login credentials."]}, 404);},
    "errors": function(res, errors) { res.json({"errors" : errors}, 400);}
}

function login(req, res, next){
    
    var query = 'SELECT * FROM users WHERE email = ' + app.mysql.escape(req.body.email) + ' LIMIT 1';
    
    app.mysql.query(query, function(error, results){
	
	if (app.util.queryFailed(error, results, query)){
	    if (error) responseAPI.internalError(res);
	    else responseAPI.badCredentials(res);
	    return;
	}
	
	var user = results[0];
	
	app.auth.validatePassword(user.email, req.body.password, user.password, function(error, valid){
	    
	    if (error){
		logger.error(error);
		responseAPI.internalError(res);
		return;
	    }
	    
	    if (valid){
		app.auth.generateToken(user.id, function(error, token){
		    if (error) {
			responseAPI.internalError(res);
		    }
		    else{
			res.json({"token" : token}, 200);
		    }
		});
	    }
	    else {
		responseAPI.badCredentials(res);
		return;
	    }
	});
    })
}

function logout(req, res, next){
    res.json('logout');
}

function register(req, res, next){
    
    var query = 'SELECT * FROM users WHERE email = ' + app.mysql.escape(req.body.email) + ' LIMIT 1';
    
    app.mysql.query(query, function(error, results){
	
	if (app.util.queryFailed(error, results, query, false)){
	    if (error) {
		responseAPI.internalError(res);
		return;
	    }
	    else {
		app.auth.hashpassword(req.body.email, req.body.password, function(error, hash){
		    if (error) {
			logger.error('There was an error hashing the password.');
			responseAPI.internalError(res);
			return;
		    }
		    else {
			var now = new Date().toISOString();
			
			var query = app.format('INSERT INTO users (email, password, created, modified) VALUES (%s,"%s","%s","%s")', app.mysql.escape(req.body.email), hash, now, now);
			
			app.mysql.query(query, function(error, queryInfo){
			   
			   if (app.util.queryFailed(error, queryInfo, query)){
				responseAPI.internalError(res);
				return;
			   }
			   else {
				app.auth.generateToken(queryInfo.insertId, function(error, token){
				    if (error) {
					responseAPI.internalError(res);
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