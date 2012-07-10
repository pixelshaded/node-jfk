exports.up = function(mysql, next){
    
    var upQuery = '';
    run(mysql, upQuery, next);
}

exports.down = function(mysql, next){
    
    var downQuery = '';
    
    run(mysql, downQuery, next);
}

function run(mysql, query, next){
    mysql.query(query, function(error, info){
	if (error){
	    console.log(error);
	    console.log(query);
	    next(error);
	}
	else next(null);
    });
}


