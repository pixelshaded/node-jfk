var Hasher = require('jshashes');
var tim = require('tinytim').tim;
var app, config;

module.exports = Authentication;

function Authentication(_app){
    
    app = _app;
    config = app.config.server.auth;
}

Authentication.prototype.hashpassword = function(email, password, cb){
    var formatobj = {email : email, password : password, salt : config.password.salt};
    var hash = new Hasher[config.password.algorithm]().b64(tim(config.password.saltformat, formatobj));
    cb(null, hash);
}

Authentication.prototype.validatePassword = function(email, password, reference, cb){
    
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

Authentication.prototype.generateToken = function(userID, apn, cb){
    
    var token = new Hasher[config.token.algorithm]().b64(config.token.secret + app.Date.now().toString() + Math.floor((Math.random() * 1000)));
    var expires = new app.Date();
    expires.add(config.token.lifespan);
    var query = app.format('UPDATE users SET token = "%s", expires = "%s", apn = %s', token, expires.toDBString(), app.mysql.escape(apn));
    
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