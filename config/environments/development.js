app.configure('development', function(){
   console.log('Configuring development environment.');
   
   logger = require('tracer').colorConsole({
       //level : 'warn',
       format : "<{{title}}> {{file}}:{{line}} {{message}}"
   });
   
   app.use(express.errorHandler({ dumpExecptions : true, showStack: true}));
});