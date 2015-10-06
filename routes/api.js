/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var router = require('express').Router();
var passport = require('passport');

var courseRoutes = require('./api/courseRoutes');
var questionRoutes = require('./api/questionRoutes');

var Question = require('../models/question');
var Course = require('../models/course');

// These routes should use the bearer method.
router.use(passport.authenticate('bearer', {session: false}));

// Test API route to verify the bearer token usage.
router.route('/test')

    .get(function (req, res) {
        res.json({success: true});
    });

router.route('/user/me')

    .get(function (req, res) {

        var user = req.user.toObject();

        delete user['salt'];
        delete user['hash'];

        res.json(user);
    })

    .post(function (req, res) {
        res.send('Not Yet Implemented');
    });

router.use('/course', courseRoutes);
router.use('/question', questionRoutes);

module.exports = router;
