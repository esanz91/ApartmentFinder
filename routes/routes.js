var ContentHandler = require('../handler/content');
var express = require('express');
var router = express.Router();

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);

    // The main page of Spotaru
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
