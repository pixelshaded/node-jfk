var program = require('commander');
logger = require('tracer').colorConsole({
    format : "{{message}}"
});
var fs = require('fs');
var keypress = require('keypress');
var env = require('./config/server.json').environment;
var db = require('./config/database')[env];
var mysql = require('mysql').createConnection(db);
var directory = 'migrations';
var config = directory + '/config';
var template = config + '/migration-template.js';
var tracking = config + '/migration-tracking.json';

keypress(process.stdin);

process.stdin.on('keypress', function(ch, key){
    if (key.ctrl && key.name == 'c'){
	process.stdin.pause();
	process.exit(1);
    }
});

program
.version('0.0.5');

program
.command('create [filename]')
.description('Create a blank migration file.')
.action(create)

function create(description, options){
   
   var json = getTracking();
   if (!json) process.exit(1);
   
   var now = Date.now();
   var filename = now + '.js';
   var file = directory + '/' + filename;
   
   logger.trace('Creating migration file %s.', filename);
   
   var content = 'exports.description = "' + description + '";\n\n';
   if (fs.existsSync(template)) content += fs.readFileSync(template);
   else {
       logger.warn('Could not find a template file. Using default.');
       content += generateTemplate();
   }
   
   fs.writeFileSync(file, content);
   
   json.migrations.push({date : new Date(now).toDateString(), file : filename, description : description});
   
   logger.trace('Updating tracker.');
   
   fs.writeFileSync(tracking, JSON.stringify(json, null, 4));
}

program
.command('resync')
.description('Auto populates migration tracking based on files in migration folder. This will overwrite old tracking.')
.action(resync)

function resync(){
    
    logger.trace('Resyncing the tracking will overwrite previous settings. Continue? (y,n)');
    
    prompt(['y','n'], function(key){
	if (key.name == 'n') process.exit(1);
	else if (key.name == 'y'){
	    
	    logger.trace('Beginning resync.');
	    
	    var json = getTracking();
	    if (!json) process.exit(1);
	    
	    json.migrations = [];
	    
	    var files = fs.readdirSync(directory);
	    
	    for (var i = 0; i < files.length; i++){
		var file = files[i];
		var date = file.split('.');
		var extension = date.pop();
		date = parseInt(date);
		
		if (extension !== 'js') continue;
		
		var description = require('./' + directory + '/' + file);
		if (description.description === undefined){
		    logger.error('Migration file %s exists but does not export a description. Aborting resync.', file);
		    process.exit(1);
		}
		
		description = description.description;
		
		json.migrations.push({date : new Date(date).toDateString(), file : file, description : description});
	    }
	    
	    fs.writeFileSync(tracking, JSON.stringify(json, null, 4));
	    logger.trace('Finished resync.');
	}
    });
}

program
.command('status')
.description('Get current status of migration.')
.action(status)

function status(){
    
    var json = getTracking();
    if (!json) process.exit(1);
    
    logger.trace('%s version: %s', env, json.version[env]);
    logger.trace('current version: %s', json.migrations.length - 1);
    
    if (json.migrations.length === parseInt(json.version[env])){
	console.log('Database is up to date.');
	process.exit(1);
    }
    else {
	
	var outdated = json.migrations.length - 1 - json.version[env];
	
	if (outdated){
	    
	    logger.trace('The %s environment is %s version%s behind.', env, outdated, (outdated > 1 ? 's' : ''));
	    
	    for (var i = json.version[env] + 1; i < json.migrations.length; i++){
		logger.trace('(%s) %s: %s', i + 1, json.migrations[i].date, json.migrations[i].description);
	    }
	}
	else logger.trace('The %s environment is up to date.', env);
    }
}

program
.command('list')
.description('Lists all migrations from tracking file to console. Current version will be blue.')
.action(list)

function list(){
    
    var json = getTracking();
    if (!json) process.exit(1);
    
    if (json.version[env] === -1) logger.debug('** Unversioned **');
    else logger.trace('Unversioned');
    
    for (var i = 0; i < json.migrations.length; i++){
	
	var msg = json.migrations[i].date + ' (' + json.migrations[i].file + '): ' + json.migrations[i].description;
	
	if (json.version[env] === i) logger.debug('** ' + msg + ' **');
	else logger.trace(msg);
    }
    
    process.exit(1);
    
}

