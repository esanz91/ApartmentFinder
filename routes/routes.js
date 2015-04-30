var ContentHandler = require('../handler/content');
var express = require('express');
var router = express.Router();
var checkAuth = require('../lib/checkAuth');

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);

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
    /*
    app.post('/signup', );
    */

    //Profile
    //app.get('/profile', contentHandler.displayProfile)

}
