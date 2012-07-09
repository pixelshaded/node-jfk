exports.load = function(folderPath, db, sync){

    app.util.foreachFileInTreeSync(folderPath, function(folderPath, file){
	var fullPath = folderPath + '/' + file;    
	require(fullPath)(db, sync);
    });
}

