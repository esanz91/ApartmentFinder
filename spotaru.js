var express = require('express');
var app = express(); // Web framework to handle routing requests
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

    // register handlebars engine with express app
    var handlebars = require('express3-handlebars').create({
        defaultLayout:'main',
        helpers: {
            section: function(name, options){
                if(!this._sections) this._sections = {};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    });
    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');

    // Express middleware: responsible for serving the static assets of an Express application
    app.use(express.static(__dirname + '/public'));

    // Express middleware: populate 'req.cookies' so we can access cookies
    app.use(require('express-session')());

    // Express middleware: populate 'req.body' so we can access POST variables
    app.use(require('body-parser')());

    // Application routes
    routes(app, db);

    app.listen(8082);
    console.log('Express server listening on port 8082');

});

