var express = require('express');
var app = express(); // web framework to handle routing requests
var routes = require('./routes/routes'); // routes for our application
var Mongoose = require('mongoose'); // object document mapper (ODM) for MongoDB (noSQL database)

// connect to a MongoDB database
var db = Mongoose.connect('mongodb://localhost:27017/users', function (err){

    if(err) throw err;

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

    // set middleware
    app.use(express.static(__dirname + '/public')); // responsible for serving the static assets
    app.use(require('express-session')({secret:'somesecrettokenhere'})); // req.session available
    app.use(require('body-parser')()); // req.body available

    // set routes
    routes(app, db);

    // launch
    app.listen(8082);
    console.log('Express server listening on port 8082');

});

