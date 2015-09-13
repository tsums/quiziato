/**
 * Index routes. Basic front pages and things.
 */
var passport = require('passport');
var router = require('express').Router();

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

router.get('/', function (req, res) {
    res.render('index', {title: 'Quiz App'});
});

router.get('/dashboard', loggedIn, function (req, res) {
    res.render('dashboard', {title: 'Quiz App', user: req.user.username});
});

module.exports = router;
