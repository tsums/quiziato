/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionAssignment = new Schema({
    question: {type: Schema.Types.ObjectId, required: true, ref: 'Question'},
    assignedAt: {type: Date, required: true},
    dueAt: {type: Date, required: true},
    graded: {type: Boolean, required: true, default: true}
});

module.exports = mongoose.model('QuestionAssignment', QuestionAssignment);
