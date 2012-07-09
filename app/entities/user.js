module.exports = function(orm, sync){
    
    User = orm.define('User', {
	email:	    {type : 'string'},
	password:   {type : 'string'},
	created:    {type : 'date'},
	modified:   {type : 'date'}
    }, {});   
    
    if (sync !== undefined && sync) User.sync();
};

