/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    role: {type: String},
    name: {
        first: String,
        last: String
    }
});

User.plugin(passportLocalMongoose, {
    // Set these to the same as to not distinguish between invalid password and invalid username.
    incorrectPasswordError: 'Invalid Credentials',
    incorrectUsernameError: 'Invalid Credentials'
});

module.exports = mongoose.model('User', User);
