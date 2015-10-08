/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */


var Question = require('../../models/question');
var router = require('express').Router();
var winston = require('winston').loggers.get('api');

router.route('/:id')

    .get(function (req, res) {
        Question.findById(req.params.id, function (err, question) {
            if (err) {
                res.status(404).send('Not Found');
            }
            res.json(question)
        });
    });

router.route('/')

    .post(function (req, res) {
        var question = new Question(req.body);
        question.author = req.user.id;
        question.save();
        res.json(question);
    });

module.exports = router;
