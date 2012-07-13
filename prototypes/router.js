module.exports = Router;

var app;
var routes;
    
function Router(_app){

    this.prototype = _app.router; //we want to extend the normal router
    app = _app;
    routes = {}; 

    app.util.foreachFileInTreeSync(app.config.root + app.config.folders.controller, processControllers);
    
    var debugString = 'Route Map\n\n';
    
    for (var i in routes){
	var route = routes[i];	
	debugString += addSpaces(route.method.toUpperCase(), maxLength.method.length) + ' ' + addSpaces(route.uri, maxLength.uri.length) + ' ' + route.name + '\n';
    }
    
    app.logger.debug(debugString);
}

Router.prototype.generateURL = function(name, relative){
    
    if (relative === undefined) relative = true;
    var route = findRouteByName(name);
    if (!route){
	app.logger.error('Could not find a route with the name %s', name);
	return null;
    }

    if (relative) return route.uri;
    else return app.config.server[app.config.server.env].domain + route.uri;
}

Router.prototype.findRouteName = function(name){

    for (var i in routes){

	var route = routes[i];
	
	if (route.name === name) {
	    return route;
	}
    }

    return null;
}

Router.prototype.findRouteByUri = function(uri, method){
    
    for (var i in routes){
	var route = routes[i];
	
	if (route.uri === uri && route.method === method){
	    return route;
	}
    }
    
    return null;
}

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

function processControllers(folderPath, file){
    
    app.logger.debug('Processing %s', file);
    
    var fullpath = folderPath + '/' + file;
    
    var controller = require(fullpath);

    if (controller.routes === undefined || controller.routes.length === 0){
	app.logger.warn('Controller %s did not contain any routes.', fullpath);
	return;
    }

    var cRoutes = controller.routes;
    var prefix = controller.prefix;

    for (var i = 0; i < cRoutes.length; i++){

	var route = cRoutes[i];
	if (prefix !== undefined) route.uri = prefix + route.uri;

	if (app.util.getUndefined([route.uri, route.name, route.action], ['uri', 'name', 'action'])){
	    app.logger.error('Route %s in %s is missing a field.', i, fullpath);
	    continue;
	}

	if (routes[routes.name] !== undefined){
	    app.logger.warn('The route name %s in %s is already in use.', route.name, fullpath);
	    continue;
	}

	if (!validMethod(route)) {
	    app.logger.error('Method %s for route %s in %s is not supported.', route.method, route.name, fullpath);
	    continue;
	}	

	var match = Router.prototype.findRouteByUri(route.uri, route.method);

	if (match){
	    app.logger.warn('Route %s will overwrite route %s because they share the same uri: %s %s', route.name, match.name, route.method.toUpperCase(), route.uri);
	}
	
	routes[route.name] = route;
	
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