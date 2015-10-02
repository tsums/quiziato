/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//TODO Schema
var AttendanceRecord = new Schema({
    student: {type: ObjectId},
    session: {type: ObjectId}
});

module.exports = mongoose.model('AttendanceRecord', AttendanceRecord);
