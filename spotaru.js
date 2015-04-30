var express      = require('express');
var app          = express(); // web framework to handle routing requests
var routes       = require('./routes/routes'); // routes for our application
var Mongoose     = require('mongoose'); // object document mapper (ODM) for MongoDB (noSQL database)

var morgan       = require('morgan'); // http request logger middleware
var bodyParser   = require('body-parser'); // req.body middleware
var session      = require('express-session'); // req.session middleware

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

    // set middleware
    app.use(morgan('dev')); // log all http requests to console
    app.use(express.static(__dirname + '/public')); // responsible for serving the static assets
    app.use(session({
        secret:'somesecrettokenhere',
        resave: true,
        saveUninitialized: true
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    //set template
    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');

    // set routes
    routes(app, db);

    // launch
    app.listen(8082);
    console.log('Express server listening on port 8082');

});

