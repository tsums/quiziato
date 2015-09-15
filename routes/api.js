/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var router = require('express').Router();
var passport = require('passport');

// These routes should use the bearer method.
router.use(passport.authenticate('bearer', { session: false }));

// Test API route to verify the bearer token usage.
router.route('/test')

    .get(function (req, res) {
        res.json({success: true});
    });

module.exports = router;
