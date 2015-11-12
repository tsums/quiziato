/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
    Question API Routes.
 */


var Question = require('../../models/question');
var router = require('express').Router();
var winston = require('winston').loggers.get('api');

router.route('/:id')

    .get(function (req, res) {
        Question.findById(req.params.id, function (err, question) {
            if (err) {
                res.status(404).send('Not Found');
            } else {
                res.json(question)
            }
        });
    })

    .delete(function (req, res) {
        Question.findById(req.params.id, function (err, question) {
            if (err) {
                res.status(404).send('Not Found');
            }
            else {
                question.removed = true;
                question.save(function(err) {
                    if (err) {
                        winston.error(err);
                        res.status(500).send(err);
                    } else {
                        res.status(204).send();
                    }
                });
            }
        });
    });

router.route('/')

    .post(function (req, res) {
        var question = new Question(req.body);

        //TODO consider handling more question types.
        question.author = req.user.id;
        question.type = "MC";
        question.save(function(err) {
            if (err) {
                winston.error(err);
                res.status(500).send(err.message);
            } else {
                question.correctOption = question.options[question.correctOption].id;
                question.save(function (err) {
                    if (err) {
                        winston.error(err);
                        res.status(500).send(err.message);
                    } else {
                        res.json(question);
                    }
                });
            }
        });
    })

    .get(function(req, res) {
        if (!req.query.course) {
            res.status(400).send('\'course\' query missing')
        }

        Question.find({course: req.query.course, removed: false}, function (err, questions) {
            if (err) {
                winston.error(err);
                res.status(500).send(err.message);
            } else {
                res.json(questions);
            }
        });
    });

module.exports = router;
