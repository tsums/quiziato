/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//TODO Schema
var CourseSession = new Schema({
    date : {type: Date, required: true},
    course: {type: Schema.Types.ObjectId, required: true},
    roomId: {type: String, required: true},
    instructor: {type: Schema.Types.ObjectId, required: true}
});

module.exports = mongoose.model('CourseSession', CourseSession);
