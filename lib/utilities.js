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


