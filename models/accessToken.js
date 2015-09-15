/**
 * OAuth2 Access Token Model
 *
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccessToken = new Schema({
    token: {type: String, required: true, unique: true},
    clientID: {type: String, required: true},
    userID: {type: String, required: true}
});

module.exports = mongoose.model('AccessToken', AccessToken);
