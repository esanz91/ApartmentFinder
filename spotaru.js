var express      = require('express');
var app          = express(); // web framework to handle routing requests
var routes       = require('./routes/routes'); // routes for our application
var mongoose     = require('mongoose'); // object document mapper (ODM) for MongoDB (noSQL database)

var morgan       = require('morgan'); // http request logger middleware
var bodyParser   = require('body-parser'); // req.body middleware
var session      = require('express-session'); // req.session middleware
var mongoStore   = require('connect-mongo')(session); // MongoDB session store for Express

var config       = require('./config/config'); //configuration/credentials

//check environment
var userDB = "";
var sessionsDB = "";
switch (app.get('env')){
    case 'development':
        userDB = config.usersDB.development.connectionString;
        sessionsDB = config.sessionsDB.development.connectionString;
        break;
    case 'production':
        userDB = config.usersDB.production.connectionString;
        sessionsDB = config.sessionsDB.production.connectionString;
        break;
    default:
        throw new Error('Unknown environment: ' + app.get('env'));
}

// connect to a MongoDB database
var db = mongoose.connect(userDB, function (err){

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
        store: new mongoStore({
            //mongooseConnection: mongoose.connection // reuse mongoose connection
            url: sessionsDB
        }),
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

