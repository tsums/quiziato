/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 *  Authentication and Permission Control Configuration
 */

var ConnectRoles = require('connect-roles');
var roleControl = new ConnectRoles();

roleControl.use('instructor', function (req) {
    return req.user.role === 'instructor';
});

roleControl.use('student', function(req) {
    return req.user.role === 'student';
});

module.exports = {
    roleControl: roleControl
};
