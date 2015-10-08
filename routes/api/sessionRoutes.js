/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var Question = require('../../models/question');
var CourseSession = require('../../models/course_session');
var router = require('express').Router();
var winston = require('winston').loggers.get('api');


router.route('/active')

    .get(function (req, res) {
        CourseSession.find({ended: false, instructor: req.user.id}, function (err, sessions) {
            if (err) {
                winston.error(err.message);
                res.code(500).send(err.message);
                return
            }
            res.json(sessions);
        });
    });



module.exports = router;
