var ContentHandler = require('../handler/content');
var SessionHandler = require('../handler/session');
var userHandler = require('../handler/users');
var listingEndPoint = require('../handler/listings');

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

    // User Favorites
    app.get('/user/favorites', userHandler.readUserFavorites);
    app.put('/user/favorites/:listingID', userHandler.updateUserFavoritesByListingId)
    app.delete('/user/favorites/:listingID', userHandler.deleteUserFavoritesByListingId);

    // Listing
    app.get('/post', contentHandler.displayListing);

    app.post('/listing', listingEndPoint.createListing);
    /*
    app.get('/listing/:listingID', contentHandler.readListing);
    app.put('/listing/:listingID', contentHandler.updateListing);
    app.delete('/listing/:listingID', contentHandler.deleteListing);
    */
    //app.post('/updateListingById', listingEndPoint.updateListingById);

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
