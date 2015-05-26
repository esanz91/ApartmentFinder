var ContentHandler = require('../handler/content');
var SessionHandler = require('../handler/session');
var userHandler = require('../handler/users');
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

    // User
    app.get('/user', userHandler.getUsername);
    app.get('/user/:userID/favorites', userHandler.readUserFavorites);

    // Listing
    app.get('/listing', contentHandler.displayListing);
    app.post('/listing', contentHandler.handleListing);
    app.post('/updateListingById', listingEndPoint.updateListingById);
    app.post('/deleteListingById', listingEndPoint.deleteListingById);

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
