module.exports = function(mapper){
    
    mapper.get('/test', 'test#test#index');
    mapper.post('/test', 'test#test#post');
}