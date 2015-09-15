/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var oauth2orize = require('oauth2orize');
var oauth2 = oauth2orize.createServer();
var uuid = require('node-uuid');

var User = require('../models/user');
var AccessToken = require('../models/accessToken');
var Client = require('../models/client');

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {

        Client.findOne({clientID: clientId}, function(err, client) {
            if (err) return done(err);
            if (!client) return done(null, false);
            if (client.clientSecret != clientSecret) {
                return done(null, false);
            }
            return done(null, client);
        });
    }
));

/*
    Bearer Token Strategy can be used to authenticate API routes.
 */
passport.use(new BearerStrategy(
    function (accessToken, done) {
        AccessToken.findOne({token: accessToken}, function (err, token) {

            if (err) {
                return done(err);
            }
            if (!token) {
                return done(null, false);
            }


            console.log(token.userID);
            User.findOne(token.userID, function (err, user) {

                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false);
                }

                var info = { scope: '*' }; //TODO possibly consider including scopes.
                done(null, user, info);
            })

        });
    }
));

oauth2.serializeClient(function(client, done) {
    return done(null, client.id);
});

oauth2.deserializeClient(function(id, done) {
    Client.findOne({id: id}, function(err, client) {
        if (err) { return done(err); }
        return done(null, client);
    });
});

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
                token: uuid.v4(),
                clientID: client.id,
                userID: user.id
            });

            accessToken.save();

            return done(null, accessToken);
        });
    });

}));

/*
    Routine executed when the /token endpoint is hit.
 */
exports.token = [
    passport.authenticate('oauth2-client-password', { session: false }),
    oauth2.token(),
    oauth2.errorHandler()
];
