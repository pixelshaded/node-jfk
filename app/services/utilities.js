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

exports.requestLogger = function(req, res, next){
    
    console.log('\033[90m' + 'REQUEST: ' + req.method
	+ ' ' + req.originalUrl
	+ '\033[0m');
    req._startTime = new Date;
    next();
}

exports.paramLogger = function(req, res, next){
    
    if (req.method === 'GET' && JSON.stringify(req.query).length > 2) {
	console.log('\033[90mGET QUERY: ' + JSON.stringify(req.query) + '\033[0m');
    }
    else if (req.method === 'POST' && JSON.stringify(req.body).length > 2) {
	console.log('\033[90mPOST BODY: ' + JSON.stringify(req.body) + '\033[0m');
    }
    next();
}

exports.responseLogger = function(req, res, next){
    
    var status = res.statusCode
    , color = 32;

    if (status >= 500) color = 31
    else if (status >= 400) color = 33
    else if (status >= 300) color = 36;

    console.log('\033[90m' + 'RESPONSE: '
	+ '\033[' + color + 'm' + res.statusCode
	+ ' \033[90m'
	+ (new Date - req._startTime) + 'ms'
	+ '\033[0m\n');
}

exports.addLoggingToJSON = function(req, res, next){
        
    res.expressjson = res.json;
    res.json = function(){
	//using local arguments in case express changes the arguments json() expects in the future
	if (arguments[0] !== undefined) console.log('\033[90mRESPONSE BODY: ' + JSON.stringify(arguments[0]) + '\033[0m');
	res.expressjson.apply(res, arguments);
    }    
    next();
}


