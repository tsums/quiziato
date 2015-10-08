/**
 * Created by trevor on 10/7/15.
 */
var mobileAPI = require('express').Router();
var webAPI = require('express').Router();
var passport = require('passport');

var APIRoutes = require("./api")

mobileAPI.use(passport.authenticate('bearer', {session: false}));
mobileAPI.use(APIRoutes);

webAPI.use(APIRoutes);

module.exports = {
    web: webAPI,
    mobile: mobileAPI
};
