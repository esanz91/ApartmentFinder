var ContentHandler = require('../handler/content');
var express = require('express');
var router = express.Router();

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);

    // The main page of Spotaru
    app.get('/', contentHandler.displayMainPage);

    //Search
    app.get('/search', contentHandler.displaySearchPage);

    //Post Apartment
    app.get('/post', contentHandler.displayPostPage);

    // Login form
    app.get('/login', contentHandler.displayLoginPage);
    /*
    app.post('/login', );

    // Logout page
    app.get('/logout', );

    // Welcome page
    app.get("/welcome", );
    */

    // Signup form
    app.get('/signup', contentHandler.displaySignupPage);
    /*
    app.post('/signup', );
    */

}
