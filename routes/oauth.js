var passport = require('passport');
var router = require('express').Router();
var oauth2orize = require('oauth2orize');
var BearerStrategy = require('passport-http-bearer').Strategy;
var oauth2 = oauth2orize.createServer();
var User = require('../models/user');
var AccessToken = require('../models/accessToken');

/*

 */
passport.use("accessToken", new BearerStrategy(
    function (accessToken, done) {
        AccessToken.findOne({token: accessToken}, function (err, token) {

            if (err) return done(err);
            if (!token) return done(null, false);

            //TODO check expiration

            User.findOne({username : token.userID}, function (err, user) {

                if (err) return done(err);
                if (!user) return done(null, false);

                var info = { scope: '*' };
                done(null, user, info);
            })

        });
    }
));


/*
    Exchange the user's credentials for an oauth token.
 */
oauth2.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {

    User.findOne({username: username}, function(err, user){

        if (err) return done(err);

        user.authenticate(password, function(err, authenticated, message) {

            if (err) return done(err);

            if (!authenticated) {
                return done(null, false);
            }

            var accessToken = new AccessToken({
                token: 'abc123', //TODO generate token
                clientID: client.id,
                userID: user.id
            });

            accessToken.save();

            return done(null, accessToken);
        });
    });

}));

exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    oauth2.token(),
    oauth2.errorHandler()
];
