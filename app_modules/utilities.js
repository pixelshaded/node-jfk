exports.getUndefined = function(objects, names){
    
    var defined = true;
    var logs = new Array();

    for (var i = 0; i < objects.length; i++){
	if (objects[i] === undefined){
	    defined = false;
	    logs.push(names[i] + " was undefined.");
	}
    }

    if (!defined){
	for (log in logs){
	    logger.error(logs[log]);
	}
    }

    if (defined) return null;
    else return logs;
}

exports.queryFailed = function(error, data, query, logNoResult){
        
    //Sometimes we dont care if we have no results or affected rows.
    if (logNoResult === undefined) logNoResult = true;

    if (error){
	logger.error('---------QUERY HAD AN ERROR---------');
	logger.error(error);
	logger.error(query);
	return true;
    }

    if (data.length !== undefined){

	if (data.length === 0) {
	    if (logNoResult) {
		logger.error('---------QUERY DID NOT RETURN A RESULT---------');
		logger.error(query);
	    }
	    return true;
	}
    }
    else if (data.affectedRows !== undefined){

	if (data.affectedRows === 0){
	    if (logNoResult) {
		logger.error('---------QUERY DID NOT AFFECT ANY ROWS---------');
		logger.error(query);
	    }
	    return true;
	}
    }
    else if (data.affectedRows === undefined && data.length === undefined) {
	logger.error('---------INCORRECT DATA ARGUMENT---------');
	logger.error('Data did not have a length or affected rows.');
	logger.error('Query: %s', query);
	logger.error('Data: %s', data);
	return true;
    }

    return false;
}


