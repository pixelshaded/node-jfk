var program = require('commander');
var fs = require('fs');
var mysql = require('mysql').createConnection(require('./config/database').development);
var directory = 'migrations';
var template = directory + '/config/' + 'migration-template.js';
var tracking = directory + '/config/' + 'migration-tracking.json';

program
.version('0.0.1');

program
.command('create [filename]')
.description('Create a blank migration file.')
.action(create)

function create(description, options){
   
   var now = Date.now();
   var filename = now + '.js';
   var file = directory + '/' + filename;
   
   console.log('Creating migration file %s.', filename);
   
   fs.writeFileSync(file, fs.readFileSync(template));
   
   var json = require('./' + tracking);
   
   json.migrations.push({date : new Date(now).toDateString(), file : filename, description : description});
   
   console.log('Updating tracker.');
   
   fs.writeFileSync(tracking, JSON.stringify(json, null, 4));
}

program
.command('status')
.description('Get current status of migration.')
.action(status)

function status(){
    
    var json = require('./' + tracking);
    
    console.log('Version: %s', json.version.development);
    console.log('Current: %s', json.migrations.length - 1);
    
    if (json.migrations.length === parseInt(json.version.development)){
	console.log('Database is up to date.');
	return;
    }
    else {
	
	var outdated = json.migrations.length - 1 - json.version.development;
	
	console.log('The database is %s version%s behind.', outdated, (outdated > 1 ? 's' : ''));
	
	for (var i = 0; i < json.migrations.length; i++){
	    console.log('(%s) %s: %s', i + 1, json.migrations[i].date, json.migrations[i].description);
	}
    }
}

program
.command('up [amount]')
.description('Migrate up an amount. If amount is blank, will update to current version.')
.action(up)

function up(amount, options){    
    prepareMigration(amount, 1);
}

program
.command('down [amount]')
.description('Migrate down an amount. If amount is blank, will rollback to first version.')
.action(down)

function down(amount, options){
    prepareMigration(amount, -1);
}

function prepareMigration(amount, direction){
    
    var json = require('./' + tracking);
    var startIndex = json.version.development;
    if (startIndex < 0) startIndex = 0;
    var all = (amount === undefined);
    var endIndex = 0;
    
    if (!all && amount < 1){
	console.log('Amount must be positive. Exiting.');
	return;
    }
    
    if (direction > 0){
	if (all) {
	    endIndex = json.migrations.length;
	}
	else{
	    endIndex = startIndex + amount * direction;
	    if (endIndex > json.migrations.length) endIndex = json.migrations.length;
	}
    }
    else if (direction < 0){
	if (all) {
	    endIndex = 0;
	}
	else {
	    endIndex = startIndex + amount * direction;
	    if (endIndex < 0) endIndex = 0;
	}
    }
    else {
	console.log('Direction cannot be zero. Check up and down functions.');
	return;
    }
    
    console.log('Start: %s, End: %s, Direction: %s', startIndex, endIndex, direction);
    
    var queue = [];
    for (var i = startIndex; i !== endIndex; i += direction){
	var migration = require('./' + directory + '/' + json.migrations[i].file);
	queue.push({version : i, info : json.migrations[i], migration : (direction > 0 ? migration.up : migration.down)});
    }    
    
    processMigration(queue, json, 0);
}

function processMigration(queue, json, index) {
    
    if (index >= queue.length){
	console.log('Migration finished.');
	fs.writeFileSync(tracking, JSON.stringify(json, null, 4));
	process.exit(1);
    }
    
    console.log('Processing %s', index);
    console.dir(queue[index]);
    
    queue[index].migration(mysql, done);   
    
    function done(error){
	
	if (error){
	    console.log('There was an error processing migration %s in file %s', queue[index].version, queue[index].info.file);
	    console.log('Stopping migration at version %s.', json.version.development);
	    fs.writeFileSync(tracking, JSON.stringify(json, null, 4));
	    process.exit(1);
	}
	
	json.version.development = queue[index].version;
	
	console.log('%s processed.', index);
	
	processMigration(queue, json, index + 1);
    }
}

program.parse(process.argv);