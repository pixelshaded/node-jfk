exports.description = "Auto increment id in users table.";

exports.up = function(mysql, next){

    var upQuery = 'ALTER TABLE users CHANGE id AUTO_INCREMENT';
    run(mysql, upQuery, next);
}

exports.down = function(mysql, next){

    var downQuery = 'ALTER TABLE users CHANGE id';
    run(mysql, downQuery, next);
}

function run(mysql, query, next){
    mysql.query(query, function(error, info){
        if (error){
            logger.error(error);
            logger.error(query);
            next(error);
        }
        else {
            logger.debug(query);
            next(null);
        }
    });
}