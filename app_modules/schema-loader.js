exports.load = function(folderPath, orm, types, sync){

    app.util.foreachFileInTreeSync(folderPath, function(folderPath, file){
	var fullPath = folderPath + '/' + file;    
	require(fullPath)(orm, types, sync);
    });
}

