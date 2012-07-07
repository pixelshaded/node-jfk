app.configure(function(){
    console.log('Configuring global environment.');
    
    app.config = {};
    app.config.cwd = process.cwd();
    app.config.folders = require('../folders');
    app.config.server = require('../server');
    app.config.mysql = require('../database');

    app.util = require(app.config.cwd + app.config.folders.app_module + '/utilities');
    app.router = require(app.config.cwd + app.config.folders.app_module + '/router')(app.router);
    
    app.passport = require('passport');
    app.mysql = require('mysql').createConnection(app.config.mysql[app.settings.env]);
});