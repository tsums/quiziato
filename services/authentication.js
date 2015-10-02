/**
 * Created by trevor on 10/2/15.
 */

/*
    Authentication and Permission Control Configuration
 */


var ConnectRoles = require('connect-roles');


// Role Control Definition Controls under what conditions a request can go through.
var roleControl = new ConnectRoles();

roleControl.use('dashboard', function (req) {
    return req.user.role === 'instructor';
});

roleControl.use('student', function(req) {
    return req.user.role === 'student';
});

module.exports = {
    roleControl: roleControl
};
