/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//TODO Schema
var Question = new Schema({
    title : {type: String},
    prompt: {type: String},
    author: {type: ObjectId}

});

module.exports = mongoose.model('Question', Question);
