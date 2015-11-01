/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */


var Question = require('../../models/question');
var Course = require('../../models/course');
var router = require('express').Router();
var winston = require('winston').loggers.get('api');


router.route('/:id')

    .get(function (req, res) {

    });


module.exports = router;
