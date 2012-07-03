exports.index = function(req, res, next){
    res.render('index.html.twig', { title: 'Main: Express' });
}

exports.post = function(req, res, next){
    res.render('index.html.twig', {title: 'Main Post: Express'});
}