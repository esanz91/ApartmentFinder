var validator = require('validator');
var UserModel = require('../models/user');

exports.isValidUsername = function (req, res) {
    "use strict";

    var username = validator.trim(req.params.username);
    console.log(username);

    // check if alphanumeric
    if(!validator.isAlphanumeric(username)){
        return res.send("not alphanumeric");
    }

    // check if exists
    findUsername(username, function(response) {
        // username available
        if (null === response) {
            return res.send("okay");
        }
        // username unavailable
        if (response) {
            return res.send("in use");
        }
        // error
        return res.send(response);
    });
};

function findUsername (username, callback) {
    UserModel.findOne({'local.username': username}, 'local.username', function (err, user) {
        var response = null;

        //error
        if (err) {
            response = err;
        }
        //username not found
        if (!user) {
            //console.log("username, '" + username + "', not found");
            response = null;
        }
        //username found
        else{
            //console.log("username, '" + username + "', is unavailable. Please choose another username.");
            response = user.local.username;
        }
        callback(response);
    });
}