var routes = [
    { uri : '/authorization', method : 'get', name : 'oauth.authorization', action : authorization },
    { uri : '/token', method : 'get', name : 'oauth.token', action : token },
    { uri : '/callback', method : 'get', name : 'oauth.callback', action : callback },
];

exports.prefix = '/oauth';
exports.routes = routes;

function authorization(req, res, next){
    res.render('index.html.twig', { title: 'Oauth Controller: Authorization' });
}

function token(req, res, next){
    res.render('index.html.twig', { title: 'Oauth Controller: Token' });
}

function callback(req, res, next){
    res.render('index.html.twig', {title: 'Oauth Controller: Callback '})
}