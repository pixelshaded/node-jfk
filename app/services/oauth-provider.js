var OAuth2Provider = require('oauth2-provider').OAuth2Provider;
var provider = new OAuth2Provider('encryption secret', 'signing secret');

provider.on('enfore_login', function(req, res, authorize_url, next){
    
});

provider.on('authorize_form', function(req, res, client_id, authorize_url){
    
});

provider.on('save_grant', function(req, client_id, code, next){
    
});

provider.on('remove_grant', function(user_id, client_id, code){
    
});

provider.on('lookup_grant', function(client_id, client_secret, code, next){
    
});

provider.on('create_access_token', function(user_id, client_id, next){
    
});

provider.on('access_token', function(req, token, next){
    
});

module.exports = provider;


