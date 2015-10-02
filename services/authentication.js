/**
 * Created by trevor on 10/2/15.
 */
var ConnectRoles = require('connect-roles');

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
