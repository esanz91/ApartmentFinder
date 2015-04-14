var ContentHandler = require('./content');
var express = require('express');
var router = express.Router();

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);

    // The main page of the blog
    app.get('/', contentHandler.displayMainPage);

    /*
    // Login form
    app.get('/login', );
    app.post('/login', );

    // Logout page
    app.get('/logout', );

    // Welcome page
    app.get("/welcome", );

    // Signup form
    app.get('/signup', );
    app.post('/signup', );
    */

}
