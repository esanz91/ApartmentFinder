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
}

module.exports = ContentHandler;
