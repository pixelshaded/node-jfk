app.configure(function(){
    console.log('Configuring global environment.');
    
    app.config = {};
    app.config.cwd = process.cwd();
    app.config.folders = require('../folders');
    app.config.server = require('../server');
    app.config.mysql = require('../database');
    app.util = require(app.config.cwd + app.config.folders.app_module + '/utilities');
    
    var db = app.config.mysql[app.settings.env];

    app.router = require(app.config.cwd + app.config.folders.app_module + '/router')(app.router);
    app.middleware = require(app.config.cwd + app.config.folders.app_module + '/middleware');
    app.mysql = require('mysql').createConnection(db);
    app.check = require('validator').check;
    app.sanitize = require('validator').sanitize;
    app.auth = require(app.config.cwd + app.config.folders.app_module + '/authentication');
});