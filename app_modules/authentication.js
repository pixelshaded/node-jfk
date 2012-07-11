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

exports.validatePassword = function(email, password, reference, cb){
    
    bcrypt.compare(password, reference, function(err, res){
	if (err){
	    return cb(error);
	}
	
	return cb(res);
    });
    
//    this.hashpassword(email, password, function(error, hash){
//	if (error){
//	    return cb(error);
//	}
//	
//	if (hash === reference){
//	    return cb(null, true);
//	}
//	else{
//	    return cb(null, false);
//	}
//    });
}

exports.generateToken = function(user){
    //do mysql stuff
}