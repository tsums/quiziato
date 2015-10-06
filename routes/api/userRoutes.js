/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var router = require('express').Router();

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

module.exports = router;
