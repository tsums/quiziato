/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
    Authentication Routes
 */

var passport = require('passport');
var router = require('express').Router();
var User = require('../models/user');
var ensureNotLoggedIn = require('connect-ensure-login').ensureNotLoggedIn;
var winston = require('winston').loggers.get('default');

router.route('/login')

    .get(ensureNotLoggedIn('/dashboard'), function (req, res) {
        res.render('auth/login', {title: 'Quiziato™', message: req.flash('error')});
    })

    .post(ensureNotLoggedIn('/dashboard'), passport.authenticate('local', {
        successReturnToOrRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash : true
    }));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.route('/register')

    .get(ensureNotLoggedIn('/dashboard'), function (req, res) {
        res.render('auth/register', {message: req.flash('error')});
    })

    .post(ensureNotLoggedIn('/dashboard'), function (req, res, next) {
        winston.info('registering user');
        User.register(new User({
            username: req.body.username,
            role: "student",
            name: {
                first: req.body.name_first,
                last: req.body.name_last
            }
        }), req.body.password, function (err) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/register');
            } else {
                winston.info('user registered!');
                res.redirect('/');
            }
        });
    });

// API registration for mobile apps.
router.route("/register/api")
    .post(function(req, res, next) {
        User.register(new User({username: req.body.username}), req.body.password, function (err) {
            if (err) {
                console.log('error while registering: ', err);
                return next(err);
            }
            winston.info('user registered via api!');
            res.json({success: true});
        });
    });

module.exports = router;
