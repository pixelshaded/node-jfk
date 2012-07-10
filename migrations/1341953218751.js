exports.description = "Add tokens table.";

exports.up = function(mysql, next){

    var upQuery = 'CREATE TABLE tokens (' +
	'id int PRIMARY KEY NOT NULL, ' +
	'user_id int NOT NULL, ' +
	'token varchar(255) NOT NULL, ' +
	'expires datetime NOT NULL, ' +
	'FOREIGN KEY (user_id) REFERENCES users(id) ' +
    ')';
    run(mysql, upQuery, next);
}

exports.down = function(mysql, next){

    var downQuery = 'DROP TABLE tokens';
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