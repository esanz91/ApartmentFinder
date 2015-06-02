var validator = require('validator');
var userModel = require('../models/user');

function SessionHandler() {
    "use strict";

    this.isLoggedInMiddleware = function (req, res, next) {
        "use strict"

        // if user is signed in
        if (req.session.username) {
            res.locals.loggedin = true;
            if ((req.path == '/signup') || (req.path == '/login')) {
                return res.render('msgs', {
                    msgs: "You are already logged in!",
                    user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                });
            }
            return next();
        }

        // if user not signed in
        res.locals.loggedin = false;
        if(!(req.path == '/') &&
            !(req.path == '/search') &&
            !(req.path == '/getMarkers')&&
            !(req.path == '/login') &&
            !(req.path == '/signup') &&
            !(req.path == '/user') ||
            (req.path == '/redirect')){
            return res.status(401).render('login', {
                error: {msgs: "Please log in to proceed!"},
                user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
            });
        }

        return next();
    }

    this.displayLogin = function (req, res) {
        "use strict";
        console.log("XMLreq: " + req.xhr);
        return res.render('login', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
    }

    this.handleLogin = function (req, res) {
        "use strict"

        var username = req.body.username;
        var password = req.body.password;
        var condition = {
            'local.username': username,
            'local.password': password
        };
        var expecting = 'local.username';

        userModel.findOne(condition, expecting, function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500).render('login', {
                    error: {msgs: "We're sorry. There was an internal error. Please try again."},
                    user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                });
            }
            if (!user) {
                return res.status(401).render('login', {
                    error: {msgs: "We're sorry, but you have used an User ID and/or password that doesn't match our records. Please try again."},
                    user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                });
            }
            req.session.username = user.local.username;
            return res.redirect('/welcome');
        })
    }

    this.displaySignup = function (req, res) {
        "use strict";
        return res.render('signup', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
    }

    function validateSignup(firstname, lastname, username, email, password) {

        if (validator.isNull(firstname) ||
            validator.isNull(lastname) ||
            validator.isNull(username) ||
            validator.isNull(email) ||
            validator.isNull(password)) {
            console.log("One or more of the fields is/are NULL");
            return false;
        }

        firstname = validator.trim(firstname);
        lastname = validator.trim(lastname);
        var name = validator.trim(firstname + lastname);
        if (!validator.isAlpha(name)) {
            console.log("name: " + name + " is alpha? " + validator.isAlpha(name));
            return false;
        }

        username = validator.trim(username);
        if (!validator.isAlphanumeric(username)) {
            console.log("username: " + username + " is alphanumeric? " + validator.isAlphanumeric(username));
            return false;
        }

        email = validator.normalizeEmail(email);
        if (!validator.isEmail(email)) {
            console.log("email: " + email + " is email? " + validator.isEmail(email));
            return false;
        }

        // TODO: check if email already exists
        // done on the front end

        if ((!validator.isAlphanumeric(password)) && (password.length > 3)) {
            console.log("password: " + password + " is alphanumeric? " + validator.isAlphanumeric(password) + " length is greater than 3? " + password.length > 3);
            return false;
        }

        console.log("No errors!");
        return true;
    }

    this.handleSignup = function (req, res, next) {
        "use strict";

        var firstname = req.body.firstName;
        var lastname = req.body.lastName;
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;

        if (validateSignup(firstname, lastname, username, email, password)) {

            var userJSON = {
                local: {
                    name: {
                        firstName: firstname,
                        lastName: lastname
                    },
                    username: username,
                    email: email,
                    password: password
                },
                listing: {
                    favorites: []
                }
            };

            var user = new userModel(userJSON);
            console.log("user: " + user);

            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                    return res.render('msgs', {
                        msgs: "This username exists already!",
                        user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
                    });
                    //return next(err);
                }
                req.session.username = user.local.username;
                return res.redirect('/welcome');
            })
        }
        else {
            console.log("user was not registered");
            return res.render('signup', {
                msgs: "Error signing up!",
                user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
            });
        }
    }

    this.displayWelcome = function (req, res) {
        "use strict"
        return res.render('welcome', {
            name: req.session.username,
            user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
        });
    }

    this.handleLogout = function (req, res) {
        "use strict"
        req.session.destroy(function (err) {
            console.log(err);
            return res.redirect('/');
        })
    }

    this.displayAccount = function (req, res) {
        "use strict"
        if(!req.session.username){
            return res.render('msgs', {
                msgs: "You need to be logged in to see your account",
                user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
            });
        }
        return res.render('account', {
            name: req.session.username,
            user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
        })
    }
}

module.exports = SessionHandler;