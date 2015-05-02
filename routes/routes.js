var express = require('express');
var ContentHandler = require('../handler/content');
var SessionHandler = require('../handler/session');
var checkAuth = require('../lib/checkAuth');

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);
    var sessionHandler = new SessionHandler(db);

    //app.use(sessionHandler.isLoggedInMiddleware());

    // Home
    app.get('/', contentHandler.displayMain);

    // Search
    app.get('/search', contentHandler.displaySearch);

    // Post
    app.get('/post', contentHandler.displayPost);

    // Login
    app.get('/login', contentHandler.displayLogin);
    /*
    app.post('/login', );

    // Logout
    app.get('/logout', );
    */

    // Signup
    app.get('/signup', contentHandler.displaySignup);
    //app.post('/signup', sessionHandler.handleSignup);


    //Profile
    //app.get('/profile', contentHandler.displayProfile)

}
