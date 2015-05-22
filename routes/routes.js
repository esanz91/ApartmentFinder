var ContentHandler = require('../handler/content');
var SessionHandler = require('../handler/session');
var listingEndPoint = require('../api/listings');

module.exports = exports = function(app) {

    var contentHandler = new ContentHandler();
    var sessionHandler = new SessionHandler();

    app.use(sessionHandler.isLoggedInMiddleware);

    // Home
    app.get('/', contentHandler.displayMain);

    // Search
    app.get('/search', contentHandler.displaySearch);
    app.get('/getMarkers', listingEndPoint.getMarkers);
    app.get('/findListingById/:listingID', listingEndPoint.findListingById);

    // Listing
    app.get('/listing', contentHandler.displayListing);
    app.post('/listing', contentHandler.handleListing);

    // Login
    app.get('/login', sessionHandler.displayLogin);
    app.post('/login', sessionHandler.handleLogin);

    // Logout
    app.get('/logout', sessionHandler.handleLogout);

    // Signup
    app.get('/signup', sessionHandler.displaySignup);
    app.post('/signup', sessionHandler.handleSignup);

    // Welcome
    app.get('/welcome', sessionHandler.displayWelcome);

    // Profile
    app.get('/account', sessionHandler.displayAccount);

}
