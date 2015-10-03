/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionOption = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true}
});

//TODO Schema
var Question = new Schema({
    title : {type: String, required: true},
    prompt: {type: String, required: true},
    course: {type: ObjectId, required: true},
    author: {type: ObjectId, required: true},
    options: [QuestionOption],
    correctOption: {type: Number, required: true}
});

module.exports = mongoose.model('Question', Question);