program
.command('up [amount]')
.description('Migrate up an amount. If amount is blank, will update to current version.')
.action(up)

function up(amount, options){    
    
    if (amount !== undefined) amount = parseInt(amount);
    
    if (amount !== undefined && amount < 1){
	logger.error('Amount must be greater than zero or undefined.');
	process.exit(1);
    }
    
    var json = getTracking();
    if (!json) process.exit(1);
    
    var version = json.version[env];
    
    if (version === json.migrations.length - 1){
	logger.trace('The %s environment is already up to date.', env);
	process.exit(1);
    }
    
    var startIndex = version + 1;
    var endIndex = amount === undefined ? json.migrations.length - 1 : startIndex + amount - 1;    
    if (endIndex > json.migrations.length - 1) endIndex = json.migrations.length - 1;
    
    var queue = [];
    var changes = 'Are you sure you want to run the following updates for the ' + env + ' environment? (y,n):\n';
    
    for (var i = startIndex; i <= endIndex; i++){
	
	var path = directory + '/' + json.migrations[i].file;
	
	if (!fs.existsSync(path)){
	    logger.error('Tracked file %s does not exist. Exiting...', path);
	    process.exit(1);
	}
	
	var obj = { index : i, migration : json.migrations[i], func : require('./' + path).up};
	
	if (obj.func === undefined){
	    logger.error('Could not get up function from %s. Exiting...', obj.migration.file);
	    process.exit(1);
	}
	
	queue.push(obj);
	changes += '\t>> ' + json.migrations[i].date + ' - ' + json.migrations[i].description + '\n';
    }
    
    logger.trace(changes);
    
    prompt(['y','n'], function(key){
	if (key.name == 'y'){
	    logger.trace('Beginning updates.');
	    processQueue(queue, 0, json, function(){
		logger.trace('Finished updates.');
		fs.writeFileSync(tracking, JSON.stringify(json, null, 4));
	    });
	}
	else if (key.name == 'n'){
	    logger.trace('Canceling updates.');
	    process.exit(1);
	}
    });
}

program
.command('down [amount]')
.description('Migrate down an amount. If amount is blank, will rollback to unversioned.')
.action(down)

function down(amount, options){
    
    if (amount !== undefined) amount = parseInt(amount);
    
    if (amount !== undefined && amount < 1){
	logger.error('Amount must be greater than zero or undefined.');
	process.exit(1);
    }
    
    var json = getTracking();
    if (!json) process.exit(1);
    
    var version = json.version[env];  
    
    if (version === -1){
	logger.trace('%s environment is already unversioned.', env);
	process.exit(1);
    }
    
    var startIndex = version;
    var endIndex = (amount === undefined) ? 0 : startIndex + 1 - amount;
    if (endIndex < 0) endIndex = 0;
    
    var queue = [];
    var changes = 'Are you sure you want to undo the following for the ' + env + ' environment? (y,n):\n';
    
    for (var i = startIndex; i >= endIndex; i--){
	
	var path = directory + '/' + json.migrations[i].file;
	
	if (!fs.existsSync(path)){
	    logger.error('Tracked file %s does not exist. Exiting...', path);
	    process.exit(1);
	}
	
	var obj = { index : i, migration : json.migrations[i], func : require('./' + path).down};
	
	if (obj.func === undefined){
	    logger.error('Could not get down function from %s. Exiting...', obj.migration.file);
	    process.exit(1);
	}
	
	queue.push(obj);
	changes += '\t>> ' + json.migrations[i].date + ' - ' + json.migrations[i].description + '\n';
    }
    
    logger.trace(changes);
    
    prompt(['y','n'], function(key){
	if (key.name == 'y'){
	    logger.trace('Beginning rollbacks.');
	    
	    processQueue(queue, 0, json, function(){
		logger.trace('Finished rollbacks.');
		json.version[env] -= 1;
		fs.writeFileSync(tracking, JSON.stringify(json, null, 4));
	    });
	}
	else if (key.name == 'n'){
	    logger.trace('Canceling rollbacks.');
	    process.exit(1);
	}
    });
    
    //console.dir(queue);
}

