/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var router = require('express').Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var roleControl = require('../services/authentication').roleControl;

router.get('/', function (req, res) {
    res.redirect('/login');
});

router.get('/dashboard*', ensureLoggedIn('/login'), roleControl.can('dashboard'), function(req, res) {
    res.render('dashboard/dashboard', {user: req.user});
});

module.exports = router;
