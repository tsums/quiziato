/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssignmentAnswer = new Schema({
    assignment: {type: Schema.Types.ObjectId, required: true, ref: 'QuestionAssignment'},
    student: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    submission: {type: String, required: true},
    submittedAt: {type: Date, required: true},
    graded: {type: Boolean, required: true},
    correct: {type: Boolean, required: true, default: false}
});

AssignmentAnswer.index({ student: 1, assignment: -1 }, { unique: true });

module.exports = mongoose.model('AssignmentAnswer', AssignmentAnswer);
