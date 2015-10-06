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

    var RoomName = 'foo';

    var io = socketio.listen(server);

    // Classroom Namespace is for mobile clients.
    var classroom = io.of('/classroom');

    // Dashboard Namespace is for web clients.
    var dashboard = io.of('/dashboard');

    // Token-Based Authentication for Mobile Clients
    classroom.use(function(socketConnection,next) {

        if (socketConnection.request.headers.authorization == null) {
            winston.info("Rejecting unauthorized connection");
            socketConnection.disconnect('Unauthorized');
        } else {

            AccessToken.findOne({token: socketConnection.request.headers.authorization}, function (err, token) {

                winston.debug("Looking up access token: " + socketConnection.request.headers.authorization);

                if (err) {
                    return next(err);
                }
                if (!token) {
                    socketConnection.disconnect("Token Not Found...");
                }

                User.findOne(token.userID, function (err, userFetched) {

                    winston.debug("Token points to user ID: " + token.userID);

                    if (err) {
                        return next(err);
                    }
                    if (!userFetched) {
                        winston.err("Found a token in database to which the user did not exist...");
                        socketConnection.disconnect("User Not Found...");
                    }

                    socketConnection.request['user'] = userFetched;
                    next();
                })

            });
        }
    });

    classroom.on('connection', function (classroomSocket) {

        winston.info(classroomSocket.request.user.username + ' connected to namespace \'/classroom\'');

        classroomSocket.join(RoomName);

        dashboard.in(RoomName).emit('studentJoined', classroomSocket.request.user.name.full);

        //// Join the Socket to the proper room according to its attendance token.
        //classroomSocket.on('attendance', function (data) {
        //
        //    winston.info(classroomSocket.request.user.username + ' sent attendance');
        //
        //    if (!data) return;
        //
        //    // verify attendance token, have student join current room
        //    // notify instructor that the
        //});

        classroomSocket.on('data_test', function (data) {
            winston.info(data.toString());
        });

        classroomSocket.on('disconnect', function(data) {
            winston.info(classroomSocket.request.user.username + 'disconnected from \'/classroom\'');
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

    dashboard.on('connection', function (doashboardSocket) {

        doashboardSocket.join(RoomName);

        winston.info(doashboardSocket.request.user.username + ' connected to namespace \'/dashboard\'');

        classroom.in(RoomName).emit('join', 'Instructor Joined!');

        doashboardSocket.on('disconnect', function(data) {
            winston.info(doashboardSocket.request.user.username + ' disconnected from \'/dashboard\'');
        });
    });

    return io;
};

module.exports.listen = listen;
