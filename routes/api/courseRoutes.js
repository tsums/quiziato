/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var Question = require('../../models/question');
var Course = require('../../models/course');
var router = require('express').Router();

/*
 *  Course-specific API routes.
 */

router.route('/')

    .post(function (req, res) {

        var course = new Course(req.body);
        course.save();
        res.json(course);

    });

router.route('/:id')

    .get(function (req, res) {
        Course.findById(req.id, function (err, course) {

            if (err) {
                res.status(404).send('Not Found');
            }

            res.json(course);
        });
    });

router.route('/:id/questions')

    .get(function (req, res) {
        Question.find({course: req.params.id}, function(err, questions) {
            res.json(questions);
        });
    })

module.exports = router;
