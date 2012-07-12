#MVC-Express
Base Node APP for Lime Node Projects. This is a work in progress.

This is used mainly for pure json based APIs. 
Aka does not use body/query parser out of the box (does use json middleware), but since these are native connect
middlewares it can be easy to add to the framework. Also, a lot of the customized middleware is designed with only
json in mind. For instance, the router is currently not designed to generate urls with a query in them.

#Routing
All routing is in one place: defined in every controller and given a name. This is powerful because you can group
your routes together by function or category (the controller itself), and see the functionality and routing all
in the same place.

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
Two things are exported so the extended router can map out the routes: routes and prefix. Prefix is optional and its
purpose is to prepend all your routes with a string.

##Route Object

###uri
The path you want the action function mapped to.

###method
post or get are the only supported methods at the moment

###name
The names are unique strings for your routes. You can use these names to ask the router for a URL through out your program.

```javascript
app.router.generateURL('auth.login', relative = true);
```

This feature is powerful because you only have to define your routes in one place. Lets say you have some modules that
would like to access your login route (passport is a good example). You can still define the route in your controller, but 
generate it for your modules during environment configuration.

Note that the router will use the server.json file in the config folder to create absolute URLs, so make sure your domain
is properly defined there.

###action
Arguments will normally be function(req, res, next) like any middleware.

Actions are the function definitions within the controller that the router will call when the route is matched. Under
the hood, the router just uses express to call app.get or app.post and passes your functions. Note that functions defined
after the export need to be function name() rather than var name = function(), otherwise they will be undefined when the
router does its mapping.

###schema - optional
This is a schema object. I use https://github.com/Baggz/Amanda for json validation. The jsonValidator on the router is
placed a middleware after the json parser and uses the schema object to valid incoming json from the request body. This
is powerful because your json api is almost self documenting. You can define your request API in a schema and it is 
automatically validated when a route a matched that contains it.
