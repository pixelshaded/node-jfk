module.exports = function(){
    
    var controller_folder = app.config.folders.controller;
    var cwd = process.cwd();
    
    this.routes = {}; 
    
    this.generateURL = function(name, relative){
	if (relative === undefined) relative = true;
	route = findRouteBy('name', name);
	if (!route){
	    logger.error('Could not find a route with the name %s', name);
	    return null;
	}
	
	if (relative) return route.uri;
	else return app.config.server.domain + route.uri;
    }
    
    foreachFileInFolders(cwd + '/' + controller_folder, processControllers);

    for (var i in this.routes){
	var route = this.routes[i];
	logger.debug('%s %s %s', route.method, route.name, route.uri);
    }
    
    return this;
    
    function findRouteBy(key, value){
	
	for (var i in this.routes){
	    
	    var route = this.routes[i];
	    
	    if (route[key] === undefined){
		logger.error('Route objects do not contain the key %s', key);
		return null;
	    }
	    
	    if (route[key] === value) {
		return route;
	    }
	}
	
	return null;
    }
    
    function foreachFileInFolders(path, func){
        
        fs.readdirSync(path).forEach(function(file){
            if (file.lastIndexOf('.') === -1) {
                foreachFileInFolders(path + '/' + file, func);
            }
            else {
                func(path, file);
            }
        });
    }
    
    function processControllers(path, file){
	
	var fullpath = path + '/' + file;
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
	    
	    if (!app.util.defined([route.uri, route.name, route.action], ['uri', 'name', 'action'])){
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
	    
	    var match = findRouteBy('uri', route.uri);
	    
	    if (match){
		logger.warn('Route %s will overwrite route %s because they share the same uri: %s', routes.name, match.name, route.uri);
	    }
	    this.routes[route.name] = route;
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
}


