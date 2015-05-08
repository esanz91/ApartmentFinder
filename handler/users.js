var validator = require('validator');
var UserModel = require('../models/user');

exports.isValidUsername = function (req, res) {
    "use strict";

    var username = validator.trim(req.params.username);
    console.log(username);

    // check if alphanumeric
    if (!validator.isAlphanumeric(username)) {
        return res.send("username not alphanumeric");
    }

    // check if exists
    findUsername(username, function (response) {
        // username available
        if (null === response) {
            return res.send("username available");
        }
        // username unavailable
        if (response === "found") {
            return res.send("username unavailable");
        }
        // error
        return res.send(response);
    });
};

function findUsername(username, callback) {
    UserModel.findOne({'local.username': username}, 'local.username', function (err, user) {
        var response = null;

        // error
        if (err) {
            response = err;
        }
        // username not found
        if (!user) {
            response = null;
        }
        // username found
        if (user) {
            response = "found";
        }
        callback(response);
    });
}

exports.isValidEmail = function (req, res) {
    "use strict";

    // trim name
    var email = validator.trim(req.params.email);
    console.log(email);

    // check if email
    if (!validator.isEmail(email)) {
        return res.send("no email format");
    }

    // check if exists
    findEmail(email, function (response) {
        // email not on file
        if (null === response) {
            return res.send("email okay");
        }
        // email on file
        if (response === "found") {
            return res.send("email on file");
        }
        // error
        return res.send(response);
    });
}

function findEmail(email, callback) {
    UserModel.findOne({'local.email': email}, 'local.email', function (err, user) {
        var response = null;
        // error
        if (err) {
            response = err;
        }
        // email not on file
        if (!user) {
            response = null;
        }
        // email on file
        if (user) {
            response = "found";
        }
        callback(response);
    })
}