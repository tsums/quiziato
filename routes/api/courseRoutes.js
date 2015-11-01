/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var Question = require('../../models/question');
var Course = require('../../models/course');
var router = require('express').Router();
var winston = require('winston').loggers.get('api');

/*
 *  Course-specific API routes.
 */

router.route('/')

    .post(function (req, res) {

        var course = new Course({title: req.body.title, instructor: req.user.id});
        course.save(function (err) {
            if (err) {
                winston.error(err.message);
                res.code(500).send(err.message);
                return;
            }
            res.json(course);
        });

    });

router.route('/my')

    .get(function (req, res) {

        Course.find({instructor: req.user.id}, function (err, courses) {
            if (err) {
                winston.error(err.message);
                res.code(500).send('Error Ocurred: ' + err.message);
                return;
            }

            res.json(courses);
        });

    });

router.route('/:id')

    .get(function (req, res) {
        Course.findById(req.params.id, function (err, course) {

            if (err) {
                res.status(404).send('Not Found');
            }

            res.json(course);
        });
    });

router.route('/:id/questions')

    .get(function (req, res) {
        Question.find({course: req.params.id}, function (err, questions) {
            res.json(questions);
        });
    });


module.exports = router;
