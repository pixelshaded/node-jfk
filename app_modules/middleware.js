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

exports.handleUncaughtRoutes = function(req, res, next){
    res.json({"errors" : "Uri '" + req.url + "' using method " + req.method + " is not supported."}, 404);
}

exports.logJsonResponse = function(req, res, next){
        
    res.expressjson = res.json;
    res.json = function(){	
	
	res.expressjson.apply(res, arguments);
	
	//using local arguments in case express changes the arguments json() expects in the future
	if (arguments[0] !== undefined) console.log('\033[90mRESPONSE BODY: ' + JSON.stringify(arguments[0]) + '\033[0m');
	var status = res.statusCode;
	var color = 32;

	if (status >= 500) color = 31
	else if (status >= 400) color = 33
	else if (status >= 300) color = 36;

	console.log('\033[90m' + 'RESPONSE: '
	    + '\033[' + color + 'm' + res.statusCode
	    + ' \033[90m'
	    + (new Date - req._startTime) + 'ms'
	    + '\033[0m\n');
    }    
    next();
}

/*
 * if the content-type is application/json but no json is sent to the server
 * we will get an error from the json middleware. Lets catch it and send a
 * response.
 */
exports.onJsonError = function(err, req, res, next){
	
    if (err){

	var json = JSON.stringify(req.body);
	var msg = '';

	if (json.length === 2){
	    msg = "Server expects json but none was sent.";
	    res.json({"errors" : [msg]}, 400);
	}
	else {
	    msg = "There was an error parsing sent json: " + json;
	    logger.error(msg);
	    res.json({ "errors" : [msg]}, 400);
	}

	app.util.responseLogger(req, res, function(){});
    }
    else next();
}

exports.firewall = function(req, res, next){
    
    var paths = app.config.security;
    var role = '';
    
    for (var i = 0; i < paths.length; i++){
	if (req.url.match(paths[i].path)){
	    role = paths[i].role;
	    break;
	}
    }
    
    console.log('\033[90mREQUIRED ROLE: %s\033[0m', role);
    
    if (role === 'ANONYMOUS') next();
    else if (role === 'AUTHENTICATED') {
	
	var schema = {
	    type: 'object', properties : {
		token : { required : true, type : 'string', length : 88}
	    }
	};
	
	app.jsonValidator.validate(schema, req.body, {singleError: false}, function(errors){
	    if (errors) {
		res.json({"errors" : errors.getMessages()}, 400);
		return;
	    }
	    else {
		var query = app.format('SELECT * FROM users WHERE token = %s', app.mysql.escape(req.body.token));
		app.mysql.query(query, function(error, results){
		    if (app.util.queryFailed(error, results, query, false)){
			if (error) {
			    app.responseAPI.internalError(res);
			    return;
			}
			
			app.responseAPI.invalidToken(res);
			return;
		    }
		    
		    var user = results[0];
		    if (app.Date.compare(new app.Date(), user.expires) == 1){
			app.responseAPI.expiredToken(res);
			return;
		    }
		    else {
			req.user = user;
			next();
		    }
		})
	    }
	});
    }
    else {
	logger.warning('Role %s is not supported by the firewall. Using ANONYMOUS.', role);
	next();
    }
}