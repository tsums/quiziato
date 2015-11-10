/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Course = new Schema({
    number: {type: String, required: true},
    section: {type: String, required: true},
    title : {type: String, required: true},
    instructor: {type: Schema.Types.ObjectId, required: true, ref: 'User'}
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

Course.virtual('full').get(function() {
    return this.number + ' - ' + this.section + ': ' + this.title;
});

Course.virtual('short').get(function() {
    return this.number + ' - ' + this.section;
});

module.exports = mongoose.model('Course', Course);
