/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var router = require('express').Router();
var passport = require('passport');

var courseRoutes = require('./api/courseRoutes');
var questionRoutes = require('./api/questionRoutes');
var userRoutes = require('./api/userRoutes');

// These routes should use the bearer method.
router.use(passport.authenticate('bearer', {session: false}));

router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/question', questionRoutes);

module.exports = router;
