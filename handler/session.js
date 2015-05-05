var validator = require('validator');

var UserModel = require('../models/user');

function SessionHandler (db) {
    "use strict";

    var users = new UserModel(db);

    this.isLoggedInMiddleware = function (req, res, next) {
        "use strict"

        console.log("is req.session.username set:" + req.session.username);
        console.log("is res.locals.user set:" + res.locals.user);

        if (req.session.username){
            if((req.path == '/signup') || (req.path == '/login')){
                return res.render('errors');
            }
            return next();
        }

        if(req.path == '/signup'){
            return res.render('signup');
        }

        if(req.path == '/post') {
            return res.render('login');
        }

        return next();
    }

    this.handleSignup = function (req, res, next) {
        "use strict";

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;

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

            var user = new UserModel(userJSON);

            user.save(function(err, user){
                if(err){
                    return next(err);
                }
                req.session.username = user.local.username;
                res.locals.user = user.local.username;
                return res.render("home");
            })
        }
        else {
            console.log("user was not registered");
            return res.render("signup");
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
        firstname = validator.trim(firstname);
        lastname = validator.trim(lastname);
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