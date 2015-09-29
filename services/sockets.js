/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 * Socket.io Configuration
 */
var socketio = require('socket.io');
var winston = require('winston').loggers.get('socket');
var passportSocketIo = require("passport.socketio");

var redis_session = require('./redis-session');
var AccessToken = require('../models/accessToken');
var User = require('../models/user');
var config = require('../config');

var listen = function (server) {

    var io = socketio.listen(server);

    // Classroom Namespace is for mobile clients.
    var classroom = io.of('/classroom');

    // Dashboard Namespace is for web clients.
    var dashboard = io.of('/dashboard');

    classroom.on('connection', function (socket) {

        winston.info(socket.request.user.username + ' connected to namespace \'/classroom\'');

        // Join the Sokcet to the proper room according to its attendance token.
        socket.on('attendance', function (data) {

            winston.info(socket.request.user.username + ' sent attendance', {namespace : 'classroom'});

            if (!data) return;

            socket.join(data);

            dashboard.emit('cat', 'User: ' + socket.request.user.username + "joined room " + data);
        });

        socket.on('data_test', function (data) {
            winston.info(data.toString());
        });

    });

    // Token-Based Authentication for Mobile Clients
    classroom.use(function(socket,next) {

        if (socket.request.headers.authorization == null) {
            winston.info("Rejecting unauthorized connection");
            socket.disconnect('Unauthorized');
        } else {
            winston.info("Socket Connecting to Classroom: " + socket.request.headers.authorization);

            AccessToken.findOne({token: socket.request.headers.authorization}, function (err, token) {

                if (err) {
                    return next(err);
                }
                if (!token) {
                    socket.disconnect("Token Not Found...");
                }

                User.findOne(token.userID, function (err, user) {

                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        winston.err("Found a token in database to which the user did not exist...");
                        socket.disconnect("User Not Found...");
                    }

                    socket.request['user'] = user;
                    next();
                })

            });
        }
    });



    dashboard.on('connection', function (socket) {
        winston.info(socket.request.user.username + ' connected to namespace \'/dashboard\'');
        classroom.emit('join', 'Instructor Joined!');
    });

    // Cookie-Based Authentication for Web Clients
    dashboard.use(passportSocketIo.authorize({
        key: config.session_key,
        secret: process.env.SESSION_SECRET,
        store: redis_session,
        success: function (data, accept) {
            winston.info('User connecting...');
            // TODO not sure if we really need this callback...
            accept();
        },
        fail: function (data, message, error, accept) {
            winston.warn('Dashboard: Unauthorized user attempted to access sockets.');
        }

    }));

    return io;
};

module.exports.listen = listen;
