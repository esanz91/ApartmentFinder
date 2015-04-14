var sanitize = require('validator').sanitize; // Helper to sanitize form input

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    this.displayMainPage = function(req, res, next) {
        "use strict";

        return res.render('spotaru_template', {
            //title: 'homepage',
            //username: req.username
        });

    }
}

module.exports = ContentHandler;
