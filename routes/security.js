/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var mobileAPI = require('express').Router();
var webAPI = require('express').Router();
var passport = require('passport');
var roleControl = require('../services/authentication').roleControl;

var APIRoutes = require("./api");

mobileAPI.use(passport.authenticate('bearer', {session: false}));
mobileAPI.use(APIRoutes);

webAPI.use(roleControl.is('instructor'));
webAPI.use(APIRoutes);

module.exports = {
    web: webAPI,
    mobile: mobileAPI
};
