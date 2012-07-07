var debug = false;

module.exports = function(connect){
    
    var mysql;
    
    function mysqlStore(mysql_connection) {
        
        if (debug) logger.log('Mysql Store Constructor');
        
        mysql = mysql_connection;
        
        var creationQuery = '' +
        'CREATE TABLE IF NOT EXISTS `sessions` ' +
        '(`id` INTEGER NOT NULL auto_increment, `sid` VARCHAR(255), `expires` INTEGER, `json` TEXT , `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ' +
        'ENGINE=InnoDB';
        
        mysql.query(creationQuery, function(error){
            if (error){
                logger.error(error);
            }
        });
    }
    
    mysqlStore.prototype.__proto__ = connect.session.Store.prototype;
    
    mysqlStore.prototype.get = function(sid, callback){
        
        if (debug){
            logger.log('Get Session');
            logger.log('Sid: ' + sid);
        }
        
        var getQuery = 'SELECT json FROM sessions WHERE sid = ' + mysql.escape(sid);

        mysql.query(getQuery, function(error, data){
            
            if (error) {
                logger.error(error);
                return callback(error, null);
            }

            if (data.length > 0){
                data = JSON.parse(data[0].json);
                if (debug) logger.log(data);
                return callback(null, data);
            }

            return callback(null, null);
        });
    }

    mysqlStore.prototype.set = function(sid, sess, callback){
        
        if (debug) logger.log('Set Session');
        
        var now = new Date().toISOString();
        var data = JSON.stringify(sess);
        
        if (debug) logger.log(data);

        mysqlStore.prototype.get(sid, function(error, result){
            
            //if we found one, update
            if (!error && result != null){
                
                var updateQuery = 'UPDATE sessions SET json = \'' + data + '\', updatedAt = "' + now + '" WHERE sid = ' + mysql.escape(sid);
                mysql.query(updateQuery, function(error){
                    if (error) {
                        logger.error(error);
                        return callback && callback(error);
                    }
                    if (debug) logger.log('Update session');
                    return callback && callback();
                });
            }
            //otherwise, insert
            else {
                
                var insertQuery = 'INSERT INTO sessions (sid, json, createdAt, updatedAt) ' +
                'VALUES (' + mysql.escape(sid) + ', \'' + data + '\', "' + now + '", "' + now + '")';

                mysql.query(insertQuery, function(error){
                    if (error){
                        logger.error(error);
                        return callback && callback(error);
                    }
                    if (debug) logger.log('Insert session');
                    return callback && callback();
                })
            }
        });        
    }

    mysqlStore.prototype.destroy = function(sid, callback){
        
        if (debug) logger.log('Delete Session');
        
        var deleteQuery = 'DELETE FROM sessions WHERE sid = ' + mysql.escape(sid);

        mysql.query(deleteQuery, function(error){
            if (error) {
                logger.error(error);
                return callback(error);
            }
            
            return callback(null);
        });
    }
    
    return mysqlStore;
}


