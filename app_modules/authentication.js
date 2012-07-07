exports.hashpassword = function(email, password){
    
}

exports.validatePassword = function(password, reference){
    if (hashpassword(password) === reference) return true;
    else return false;
}

exports.generateTokens = function(user){
    //do mysql stuff
}