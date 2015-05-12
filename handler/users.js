var validator = require('validator');
var userModel = require('../models/user');

exports.isValidUsername = function (req, res) {
    "use strict";

    var username = validator.trim(req.params.username);
    console.log(username);

    // check if alphanumeric
    if (!validator.isAlphanumeric(username)) {
        return res.send("username not alphanumeric");
    }

    //check if exists
    userModel.findOne({'local.username': username}, 'local.username', function (err, user) {

        // error
        if (err) {
            return res.send(err);
        }
        // username available
        if (!user) {
            return res.send("username available");
        }
        // username found
        if (user) {
            return res.send("username unavailable");
        }
    });
};

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
    userModel.findOne({'local.email': email}, 'local.email', function (err, user) {
        // error
        if (err) {
            return res.send(response);
        }
        // email not on file
        if (!user) {
            return res.send("email okay");
        }
        // email on file
        if (user) {
            return res.send("email on file");
        }
    });
}

