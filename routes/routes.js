var ContentHandler = require('../handler/content');
var SessionHandler = require('../handler/session');

module.exports = exports = function(app) {

    var contentHandler = new ContentHandler();
    var sessionHandler = new SessionHandler();

    app.use(sessionHandler.isLoggedInMiddleware);

    // Home
    app.get('/', contentHandler.displayMain);

    // Search
    app.get('/search', contentHandler.displaySearch);

    // Post
    app.get('/post', contentHandler.displayPost);

    // Login
    app.get('/login', sessionHandler.displayLogin);
    /*
    app.post('/post', );

    // Logout
    app.get('/logout', );
    */

    // Signup
    app.get('/signup', sessionHandler.displaySignup);
    app.post('/signup', sessionHandler.handleSignup);

    // Profile
    app.get('/welcome', sessionHandler.displayWelcome)

}