function processQueue(queue, index, json, finishcb){
    
    if (index >= queue.length){
	finishcb();
	process.exit(1);
    }
    
    logger.trace('Processing: %s - %s', queue[index].migration.date, queue[index].migration.description);
    queue[index].func(mysql, proceed);
    
    function proceed(error){
	if (error) {
	    logger.error('There was an error processing %s. Stopping at version %s', queue[index].migration.file, json.version[env]);
	    fs.writeFileSync(tracking, JSON.stringify(json, null, 4));
	    process.exit(1);
	}
	else {
	    json.version[env] = queue[index].index;
	}
	processQueue(queue, index + 1, json, finishcb);
    }
}

function validTracking(json){
    
    var valid = true;
    
    if (json.migrations === undefined){
	logger.error('Tracking json is missing a migrations array.');
	valid = false;
    }
    
    if (json.version === undefined){
	logger.error('Tracking json is missing a version object.');
	valid = false;
    }
    
    if (json.version[env] === undefined){
	logger.error('Tracking json is missing a version key for %s environment.', env);
	valid = false;
    }
    
    if (json.version[env] < -1) {
	logger.error('%s is not a valid %s version. Versions are within -1 and infinity. Did you manually edit the tracking json?', json.version[env], env);
	valid = false;
    }
    
//    if (!valid){
//	logger.error('The tracking file could not be validated. You can generate a new one.');
//    }
    
    return valid;    
}

function prompt(keys, callback){
    
    process.stdin.setRawMode(true);
    process.stdin.resume();
    
    process.stdin.on('keypress', function(ch, key){
	
	if (keys.indexOf(key.name) == -1){
	    logger.trace('%s is not a valid input. Valid inputs: %s', key.name, JSON.stringify(keys));
	}
	else {
	    process.stdin.pause();
	    callback(key);
	}
    });   
}

function generateTrackingJson(){
    
    return {
	"version": {
	    "development": -1,
	    "production": -1
	},
	"migrations": []
    }    
}

function getTracking(){
    
    var json = null;
    
    if (!fs.existsSync(directory)){
	logger.error('Migrations directory did not exist. Generating one.');
	fs.mkdirSync(directory);
    }
    
    if (!fs.existsSync(config)){
	logger.error('Config directory did not exist. Generating one.');
	fs.mkdirSync(config);
    }
    
    if (!fs.existsSync(tracking)){
	
	logger.error('Tracking json did not exist. Generating one.');	
	json = generateTrackingJson();	
	fs.writeFileSync(tracking, JSON.stringify(json, null, 4));
	return json;
    }
    
    json = require('./' + tracking);
    
    if (!validTracking(json)){
	return null;
    }
    else return json;
}

function generateTemplate(){
    
    var template = '' +
    
"exports.up = function(mysql, next){" + "\n\n" +

"    " + "var upQuery = '';" + "\n" +
"    " + "run(mysql, upQuery, next);" + "\n" +
"}" + "\n\n" +

"exports.down = function(mysql, next){" + "\n\n" +

"    " + "var downQuery = '';" + "\n" +
"    " + "run(mysql, downQuery, next);" + "\n" +
"}" + "\n\n" +

"function run(mysql, query, next){" + "\n" +
"    " + "mysql.query(query, function(error, info){" + "\n" +
"        " + "if (error){" + "\n" +
"            " + "logger.error(error);" + "\n" +
"            " + "logger.error(query);" + "\n" +
"            " + "next(error);" + "\n" +
"        " + "}" + "\n" +
"        " + "else {" + "\n" +
"            " + "logger.debug(query);" + "\n" +
"            " + "next(null);" + "\n" +
"        " + "}" + "\n" +
"    " + "});" + "\n" +
"}";

    return template;    
}

program.parse(process.argv);