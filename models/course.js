/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//TODO Schema
var Course = new Schema({
    title : {type: String},
    instructor: {type: ObjectId}
});

module.exports = mongoose.model('Course', Course);
