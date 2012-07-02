module.exports = function(mapper){
    
    mapper.get('/', 'main#index');
    mapper.post('/', 'main#post');
}