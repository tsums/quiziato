/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
    Assignment API Routes.
 */

var QuestionAssignment = require('../../models/questionAssignment');
var AssignmentAnswer = require('../../models/assignmentAnswer');
var router = require('express').Router();
var winston = require('winston').loggers.get('api');

router.route('/:id')

    .get(function (req, res) {
        console.log(req.params.id);

        QuestionAssignment.findById(req.params.id).populate('question').exec(function (err, assignment) {
            if(err) {
                winston.error(err);
                res.status(500).send(err);
                return;
            }

            if (assignment) {

                AssignmentAnswer.find({assignment: req.params.id}).populate('student').exec(function (err, answers) {

                    if (err) {
                        winston.error(err);
                        res.status(500).send(err);
                        return;
                    }

                    assignment = assignment.toObject();
                    assignment.answers = answers;
                    res.send(assignment);

                });

            } else {
                res.status(404).send('Not Found')
            }
        });
    });

module.exports = router;
