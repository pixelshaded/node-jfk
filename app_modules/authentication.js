var hasher = require('jshashes');
var tim = require('tinytim').tim;
var config = app.config.server.auth;

exports.hashpassword = function(email, password, cb){
    var formatobj = {email : email, password : password, salt : config.password.salt};
    var hash = new hasher[config.password.algorithm]().b64(tim(config.password.saltformat, formatobj));
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
    
    var token = new hasher[config.token.algorithm]().b64(config.token.secret + app.Date.now().toString() + Math.floor((Math.random() * 1000)));
    var expires = new app.Date();
    expires.add(config.token.lifespan);
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