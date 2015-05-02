var UserModel = require('../models/user');

function SessionHandler (db) {
    "use strict";

    var users = new UserModel(db);

    this.isLoggedInMiddleware = function (req, res, next) {
        var session_id = req.session;

    }

    this.handleSignup = function (req, res, next) {
        "use strict";

        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var email = req.body.email;
        var password = req.body.password;
        var verify = req.body.verify;

    }
}

module.exports = SessionHandler;