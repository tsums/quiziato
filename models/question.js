/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionOption = new Schema({
    id: {type: Number, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true}
});

var Question = new Schema({
    title : {type: String, required: true},
    prompt: {type: String, required: true},
    course: {type: Schema.Types.ObjectId, required: true},
    author: {type: Schema.Types.ObjectId, required: true},
    options: [QuestionOption],
    correctOption: {type: Number, required: true}
});

module.exports = mongoose.model('Question', Question);
