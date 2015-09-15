/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessToken = new Schema({
    token: {type: String, required: true, unique: true},
    clientID: {type: String, required: true},
    userID: {type: String, required: true}
});

module.exports = mongoose.model('AccessToken', AccessToken);
