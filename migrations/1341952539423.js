exports.description = "Create users table.";

exports.up = function(mysql, next){

    var upQuery = 'CREATE TABLE users (' +
	'id int PRIMARY KEY NOT NULL, ' +
	'email varchar(254) NOT NULL, ' +
	'password varchar(64) NOT NULL, ' +
	'created datetime NOT NULL, ' +
	'modified datetime NOT NULL' +
    ')';
    run(mysql, upQuery, next);
}

exports.down = function(mysql, next){

    var downQuery = 'DROP TABLE users';
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