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
var uuid = require('node-uuid');
var moment = require('moment');

var redis_session = require('./redis-session');
var config = require('../config');

var AccessToken = require('../models/accessToken');
var User = require('../models/user');
var Course = require('../models/course');
var CourseSession = require('../models/course_session');
var Question = require('../models/question');
var AttendanceRecord = require('../models/attendanceRecord');

var listen = function (server) {

    var io = socketio.listen(server);

    // Classroom Namespace is for mobile clien  ts.
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

    classroom.on('connection', function (socket) {

        var room = null;
        var user = socket.request.user;

        winston.info(user.username + ' connected to namespace \'/classroom\'');

        socket.on('attendance', function(data, callback) {

            winston.info(user.username + ' sent attendance token: ' + data);

            CourseSession.findOne({roomId: data}).populate('course').exec(function (err, session) {
                if (err) {
                    winston.error(err.message);
                } else {
                    if (!session) {
                        winston.info('Session not found with Room ID: ' + data);
                        return;
                    }

                    // TODO this needs to be tested.
                    AttendanceRecord.findOne({student: user.id, session: session.id}, function(err, record) {
                        if (err) {
                            winston.error(err);
                        } else if(!record) {
                            record = new AttendanceRecord({student: user.id, session: session.id, time: Date.now()});
                            record.save(function(err) {
                                if (err) {
                                    winston.error(err);
                                } else {
                                    room = session.roomId;
                                    winston.info(user.username + " submitted attendance for session: " + session._id);
                                    winston.info('current room: ' + room);
                                    socket.join(room);
                                    callback(session);
                                    dashboard.in(room).emit('studentJoined', user.name.full);
                                }
                            })
                        }
                    });


                }
            });


        });

        socket.on('disconnect', function(data) {
            winston.info(user.username + 'disconnected from \'/classroom\'');
            dashboard.in(room).emit('studentLeft', socket.request.user.name.full);
        })

    });

    dashboard.on('connection', function (socket) {

        var room = null;
        var currentSession = null;
        var user = socket.request.user;

        winston.info(user.username + ' connected to namespace \'/dashboard\'');

        // start a session for the course.
        socket.on('startSession', function(data, callback) {
            winston.info(user.username + ' starting session for course: ' + data.course);

            var session = new CourseSession({
                date: Date.now(),
                course: data.course,
                roomId: uuid.v4(),
                instructor: user.id
            });

            session.save(function(err) {
                if (err) {
                    winston.error(err.message);
                    res.send(err);
                } else {
                    room = session.roomId;
                    socket.join(room);

                    callback(session);
                    currentSession = session;

                    winston.info('Instructor ' + user.username + ' Started Session: ' + session.id);
                    winston.info('Instructor ' + user.username + ' Joining Room: ' + room);
                }
            });

        });

        socket.on('leaveSession', function() {
            winston.info('Instructor ' + user.username + ' Leaving Session.');
            socket.leave(room);
            classroom.in(room).emit('instructorDisconnect');
            room = null;
        });

        socket.on('resumeSession', function(data, callback) {

            if (room != null) {
                winston.warn('Socket Tried to Resume Session while already in a session.');
                return;
            }

            CourseSession.findById(data.id).populate('course').exec(function (err, session) {
                if (err) {
                    winston.error(err);
                } else {
                    room = session.roomId;
                    socket.join(room);
                    currentSession = session;
                    callback(session);
                    winston.info('Instructor ' + user.username + ' Re-Joined Session: ' + session.id);
                }
            });

        });

        socket.on('assignQuestion', function(data, callback) {

            Question.findById(data, function(err, question) {
                if (err) {
                    winston.error(err);
                } else {
                    if (question) {

                        winston.info(user.username + " assigning Question " + question.id + " to room " + room);


                        var currentAssignment = {
                            question: question.id,
                            assignedAt: Date.now(),
                            dueAt: moment().add(1, 'minutes').toDate()
                        };

                        currentSession.assignments.push(currentAssignment);

                        currentSession.save(function(err) {
                            if (err) {
                                winston.error(err);
                            } else {
                                // TODO hacky way of sending the last assignment, refactor?
                                // TODO test.
                                callback(currentSession.assignments[currentSession.assignments.length-1]);
                                currentAssignment.question = question;
                                classroom.in(room).emit('assignQuestion', currentAssignment);
                            }
                        });

                    }
                }
            });
        });

        socket.on('disconnect', function(data) {
            winston.info(user.username + ' disconnected from \'/dashboard\'');
            classroom.in(room).emit('instructorDisconnect');
        });
    });

    return io;
};

module.exports.listen = listen;
