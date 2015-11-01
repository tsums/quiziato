/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var router = require('express').Router();
var winston = require('winston').loggers.get('api');
var CourseSession = require('../../models/courseSession');
var AttendanceRecord = require('../../models/attendanceRecord');

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
                return
            }

            console.log(records);

            if (records) {
                records = records.filter(function(value) {
                    return value.session.ended == false;
                });

                res.send(records);
            }

        });


    });

module.exports = router;
