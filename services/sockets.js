/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
 * Socket Configuration
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

    // Token-Based Authentication for Mobile Clients
    classroom.use(function(socket,next) {

        if (socket.request.headers.authorization == null) {
            winston.info("Rejecting unauthorized connection");
            socket.disconnect('Unauthorized');
        } else {

            AccessToken.findOne({token: socket.request.headers.authorization}, function (err, token) {

                winston.debug("Looking up access token: " + socket.request.headers.authorization);

                if (err) {
                    return next(err);
                }
                if (!token) {
                    socket.disconnect("Token Not Found...");
                }

                User.findById(token.userID, function (err, userFetched) {

                    winston.debug("Token points to user ID: " + token.userID);

                    if (err) {
                        return next(err);
                    }
                    if (!userFetched) {
                        winston.err("Found a token in database to which the user did not exist...");
                        socket.disconnect("User Not Found...");
                    }

                    socket.request['user'] = userFetched;
                    next();
                })

            });
        }
    });

    classroom.on('connection', function (socket) {

        // this tracks the socket's current room.
        var room;

        winston.info(socket.request.user.username + ' connected to namespace \'/classroom\'');

        socket.on('attendance', function(data) {

            //TODO switch out token for room name.
            room = data;

            winston.info(socket.request.user.username + " submitted attendance for session: " + room);

            socket.join(room);
            dashboard.in(room).emit('studentJoined', socket.request.user.name.full);
        });


        socket.on('data_test', function (data) {
            winston.info(data.toString());
        });

        socket.on('disconnect', function(data) {
            winston.info(socket.request.user.username + 'disconnected from \'/classroom\'');
            dashboard.in(room).emit('studentLeft', socket.request.user.name.full);
        })

    });

    // Cookie-Based Authentication for Web Clients
    dashboard.use(passportSocketIo.authorize({
        key: config.session_key,
        secret: process.env.SESSION_SECRET,
        store: redis_session,
        success: function (data, accept) {
            if (data.user.role == 'instructor') {
                accept();
            } else {
                winston.info("Non-instructor user rejected: " + data.user.username);
            }
        },
        fail: function (data, message, error, accept) {
            winston.warn('Dashboard: Unauthorized user attempted to access sockets.');
        }

    }));

    dashboard.on('connection', function (socket) {

        var room = 'apple';

        socket.join(room);

        winston.info(socket.request.user.username + ' connected to namespace \'/dashboard\'');

        classroom.in(room).emit('join', 'Instructor Joined!');

        socket.on('disconnect', function(data) {
            winston.info(socket.request.user.username + ' disconnected from \'/dashboard\'');
        });
    });

    return io;
};

module.exports.listen = listen;
