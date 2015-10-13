/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionAssignment = new Schema({
    question: {type: Schema.Types.ObjectId, required: true},
    assignedAt: {type: Date, required: true, default: Date.now()},
    dueAt: {type: Date, required: true, default: moment().add(2, 'minutes').toDate()}
});

var CourseSession = new Schema({
    date : {type: Date, required: true},
    ended: {type: Boolean, required: true, default: false},
    course: {type: Schema.Types.ObjectId, required: true, ref: 'Course'},
    roomId: {type: String, required: true},
    instructor: {type: Schema.Types.ObjectId, required: true},
    assignments: [QuestionAssignment]
});

module.exports = mongoose.model('CourseSession', CourseSession);
