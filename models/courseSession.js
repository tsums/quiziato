/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSession = new Schema({
    date : {type: Date, required: true},
    ended: {type: Boolean, required: true, default: false},
    course: {type: Schema.Types.ObjectId, required: true, ref: 'Course'},
    roomId: {type: String, required: true},
    instructor: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    assignments: [{type: Schema.Types.ObjectId, ref: 'QuestionAssignment'}]
});

module.exports = mongoose.model('CourseSession', CourseSession);
