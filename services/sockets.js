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

    var RoomName = "'oajfasdgoadfgosaijdf;siHFJSDFDIJWOIJWG";

    var io = socketio.listen(server);

    // Classroom Namespace is for mobile clients.
    var classroom = io.of('/classroom');

    // Dashboard Namespace is for web clients.
    var dashboard = io.of('/dashboard');

    classroom.on('connection', function (socket) {

        winston.info(socket.request.user.username + ' connected to namespace \'/classroom\'');

        // Join the Socket to the proper room according to its attendance token.
        socket.on('attendance', function (data) {

            winston.info(socket.request.user.username + ' sent attendance');

            if (!data) return;

            // verify attendance token, have student join current room
            // notify instructor that the

            socket.join(RoomName);

            dashboard.sockets.in(RoomName).emit('studentJoined', socket.request.user.name.full);
        });

        socket.on('data_test', function (data) {
            winston.info(data.toString());
        });

        socket.on('disconnect', function(data) {
            winston.info(socket.request.user.username + 'disconnected from \'/classroom\'');
        })

    });

    // Token-Based Authentication for Mobile Clients
    classroom.use(function(socket,next) {

        if (socket.request.headers.authorization == null) {
            winston.info("Rejecting unauthorized connection");
            socket.disconnect('Unauthorized');
        } else {

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
                    winston.info(socket.request.user.username + ' connected to \'classroom\'');
                    next();
                })

            });
        }
    });

    dashboard.on('connection', function (socket) {

        socket.join(RoomName);

        winston.info(socket.request.user.username + ' connected to namespace \'/dashboard\'');

        classroom.sockets.in(RoomName).emit('join', 'Instructor Joined!');

        //var i = 0;
        //var interval = setInterval(function() {
        //    socket.emit('testEvent', i++);
        //}, 3000);

        socket.on('disconnect', function(data) {
            // TODO inform class that instructor has left.

            winston.info(socket.request.user.username + ' disconnected from \'/dashboard\'');

            //clearInterval(interval);
        });
    });

    // Cookie-Based Authentication for Web Clients
    dashboard.use(passportSocketIo.authorize({
        key: config.session_key,
        secret: process.env.SESSION_SECRET,
        store: redis_session,
        success: function (data, accept) {
            winston.info('User connecting...');

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

    return io;
};

module.exports.listen = listen;
