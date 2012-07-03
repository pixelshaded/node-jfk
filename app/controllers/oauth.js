var routes = [
    { uri : '/', method : 'get', name : 'oauth.index',	action : index },
    { uri : '/test', method : 'get', name : 'oauth.test', action : test },
];

exports.prefix = '/oauth';
exports.routes = routes;

function index(req, res, next){
    res.render('index.html.twig', { title: 'Oauth Controller: Index' });
}

function test(req, res, next){
    res.render('index.html.twig', { title: 'Oauth Controller: Test' });
}