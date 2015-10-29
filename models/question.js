/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionOption = new Schema({
    text: {type: String, required: true}
});

var Question = new Schema({
    title : {type: String, required: true},
    prompt: {type: String, required: true},
    course: {type: Schema.Types.ObjectId, required: true},
    author: {type: Schema.Types.ObjectId, required: true},
    type: {type: String, required: true}, //TODO set type when questions are created.
    options: [QuestionOption],
    correctOption: {type: String, required: true}
});

module.exports = mongoose.model('Question', Question);
