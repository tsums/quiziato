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
        CourseSession.find({ended: false, instructor: req.user.id}).populate('course').exec(function (err, sessions) {
            if (err) {
                winston.error(err.message);
                res.status(500).send(err.message);
                return
            }
            res.json(sessions);
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



module.exports = router;
