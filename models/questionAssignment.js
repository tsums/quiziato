/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssignmentAnswer = require('./assignmentAnswer');

var QuestionAssignment = new Schema({
    question: {type: Schema.Types.ObjectId, required: true, ref: 'Question'},
    assignedAt: {type: Date, required: true},
    dueAt: {type: Date, required: true},
    graded: {type: Boolean, required: true, default: true}
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

// TODO virtual here that finds the percentages for the assignment
QuestionAssignment.virtual('average').get(function () {



});


module.exports = mongoose.model('QuestionAssignment', QuestionAssignment);
