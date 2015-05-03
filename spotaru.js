var express = require('express');
var app = express(); // web framework to handle routing requests
var routes = require('./routes/routes'); // routes for our application
var mongoose = require('mongoose'); // object document mapper (ODM) for MongoDB (noSQL database)

var morgan = require('morgan'); // http request logger middleware
var bodyParser = require('body-parser'); // req.body middleware
var session = require('express-session'); // req.session middleware
var mongoStore = require('connect-mongo')(session); // MongoDB session store for Express

var config = require('./config/config'); //configuration/credentials

// register handlebars
var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

// set handlebars template
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// set middleware
app.use(morgan('dev')); // log all http requests to console
app.use(express.static(__dirname + '/public')); // responsible for serving the static assets
app.use(session({
    secret: config.cookie.secret,
    store: new mongoStore({
        mongooseConnection: mongoose.connection // reuse mongoose connection
    }),
    collection: 'sessions',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//check environment
var mongoDB = "";
switch (app.get('env')) {
    case 'development':
        mongoDB = config.mongoDB.development.connectionString;
        break;
    case 'production':
        mongoDB = config.mongoDB.production.connectionString;
        break;
    default:
        throw new Error('Unknown environment: ' + app.get('env'));
}

// connect to MongoDB
mongoose.connect(mongoDB, function onMongooseError(err) {
    if (err) throw err;
});

// set routes
routes(app, mongoose.connection);

// launch
app.listen(8082);
console.log('Express server listening on port 8082');

