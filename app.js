var express = require('express');
var app = express(); // Web framework to handle routing requests
var engines = require('consolidate'); // Templating library adapter for Express
var routes = require('./routes/routes'); // Routes for our application
var Mongoose = require('mongoose'); // Object Document Mapper (ODM) for MongoDB (noSQL database)

//connect to a MongoDB database
Mongoose.connect('mongodb://localhost:27017/users');

//database connection
var db = Mongoose.connection;

//error callback
db.on('error', function(msg){
    console.log('Connection Error: %s', msg);
});

//success callback
db.once('open', function callback(){

    // Register our templating engine
    app.engine('html', engines.swig); //registers given template engine as extension
    app.set('view engine', 'html'); // sets the engine extension to use
    app.set('views', __dirname + '/views'); // the directory where the 'view' files are located

    // Express middleware responsible for serving the static assets of an Express application
    app.use(express.static(__dirname + '/public'));

    // Express middleware to populate 'req.cookies' so we can access cookies
    //app.use(express.cookieParser());

    // Express middleware to populate 'req.body' so we can access POST variables
    //app.use(express.bodyParser());

    // Application routes
    routes(app, db);

    app.listen(8082);
    console.log('Express server listening on port 8082');

});

