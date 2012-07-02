exports.index = function(req, res, next){
    res.render('index', { title: ' Test Index: Express' });
}

exports.post = function(req, res, next){
    res.render('index', {title: 'Test Post: Express'});
}