/**
 * Index routes. Basic front pages and things.
 */
var router = require('express').Router();
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

router.get('/', function (req, res) {
    res.render('index', {title: 'Quiz App'});
});

router.get('/dashboard', ensureLoggedIn('/login'), function (req, res) {
    res.render('dashboard', {title: 'Quiz App', user: req.user.username});
});

module.exports = router;
