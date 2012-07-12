#MVC-Express
Base Node APP for Lime Node Projects. This is a work in progress.

This is used mainly for pure json based APIs. 
Aka does not use body/query parser out of the box (does use json middleware), but since these are native connect middlewares it can be easy to add to the framework. Also, a lot of the customized middleware is designed with only json in mind. For instance, the router is currently not designed to generate urls with a query in them.

This project also heavily relies on https://github.com/felixge/node-mysql. You can easily add your own ORM on top of it, but would need to change some middlewares if you didn't use mysql at all. I wanted the most flexibility and speed in terms of my mysql implementation, and most mysql ORMs are either missing too many features, too ineffecient (multiple queries for many to many relationships), or so outdated they dont work. I also wanted full control on my database schema, where a lot of ORMs are very limited on database data types.

#Install
This is not a node module / npm package at the moment. Simply clone the git repo and use it however you like.

```code
git clone git://github.com/pixelshaded/MVC-Express.git
```

#Running
```code
node server
```

Note that this uses the vhost connect middleware. If you want to change the domain name, edit the server.json in the config folder and update your etc/hosts file if using apache. If you don't want to use vhosts, simply uncomment the listen function in app and run

```code
node app
```

#Config
Config files are hardwired to the config folder. They are loaded in the app.js before environments and bound to the app.

##Folder Structure

###Dist
Dist contains server specific configurations (like database, domain name, etc). You simply need to copy to copy these to the config folder and remove the dist extension.

###Environment
This contains your express environment configuration, aka app.configure(). The global environment is loaded first, and then your specific environment is loaded afterwards. The environment is set inside the server.json file. Typically, I will bind all my global objects in the global environment, and leave any middleware to the actual environment files so I have full control on middleware flow. For instance, I would add node-mysql module to app.mysql in the global environment, but not say a session store for connect.

##config.json

###auth
These are the settings for how passwords and tokens are generated / hashed. I use https://github.com/h2non/jsHashes for the hashing algorithms. The algorithm string is simply used as an object key to call the corresponding function from jshashes.

###folders
If you want to change where things are placed in your project, do so here. Right now controllers and app_modules folders are editable.

###security
This defines simple regex expressions (path) that if matched, require a certain role. Right now that is just ANONYMOUS or AUTHENTICATED. The difference between the two is that AUTHENTICATED routes require a valid token to be passed in post json. The order of these objects does matter. Only the first match will be considered. Token validation is handled by the firewall middleware.

#Routing
All routing is in one place: defined in every controller and given a name. This is powerful because you can group your routes together by function or category (the controller itself), and see the functionality and routing all in the same place.

Example:
```javascript
var loginSchema = registerSchema = { 
    type: 'object', properties: {
		email: { required: true, type: 'string', format: 'email' },
		password: { required: true, type: 'string' }
    }
};

var routes = [
    { uri : '/login', method : 'post', name : 'auth.login', action : login, schema: loginSchema },
    { uri : '/register', method : 'post', name : 'auth.register', action : register, schema: registerSchema },
    { uri : '/logout', method : 'post', name : 'auth.logout', action : logout }
];

exports.routes = routes;
exports.prefix = "/auth";
```
##Exports

###exports.routes
The array containing all your route objects.

###exports.prefix - optional
A string to be prepended to each uri.

##Route Object

###uri 
```javascript
uri : '/login'
```
The path you want the action function mapped to.

###method
```javascript
method : 'post'
```
post or get are the only supported methods at the moment

###name
```javascript
name : 'auth.login'
```

The name is a unique string for your route. You can use these names to ask the router for a URL through out your program.

```javascript
app.router.generateURL('auth.login', relative = true);
```

This feature is powerful because you only have to define your routes in one place. Lets say you have some modules that would like to access your login route (passport is a good example). You can still define the route in your controller, but generate it for your modules during environment configuration.

Note that the router will use the server.json file in the config folder to create absolute URLs, so make sure your domain is properly defined there.

###action
```javascript
action : login
```
Arguments should be function(req, res, next) like any middleware. The related function for above example might
look like
```javascript
function login(req, res, next){
	res.json({'page' : 'login'}, 200);
	next();
}
```
Actions are the function definitions within the controller that the router will call when the route is matched. Under the hood, the router just uses express to call app.get or app.post and passes your functions and uri. Note that functions defined after the export need to be function name() rather than var name = function(), otherwise they will be undefined when the router does its mapping.

###schema - optional
```javascript
schema: loginSchema
```

```javascript
var loginSchema =  registerSchema = { 
    type: 'object', properties: {
		email: { required: true, type: 'string', format: 'email' },
		password: { required: true, type: 'string' }
    }
};
```
This is a schema object. I use https://github.com/Baggz/Amanda for json validation. These should be defined above the route definitions so they are not undefined when the router processes the controller. The jsonValidator on the router is placed as a middleware after the json parser and uses the schema object to validate incoming json from the request body. This is powerful because your json api is almost self documenting. You can define your request API in a schema and it is automatically validated when a route a matched that contains it. A response is automatically generated on errors, before your routing functions are ever called. In otherwords, you can keep all validation out of your actions so they are cleaner.

#App Modules
This folder contains all the services for your app. These are normally bound to app in the app.js or global environment.

###Authentication
Contains the logic for password and token hashing/generation and password validation.
* hashpassword(email, password, callback)
* validatePassword(email, password, reference, callback)
* generateToken(userID, callback)

###Middleware
Contains all middleware functions
* requestLogger: logs incoming requests
* paramLogger: logs req.body or req.query (post, get, or json params)
* handleUncaughtRoutes: sends a generate response when no routes are caught by router middleware
* logJsonResponse: extends res.json to log outgoing json and response time in ms (requires requestLogger for time)
* onJsonError: should go right after connect.json. Catches any errors from json middleware and sends a response.
* firewall: handles user authentication based on role. Sends response on failure.

###Router
This is normally loaded in app right after config. This will scan controllers and store data and bind routes to express.
* jsonValidator: middleware for validating request schema. relies on private function findRouteByUri
* generateURL(name): will create relative or absolute url based on passed route name. Defaults '/' if no route exists.

###Utilities
Functions I found usefull that I use throughout my app.
* getUndefined(objects[], names[]): takes an array of objects and string names. Will return array of error strings for each undefined object.
* queryFailed(error, data, query, logNoResult = true): used in the callback of a node-mysql query. Checks for errors, unaffected rows, and empty results. If empty results or unaffected rows are not considered an error for your query, set logNoResult boolean to false (default true).
* foreachFileInTreeSync(folderPath, func): give it a starting folder and it will recursively go through each file in all sub folders and pass the sent function the path and filename.

