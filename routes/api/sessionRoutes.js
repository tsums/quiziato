/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var Question = require('../../models/question');
var CourseSession = require('../../models/course_session');
var AttendanceRecord = require('../../models/attendanceRecord');
var router = require('express').Router();
var winston = require('winston').loggers.get('api');


router.route('/active')

    .get(function (req, res) {
        CourseSession.find({ended: false, instructor: req.user.id}).populate('course').exec(function (err, sessions) {
            if (err) {
                winston.error(err.message);
                res.status(500).send(err.message);
                return
            }
            res.json(sessions);
        });
    });

router.route('/ended/course/:cid')

    .get(function (req, res) {
        CourseSession.find({course: req.params.cid}).populate(['course', 'instructor']).exec(function(err, sessions) {
            if (err) {
                winston.error(err.message);
                res.status(500).send(err.message);
                return;
            }
            if (sessions) {
                res.json(sessions);
            } else {
                res.status(404).send('Not Found');
            }
        });
    });

router.route('/:id/end')

    .post(function (req, res) {
        CourseSession.findById(req.params.id, function (err, session) {
            if (err) {
                winston.error(err.message);
                res.status(500).send(err.message);
                return;
            }
            if (session) {
                session.ended = true;
                session.save(function(err) {
                    if (err) {
                        winston.error(err.message);
                        res.code(500).send(err.message);
                        return;
                    }
                    res.json(session);
                })
            } else {
                res.status(404).send('Not Found');
            }
        });
    });

router.route('/:id')

    .get(function (req, res) {
        CourseSession.findById(req.params.id).populate(['course', 'instructor']).exec(function (err, session) {
            if (err) {
                winston.error(err.message);
                res.status(500).send(err.message);
                return;
            }
            if (session) {

                AttendanceRecord.find({session: session.id}).populate('student').exec(function(err, records) {
                    if (err) {
                        winston.error(err.message);
                        res.status(500).send(err.message);
                        return;
                    }
                    if (records) {
                        session = session.toJSON();
                        session.attendance = records;
                        res.json(session);
                    }
                });
            } else {
                res.status(404).send('Not Found');
            }
        });
    });



module.exports = router;
