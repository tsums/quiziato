/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var router = require('express').Router();

var courseRoutes = require('./api/courseRoutes');
var questionRoutes = require('./api/questionRoutes');
var userRoutes = require('./api/userRoutes');
var sessionRoutes = require('./api/sessionRoutes');

// These routes should use the bearer method.
router.use('/user', userRoutes);
router.use('/course', courseRoutes);
router.use('/question', questionRoutes);
router.use('/session', sessionRoutes);

module.exports = router;
