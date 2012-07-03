exports.index = function(req, res, next){
    res.render('index.html.twig', { title: ' Test Index: Express' });
}

exports.post = function(req, res, next){
    res.render('index.html.twig', {title: 'Test Post: Express'});
}