/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Course = new Schema({
    title : {type: String, required: true},
    instructor: {type: Schema.Types.ObjectId, required: true}
});

module.exports = mongoose.model('Course', Course);
