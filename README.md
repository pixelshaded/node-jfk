#MVC-Express
Base Node APP for Lime Node Projects. This is a work in progress.

This is used mainly for pure json based APIs. 
Aka does not use body/query parser out of the box (does use json middleware), but since these are native connect middlewares it can be easy to add to the framework. Also, a lot of the customized middleware is designed with only json in mind. For instance, the router is currently not designed to generate urls with a query in them.

#Config
Config files are hardwired to the config folder. They are loaded in the app.js before environments and bound to the app.

##Folder Structure

###Dist
Dist contains server specific configurations (like database, domain name, etc). You simply need to copy to copy these to the config folder and remove the dist extension.

###Environment
This contains your express environment configuration, aka app.configure(). The global environment is loaded first, and then your specific environment is loaded afterwards. The environment is set inside the server.json file. Typically, I will bind all my global objects in the global environment, and leave any middleware to the actual environment files so I have full control on middleware flow. For instance, I would add node-mysql module to app.mysql in the global environment, but not say a session store for connect.

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
