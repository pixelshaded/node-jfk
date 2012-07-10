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
	    logger.error(error);
	    logger.error(query);
	    next(error);
	}
	else next(null);
    });
}


