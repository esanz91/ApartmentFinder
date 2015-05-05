var validator = require('validator');
var UserModel = require('../models/user');

function SessionHandler() {
    "use strict";

    this.isLoggedInMiddleware = function (req, res, next) {
        "use strict"

        // cannot signup or login once logged in
        if (req.session.username){
            console.log("user already exists");
            if((req.path == '/signup') || (req.path == '/login')){
                return res.render('errors', {errors: "You are already logged in!"});
            }
            return next();
        }

        // must be a registered user to post
        if(req.path == '/post') {
            return res.redirect('/login');
        }

        return next();
    }

    this.displayLogin = function(req, res) {
        "use strict";
        return res.render('login');
    }

    this.displaySignup = function(req, res) {
        "use strict";
        return res.render('signup');
    }

    function validateSignup (firstname, lastname, username, email, password){

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
            console.log("user: " + user);

            user.save(function(err, user){
                if(err){
                    console.log("error found: " + err);
                    return res.render('errors', {errors: "This username exists already!"});
                    return next(err);
                }
                req.session.username = user.local.username;
                return res.redirect('/welcome');
            })
        }
        else {
            console.log("user was not registered");
            return res.render('signup', { errors: 'ERROR' });
        }
    }

    this.displayWelcome = function(req, res){
        "use strict"
        return res.render('welcome', { name : req.session.username });
    }
}

module.exports = SessionHandler;