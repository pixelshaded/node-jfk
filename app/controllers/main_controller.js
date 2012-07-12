var routes = [
    { uri : '/', method : 'get', name : 'main.index',	action : index },
    { uri : '/test', method : 'get', name : 'main.test', action : test },
];

exports.prefix = '/main';
exports.routes = routes;

function index(req, res, next){
    res.json({"page" : "Main Controller Index"}, 200);
    next();
}

function test(req, res, next){
    res.json({"page" : "Main Controller Test"}, 200);
    next();
}