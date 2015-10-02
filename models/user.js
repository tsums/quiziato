/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');


//TODO Roles, etc.
var User = new Schema({

    role: {type: String}

});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
