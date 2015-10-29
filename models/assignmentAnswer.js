/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssignmentAnswer = new Schema({
    assignment: {type: Schema.Types.ObjectId, required: true, ref: 'QuestionAssignment'},
    submission: {type: String, required: true},
    submittedAt: {type: Date, required: true}
});

module.exports = mongoose.model('AssignmentAnswer', AssignmentAnswer);
