module.exports = function(approuter){

    router = approuter; //we want to extend the normal router
    router.routes = {}; 

    router.generateURL = function(name, relative){
	if (relative === undefined) relative = true;
	var route = findRouteByName(name);
	if (!route){
	    logger.error('Could not find a route with the name %s', name);
	    return null;
	}

	if (relative) return route.uri;
	else return app.config.server.domain + route.uri;
    }

    app.util.foreachFileInTreeSync(app.config.cwd + app.config.folders.controller, processControllers);
    
    var debugString = 'Route Map\n\n';
    
    for (var i in router.routes){
	var route = router.routes[i];	
	debugString += addSpaces(route.method.toUpperCase(), maxLength.method.length) + ' ' + addSpaces(route.uri, maxLength.uri.length) + ' ' + route.name + '\n';
    }
    
    logger.debug(debugString);
    
    return router;
}

var router = {};

//this is for debug
var maxLength = { 
    method : { length : 0},
    uri : { length : 0}
};

function addSpaces(string, maxLength){
    
    var diff = maxLength + 4 - string.length;
    
    for (var i = 0; i < diff; i++){
	string += ' ';
    }
    
    return string;
}

function findRouteName(name){

    for (var i in router.routes){

	var route = router.routes[i];
	
	if (route.name === name) {
	    return route;
	}
    }

    return null;
}

function findRouteByUri(uri, method){
    
    for (var i in router.routes){
	var route = router.routes[i];
	
	if (route.uri === uri && route.method === method){
	    return route;
	}
    }
    
    return null;
}

function processControllers(folderPath, file){

    var fullpath = folderPath + '/' + file;
    var controller = require(fullpath);

    if (controller.routes === undefined || controller.routes.length === 0){
	logger.warn('Controller %s did not contain any routes.', fullpath);
	return;
    }

    var routes = controller.routes;
    var prefix = controller.prefix;

    for (var i = 0; i < routes.length; i++){

	var route = routes[i];
	if (prefix !== undefined) route.uri = prefix + route.uri;

	if (app.util.getUndefined([route.uri, route.name, route.action], ['uri', 'name', 'action'])){
	    logger.error('Route %s in %s is missing a field.', i, fullpath);
	    continue;
	}

	if (routes[routes.name] !== undefined){
	    logger.warn('The route name %s in %s is already in use.', route.name, fullpath);
	    continue;
	}

	if (!validMethod(route)) {
	    logger.error('Method %s for route %s in %s is not supported.', route.method, route.name, fullpath);
	    continue;
	}	

	var match = findRouteByUri(route.uri, route.method);

	if (match){
	    logger.warn('Route %s will overwrite route %s because they share the same uri: %s %s', route.name, match.name, route.method.toUpperCase(), route.uri);
	}
	
	router.routes[route.name] = route;
	
	//for spacing of debug. Stores length of longest field.
	for(field in maxLength){
	    if (route[field].length > maxLength[field].length) maxLength[field].length = route[field].length;
	}
    }
}

function validMethod(route){

    var method = route.method.toLowerCase();
    var valid = false;

    switch (method) {
	case 'get':
	    app.get(route.uri, route.action);
	    valid = true;
	    break;
	case 'post':
	    app.post(route.uri, route.action);
	    valid = true;
	    break;
    }

    return valid;
}