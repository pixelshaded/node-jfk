var routes = [
    { uri : '/', method : 'get', name : 'test.index',	action : index },
    { uri : '/test', method : 'get', name : 'test.test', action : test },
];

exports.prefix = '/test';
exports.routes = routes;

function index(req, res, next){
    res.render('index.html.twig', { title: 'Test Controller: Index' });
}

function test(req, res, next){
    res.render('index.html.twig', { title: 'Test Controller: Test' });
}