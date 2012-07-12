var hasher = require('jshashes');

exports.hashpassword = function(email, password, cb){
    var hash = new hasher[app.config.auth.password.algorithm]().b64(email + app.config.auth.password.salt + password + email + app.config.auth.password.salt);
    cb(null, hash);
}

exports.validatePassword = function(email, password, reference, cb){
    
    this.hashpassword(email, password, function(error, hash){
	if (error){
	    cb(error);
	}
	else {
	    
	    if (hash === reference){
		cb(null, true);
	    }
	    else {
		cb(null, false);has
	    }
	}
    });
}

exports.generateToken = function(userID, cb){
    
    var token = new hasher[app.config.auth.token.algorithm]().b64(app.config.auth.token.secret + app.Date.now().toString() + Math.floor((Math.random() * 1000)));
    var expires = new app.Date();
    expires.add(app.config.auth.token.lifespan);
    var query = app.format('UPDATE users SET token = "%s", expires = "%s"', token, expires.toDBString());
    
    app.mysql.query(query, function(error, queryInfo){
	if (app.util.queryFailed(error, queryInfo, query)){
	    if (error) cb(error);
	    else cb('Could not add token to user.');
	}
	else {
	    cb(null, token);
	}
    });    
}