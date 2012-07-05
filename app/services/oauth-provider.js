var OAuth2Provider = require('oauth2-provider').OAuth2Provider;
var provider = new OAuth2Provider('encryption secret', 'signing secret');
var myGrants = {};
var myClients = {
 '1': '1secret'
};

provider.on('enfore_login', function(req, res, authorize_url, next){
    if (req.session.user){
	next(req.session.user);
    }
    else {
	res.writeHead(303, {Location: app.router.generateURL('oauth.provider.login')});
	res.end();
    }
});

provider.on('authorize_form', function(req, res, client_id, authorize_url){
    res.end('<html>this app wants to access your account... <form method="post" action="' + authorize_url + '"><button name="allow">Allow</button><button name="deny">Deny</button></form>');
});

provider.on('save_grant', function(req, client_id, code, next){
    if(!(req.session.user in myGrants))
    myGrants[req.session.user] = {};

    myGrants[req.session.user][client_id] = code;
    next();
});

provider.on('remove_grant', function(user_id, client_id, code){
    if(myGrants[user_id] && myGrants[user_id][client_id])
    delete myGrants[user_id][client_id];
});

provider.on('lookup_grant', function(client_id, client_secret, code, next){
    // verify that client id/secret pair are valid
    if(client_id in myClients && myClients[client_id] == client_secret) {
	for(var user in myGrants) {
	    var clients = myGrants[user];

	    if(clients[client_id] && clients[client_id] == code)
	    return next(null, user);
	}
    }

    next(new Error('no such grant found'));
});

provider.on('create_access_token', function(user_id, client_id, next){
    var data = 'blah'; // can be any data type or null
    next(data);
});

provider.on('access_token', function(req, token, next){
    var TOKEN_TTL = 10 * 60 * 1000; // 10 minutes

    if(token.grant_date.getTime() + TOKEN_TTL > Date.now()) {
	req.session.user = token.user_id;
	req.session.data = token.extra_data;
    } 
    else {
	console.warn('access token for user %s has expired', token.user_id);
    }

    next(); 
});

module.exports = provider;


