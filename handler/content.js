function ContentHandler() {
    "use strict";

    this.displayMain = function (req, res) {
        "use strict";
        return res.render('home', {
            title: 'Spotaru',
            user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}
        });
    }

    this.displaySearch = function (req, res) {
        "use strict";
        return res.render('search', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
    }

    this.displayListing = function (req, res) {
        "use strict";
        return res.render('listing', {user: {loggedout: !res.locals.loggedin, loggedin: res.locals.loggedin}});
    }
}

module.exports = ContentHandler;
