/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var router = require('express').Router();
var winston = require('winston').loggers.get('api');
var CourseSession = require('../../models/courseSession');
var AttendanceRecord = require('../../models/attendanceRecord');
var AssignmentAnswer = require('../../models/assignmentAnswer');

router.route('/me')

    .get(function (req, res) {

        var user = req.user.toObject();

        delete user['salt'];
        delete user['hash'];

        res.json(user);
    })

    .post(function (req, res) {
        res.send('Not Yet Implemented');
    });

router.route('/me/sessions')

    .get(function (req, res) {

        AttendanceRecord.find({student: req.user.id}).populate('session').exec(function(err, records) {

            if (err) {
                winston.error(err);
                return;
            }

            if (records) {

                if (req.query.active) {
                    records = records.filter(function(value) {
                        return value.session.ended == false;
                    });
                }

                res.send(records);
            }

        });


    });

router.route('/me/session/:sid/grades')

    .get(function(req, res) {

        CourseSession.findById(req.params.sid, function(err, session) {
            if (err) {
                winston.error(err);
                res.code(500).send(err);
                return;
            }

            if (session) {
                AssignmentAnswer.find({student: req.user.id}).where('assignment').in(session.assignments).populate('student assignment').exec(function(err, answers) {

                    if (err) {
                        winston.error(err);
                        res.code(500).send(err);
                        return;
                    }

                    CourseSession.populate(answers, {path: 'assignment.question', model: 'Question'}).then(function() {
                        res.send(answers);
                    });


                });
            } else {
                res.status(404).send('Not Found');
            }


        });

    });

router.route('/me/grades')

    .get(function (req, res) {
        // TODO this.
        res.send('Not Yet Implemented!');
    });


module.exports = router;
