/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AttendanceRecord = new Schema({
    student: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    session: {type: Schema.Types.ObjectId, required: true, ref: 'CourseSession'},
    time: {type: Date, required: true},
    connected: {type: Boolean, required: true, default:false}
});

AttendanceRecord.index({ student: 1, session: -1 }, { unique: true });
AttendanceRecord.index({ session: 1, connected: 1}); //TODO test this.

module.exports = mongoose.model('AttendanceRecord', AttendanceRecord);
