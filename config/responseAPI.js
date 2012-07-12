exports.responseAPI = {
    "internalError" : function(res) { res.json({"errors" : ["There was an unexpected error."]}, 500);},
    "badCredentials": function(res) { res.json({"errors" : ["Incorrect login credentials."]}, 404);},
    "errors": function(res, errors) { res.json({"errors" : errors}, 400);},
    "invalidToken"  : function(res) { res.json({"errors" : ["The token was invalid."]}, 200);},
    "expiredToken"  : function(res) { res.json({"errors" : ["The token has expired."]}, 200);}
}


