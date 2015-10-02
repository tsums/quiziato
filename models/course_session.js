/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//TODO Schema
var CourseSession = new Schema({
    date : {type: Date},
    course: {type: ObjectId}
});

module.exports = mongoose.model('CourseSession', CourseSession);
