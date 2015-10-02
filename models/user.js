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

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
