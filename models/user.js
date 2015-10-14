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
        first: {type: String, required: true},
        last: {type: String, required: true}
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

User.virtual('name.full').get(function() {
    return this.name.first + ' ' + this.name.last;
});

User.plugin(passportLocalMongoose, {
    // Set these to the same as to not distinguish between invalid password and invalid username.
    incorrectPasswordError: 'Invalid Credentials',
    incorrectUsernameError: 'Invalid Credentials'
});

module.exports = mongoose.model('User', User);
