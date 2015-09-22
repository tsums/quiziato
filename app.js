/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 * External Dependencies
 */
var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


var User = require('./models/user');
var oauth2 = require('./services/oauth2');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var mongoURI = process.env.MONGOLAB_URI;

// Mongoose Setup
mongoose.connect(mongoURI, function (err) {
    if (err) {
        console.log('Could not connect to mongodb.');
    }
});


var app = express();
var env = process.env.NODE_ENV || 'development';

// App.Locals are available in every template render.
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// Jade View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));

// Add Body and Cookie Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

// Initialize Passport, Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Serve the static files in /public
app.use(express.static(path.join(__dirname, 'public')));

/*
 * Routing
 */

var index = require('./routes/index');
var authRoutes = require('./routes/auth');
var apiRoutes = require('./routes/api');
app.use('/', index);
app.use('/', authRoutes);
app.use('/api', apiRoutes);

app.post('/oauth/token', oauth2.token);

/*
 * Error Handling
 */

// throw 404's to error handler.
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

module.exports = app;
