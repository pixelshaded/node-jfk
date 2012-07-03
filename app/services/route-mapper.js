module.exports = function(cwd, route_folder, controller_folder){
    
    this.controllers = {};
    
    //mapping functions
    this.get = function(uri, map){
        
        var mapObj = getMapObj(map);
        
        if (validMap(mapObj)){            
            logger.debug('Mapping GET "%s" to %s.%s', uri, mapObj.name, mapObj.func);        
            app.get(uri, controllers[mapObj.name][mapObj.func]);
        }
    }

    this.post = function(uri, map){
        
        var mapObj = getMapObj(map);
        
        if (validMap(mapObj)){            
            logger.debug('Mapping POST "%s" to %s.%s', uri, mapObj.name, mapObj.func);        
            app.post(uri, controllers[mapObj.name][mapObj.func]);
        }
    }
    
    function getMapObj(map){
        
        var obj = new Object();
        obj.name = map.substring(0, map.lastIndexOf('#'));
        obj.func = map.substring(map.lastIndexOf('#') + 1, map.length);
        
        return obj;
    }
    
    function validMap(mapObj){
        
        if (controllers[mapObj.name] === undefined){
            logger.error('A controller with the name %s could not be found.', mapObj.name);
            return false;
        }
        else if (controllers[mapObj.name][mapObj.func] === undefined){
            logger.error('Controller %s did not contain the function %s.', mapObj.name, mapObj.func);
            return false;
        }
        
        return true;
    }
    
    function foreachFolder(path, func){
        
        //logger.debug('Processing Dir: %s', path);
        
        fs.readdirSync(path).forEach(function(file){
            if (file.lastIndexOf('.') === -1) {
                foreachFolder(path + '/' + file, func);
            }
            else {
                func(path, file);
            }
        });
    }
    
    function processControllers(path, file){
                
//        var fromRoot = path.replace(cwd + controller_folder, ''); //strip path up to controller folder
//        var folders = fromRoot.replace('/', '#'); //replace forward slashes with pounds
//        var fname = file.slice(0, file.lastIndexOf('.')); //remove the extension
//        var key = folders + '#' + fname; //add the file name 
        
        var key = path.replace(cwd + controller_folder, '').replace('/', '#') + '#' + file.slice(0, file.lastIndexOf('.'));
        key = key.slice(1, key.length); //remove first # - there will always be at # at beginning

        //logger.debug('Mapping Controller %s to key %s', file, key);
        
        controllers[key] = require(path + '/' + file);
    }
    
    //require routes
    function processRoutes(path, file){
        //logger.debug('Importing Route File: %s', file);
        require(path + '/' + file)(this);
    }
    
    foreachFolder(cwd + controller_folder, processControllers);
    foreachFolder(cwd + route_folder, processRoutes);
    
}


