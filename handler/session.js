var validator = require('validator');

var UserModel = require('../models/user');
var SessionDAO = require('../dao/sessionDAO').SessionDAO;

function SessionHandler (db) {
    "use strict";

    var users = new UserModel(db);
    var sessions = new SessionDAO(db);

    this.isLoggedInMiddleware = function (req, res, next) {
        var session_id = req.session;
        sessions.getUsername(session_id, function(err, username){
            "use strict";

            if(!err && username){
                req.username = username;
            }
            return next(); // proceed with next middleware
        });
    }

    this.handleSignup = function (req, res, next) {
        "use strict";

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;

        console.log(req.body.firstname);

        if(validateSignup(firstname, lastname, username, email, password)){

            var userJSON = {
                local           : {
                    name        : {
                        firstName   : firstname,
                        lastName    : lastname
                    },
                    username    : username,
                    email       : email,
                    password    : password
                }
            };

            console.log(userJSON);
            var user = new UserModel(userJSON);

            user.save(function(err, user){
                if(err){
                    return next(err);
                }

            })

        }

    }

    function validateSignup(firstname, lastname, username, email, password){

        if(validator.isNull(firstname)  ||
            validator.isNull(lastname)  ||
            validator.isNull(username)  ||
            validator.isNull(email)     ||
            validator.isNull(password)){
            console.log("One or more of the fields is/are NULL");
            return false;
        }
        var name = validator.trim(firstname + lastname);
        if(!validator.isAlpha(name)){
            console.log("name: " + name + " is alpha? " + validator.isAlpha(name));
            return false;
        }

        username = validator.trim(username);
        if(!validator.isAlphanumeric(username)){
            console.log("username: " + username + " is alphanumeric? " + validator.isAlphanumeric(username));
            return false;
        }

        email = validator.normalizeEmail(email);
        if(!validator.isEmail(email)){
            console.log("email: " + email + " is email? " + validator.isEmail(email));
            return false;
        }

        if((!validator.isAlphanumeric(password)) && (password.length > 3)){
            console.log("password: " + password + " is alphanumeric? " + validator.isAlphanumeric(password) + " length is greater than 3? " + password.length > 3);
            return false;
        }

        console.log("No errors!");
        return true;
    }
}

module.exports = SessionHandler;