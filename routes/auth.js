/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var passport = require('passport');
var router = require('express').Router();
var User = require('../models/user');
var ensureNotLoggedIn = require('connect-ensure-login').ensureNotLoggedIn;


router.route('/login')

    .get(ensureNotLoggedIn('/dashboard'), function (req, res) {
        res.render('login', {title: 'Log in to Quiz App', message: req.flash('error')});
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
        res.render('register', {});
    })

    .post(ensureNotLoggedIn('/dashboard'), function (req, res, next) {
        console.log('registering user');
        User.register(new User({username: req.body.username}), req.body.password, function (err) {
            if (err) {
                console.log('error while registering: ', err);
                return next(err);
            }
            console.log('user registered!');
            res.redirect('/');
        });
    });

module.exports = router;
