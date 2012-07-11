var bcrypt = require('bcrypt');

exports.hashpassword = function(email, password, cb){
    
    bcrypt.genSalt(10, function(err, salt){
	
	if (err) {
	    cb(err);
	    return;
	}
	
	logger.debug(salt);
	
	bcrypt.hash(password, salt, function(err, hash){
	    
	    if (err){
		cb(err);
		return;
	    }
	    
	    cb(null, hash);	    
	});
    });
}

exports.validatePassword = function(password, reference, cb){
        
    bcrypt.compare(password, reference, function(err, res){
	if (err){
	    return cb(err);
	}
	
	return cb(null, res);
    });
}

exports.generateToken = function(userID, cb){
    
    var token = 'omgthatscrazy';
    var expires = new Date();
    var query = app.format('UPDATE users SET token = "%s", expires = "%s"', token, expires.toISOString());
    
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