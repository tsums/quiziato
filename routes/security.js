/**
 * Created by trevor on 10/7/15.
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