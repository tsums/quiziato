var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */

router.get('/', function (req, res) {
  res.render('index', {title: 'Quiz App'});
});

router.get('/dashboard', passport.authenticate(), function(req,res) {
  res.render('index', {title: 'Quiz App', user: req.user.username});
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

router.get('/register', function(req, res) {
  res.render('register', {});
});

router.post('/register', function (req, res, next) {
  console.log('registering user');
  User.register(new User({username: req.body.username}), req.body.password, function (err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');
    res.redirect('/');
  });
});

module.exports = router;
