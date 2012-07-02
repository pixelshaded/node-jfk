exports.index = function(req, res, next){
    res.render('index', { title: 'Main: Express' });
}

exports.post = function(req, res, next){
    res.render('index', {title: 'Main Post: Express'});
}