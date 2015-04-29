var sanitize = require('validator').sanitize; // Helper to sanitize form input

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    this.displayMainPage = function(req, res) {
        "use strict";
        return res.render('home', {
            //title: 'Spotaru'
        });
    }
    this.displaySearchPage = function(req, res) {
        "use strict";
        return res.render('search', {
            //title: 'Spotaru'
        });
    }
    this.displayPostPage = function(req, res) {
        "use strict";
        return res.render('post', {
            //title: 'Spotaru'
        });
    }
    this.displaySignupPage = function(req, res) {
        "use strict";
        return res.render('signup', {
            //title: 'Spotaru'
        });
    }
    this.displayLoginPage = function(req, res) {
        "use strict";
        return res.render('login', {
            //title: 'Spotaru'
        });
    }
}

module.exports = ContentHandler;
