var passport = require('passport');
var router = require('express').Router();
var User = require('../models/user');

router.route('/login')

    .get(function (req, res) {
        res.render('login', {title: 'Log in to Quiz App', message: req.flash('error')});
    })

    .post(passport.authenticate('local', {
        successReturnToOrRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash : true
    }));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.route('/register')

    .get(function (req, res) {
        res.render('register', {});
    })

    .post(function (req, res, next) {
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
