MVC-Express
===========

Base Node APP for Lime Node Projects

This is used mainly for pure json based APIs. 
Aka does not use body/query parser out of the box (does use json middleware), but since these are native connect
middlewares it can be easy to add to the framework. Also, a lot of the customized middleware is designed with only
json in mind. For instance, the router is currently not designed to generate urls with a query in them.

Routing
===========
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

The route objects themselves include along of things that should be semantically understandable. The names are unique
strings for your routes. You can use these names to ask the router for a URL through your program.

```javascript
app.router.generateURL('auth.login', relative = true);
```

This feature is powerful because you only have to define your routes in one place. Lets say you have some modules that
would like to access your login route (passport is a good example). You can still define the route in your controller, but 
generate it for your modules during environment configuration.

Note that the router will use the config.json file in the config folder to create absolute URLs, so make sure your domain
is properly defined there.
