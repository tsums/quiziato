/**
 * OAuth2 Client Model
 *
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Client = new Schema({
    name: {type: String, required: true, unique: true},
    clientID: {type: String, required: true},
    clientSecret: {type: String, required: true}
});

module.exports = mongoose.model('Client', Client);
