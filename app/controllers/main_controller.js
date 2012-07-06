var routes = [
    { uri : '/', method : 'get', name : 'main.index',	action : index },
    { uri : '/test', method : 'get', name : 'main.test', action : test },
];

exports.prefix = '/main';
exports.routes = routes;

function index(req, res, next){
    res.render('index.html.twig', { title: 'Main Controller: Index' });
}

function test(req, res, next){
    res.render('index.html.twig', { title: 'Main Controller: Test' });
}