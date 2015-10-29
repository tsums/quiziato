/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
    OAuth2 Client Schema
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Client = new Schema({
    name: {type: String, required: true, unique: true},
    clientID: {type: String, required: true},
    clientSecret: {type: String, required: true}
});

module.exports = mongoose.model('Client', Client);
