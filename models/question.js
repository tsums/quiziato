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
    type: {type: String, required: true},
    options: [QuestionOption],
    correctOption: {type: String, required: true},
    removed: {type: Boolean, required: true, default: false}
});

module.exports = mongoose.model('Question', Question);
