var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */

router.get('/', function (req, res) {
    res.render('index', {title: 'Quiz App'});
});

router.get('/dashboard', function (req, res) {
    res.render('dashboard', {title: 'Quiz App', user: req.user.username});
});

router.get('/login', function (req, res) {
    res.render('login', {title: 'Log in to Quiz App'});
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login'
    })
);

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

router.get('/register', function (req, res) {
    res.render('register', {});
});

router.post('/register', function (req, res, next) {
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
