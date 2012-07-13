module.exports = Utilities;

var app;

function Utilities(_app){

    app = _app;
    
}

Utilities.prototype.getUndefined = function(objects, names){
    
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

Utilities.prototype.queryFailed = function(error, data, query, logNoResult){
        
    //Sometimes we dont care if we have no results or affected rows.
    if (logNoResult === undefined) logNoResult = true;

    if (error){
	app.logger.error('---------QUERY HAD AN ERROR---------');
	app.logger.error(error);
	app.logger.error(query);
	return true;
    }

    if (data.length !== undefined){

	if (data.length === 0) {
	    if (logNoResult) {
		app.logger.error('---------QUERY DID NOT RETURN A RESULT---------');
		app.logger.error(query);
	    }
	    return true;
	}
    }
    else if (data.affectedRows !== undefined){

	if (data.affectedRows === 0){
	    if (logNoResult) {
		app.logger.error('---------QUERY DID NOT AFFECT ANY ROWS---------');
		app.logger.error(query);
	    }
	    return true;
	}
    }
    else if (data.affectedRows === undefined && data.length === undefined) {
	app.logger.error('---------INCORRECT DATA ARGUMENT---------');
	app.logger.error('Data did not have a length or affected rows.');
	app.logger.error('Query: %s', query);
	app.logger.error('Data: %s', data);
	return true;
    }

    return false;
}

Utilities.prototype.foreachFileInTreeSync = function(folderPath, func){

    app.fs.readdirSync(folderPath).forEach(function(file){
	if (file.lastIndexOf('.') === -1) {
	    foreachFileInTreeSync(folderPath + '/' + file, func);
	}
	else {
	    func(folderPath, file);
	}
    });
}


