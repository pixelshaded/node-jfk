exports.description = "Auto increment tokens table.";

exports.up = function(mysql, next){

    var upQuery = 'ALTER TABLE tokens AUTO_INCREMENT = 1';
    run(mysql, upQuery, next);
}

exports.down = function(mysql, next){

    var downQuery = 'ALTER TABLE tokens AUTO_INCREMENT = 0';
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