/**
 * Trevor Summerfield
 * CS 490-001 Fall 2015
 * Quiz Project
 */

/*
    Master Socket Configuration
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
var CourseSession = require('../models/courseSession');
var Question = require('../models/question');
var QuestionAssignment = require('../models/questionAssignment');
var AttendanceRecord = require('../models/attendanceRecord');
var AssignmentAnswer = require('../models/assignmentAnswer');

// Listen function controls the entire operation of socket server.
var listen = function (server) {

    // bind io to the express server.
    var io = socketio.listen(server);

    // Classroom Namespace is for mobile clients.
    var classroom = io.of('/classroom');

    // Dashboard Namespace is for web clients.
    var dashboard = io.of('/dashboard');

    // inform dashboard of student connection change.
    var sendStudentConnectionUpdate = function(session) {
        AttendanceRecord.find({session: session.id}).populate('student').exec(function(err, records) {
            if (err) {
                winston.error(err);
                return;
            }
            dashboard.in(session.roomId).emit('students', records);
        });
    };

    // inform dashboard of session assignment change.
    var sendCurrentAssignmentToDashboard = function(session) {
        QuestionAssignment.findOne(session.assignments[session.assignments.length - 1]).populate('question').exec(function(err, assignment) {
            if (err) {
                winston.error(err);
                return;
            }
            if (assignment) {

                if (assignment.dueAt > Date.now()) {
                    dashboard.in(session.roomId).emit('currentAssignment', assignment);
                }
            }
        });
    };

    // inform dashboard of student submissions count change.
    var sendDashboardStudentAnsweredUpdate = function(room, assignmentId) {
        AssignmentAnswer.find({assignment : assignmentId}, function(err, answers) {
            if (err) {
                winston.error(err);
                return;
            }

            dashboard.in(room).emit('answerUpdate', answers.length);
        });
    };

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
                    return;
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

    // when a socket connects to the classroom, establish their protool.
    classroom.on('connection', function (socket) {

        var room = null;
        var currentSession = null;
        var user = socket.request.user;

        winston.info(user.username + ' connected to namespace \'/classroom\'');

        // allow client to query for status
        socket.on('statusCheck', function(data, callback) {
            callback({
                inSession: currentSession != null,
                session: currentSession
            });
        });

        // when submitting attendance, validate.
        socket.on('attendance', function(data, callback) {

            winston.info(user.username + ' sent attendance token: ' + data);

            CourseSession.findOne({roomId: data}).populate('course instructor assignments').exec(function (err, session) {
                if (err) {
                    winston.error(err.message);
                } else if (!session) {
                    winston.info('Session not found with Room ID: ' + data);
                } else {

                    currentSession = session;

                    CourseSession.populate(session, {path: 'assignments.question', model: 'Question'}).then(function() {

                        AttendanceRecord.findOne({student: user.id, session: session.id}, function (err, record) {
                            if (err) {
                                winston.error(err);
                                return;
                            }

                            if (!record) {
                                record = new AttendanceRecord({
                                    student: user.id,
                                    session: session.id,
                                    time: Date.now(),
                                    connected: true
                                });
                            } else {
                                record.connected = true;
                            }
                            record.save(function (err) {
                                if (err) {
                                    winston.error(err);
                                } else {
                                    sendStudentConnectionUpdate(currentSession);
                                }
                            });
                        });

                        winston.info(user.username + " submitted attendance for session: " + session._id);

                        room = session.roomId;
                        socket.join(room);
                        callback(session);

                    });
                }
            });

        });

        socket.on('submitAnswer', function(data, callback) {

            console.log(data);

            var optionId = data.optionId;
            var assignmentId = data.assignmentId;

            if (optionId == null || assignmentId == null) {
                winston.warn('Assignment Id or Option Id missing');
                return;
            }

            QuestionAssignment.findById(assignmentId).populate('question').exec(function (err, assignment) {
                if (err) {
                    winston.error(err);
                    callback({err: err});
                    return;
                }

                if (assignment) {

                    AssignmentAnswer.findOne({assignment: assignment.id, student: user.id}, function(err, submission) {
                        if (err) {
                            winston.error(err);
                        }

                        if (submission) {
                            winston.info(user.username + " tried to submit an answer twice for assignment: " + assignment.id);
                        } else if (assignment.dueAt > Date.now()) {

                            var answer = new AssignmentAnswer({
                                student: user.id,
                                assignment: assignmentId,
                                submission: optionId,
                                submittedAt: Date.now(),
                                graded: assignment.graded,
                                correct: (optionId == assignment.question.correctOption)
                            });

                            answer.save(function(err) {
                                if (err) {
                                    winston.error(err);
                                    return;
                                }

                                winston.info(user.username + " submitted answer ");
                                callback(answer);
                                sendDashboardStudentAnsweredUpdate(room, assignmentId);
                            });

                        } else {
                            winston.info('answer submitted after due time');
                        }

                    });


                } else {
                    winston.info('could not find assignment: ' + assignmentId)
                }

            });

        });

        socket.on('disconnect', function() {
            winston.info(user.username + 'disconnected from \'/classroom\'');

            if (currentSession != null) {
                AttendanceRecord.findOne({student: user.id, session: currentSession.id}, function(err, record) {
                    if (err) {
                        winston.error(err);
                    } else if (record) {
                        record.connected = false;
                        record.save(function(err) {
                            if (err) {
                                winston.error(err);
                            } else {
                                sendStudentConnectionUpdate(currentSession);
                            }
                        })
                    }

                });
            }
        });

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
                attendanceMandatory: data.attendanceMandatory,
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
                    sendStudentConnectionUpdate(currentSession);
                    sendCurrentAssignmentToDashboard(currentSession);
                    winston.info('Instructor ' + user.username + ' Re-Joined Session: ' + session.id);
                }
            });

        });

        socket.on('assignQuestion', function(data, callback) {

            Question.findById(data.question, function(err, question) {
                if (err) {
                    winston.error(err);
                } else {
                    if (question) {

                        winston.info(user.username + " assigning Question " + question.id + " to room " + room);

                        var currentAssignment = new QuestionAssignment({
                            question: question.id,
                            assignedAt: Date.now(),
                            graded: data.graded,
                            dueAt: moment().add(parseInt(data.time), 'minutes').toDate()
                        });

                        currentAssignment.save(function(err) {
                            if (err) {
                                winston.error('error saving current assignment');
                                winston.error(err);
                            } else {
                                currentSession.assignments.push(currentAssignment.id);
                                currentSession.save(function(err) {
                                    if (err) {
                                        winston.error(err);
                                    } else {
                                        callback(currentAssignment); //TODO check on what this is sending back.
                                        currentAssignment.question = question;
                                        winston.info("Sending Question to Room: " + currentAssignment.question.id);
                                        classroom.in(room).emit('assignQuestion', currentAssignment);
                                    }
                                });
                            }
                        });



                    }
                }
            });
        });

        socket.on('endAssignment', function(data, callback) {
            QuestionAssignment.findById(data, function(err, assignment) {
                if (err) {
                    winston.error(err);
                    return;
                }

                if (assignment && assignment.dueAt > Date.now()) {
                    winston.info("Ending Assignment: " + data);

                    assignment.dueAt = Date.now();
                    assignment.save(function(err) {
                        if (err) {
                            winston.error(err);
                            return;
                        }

                        callback({end: true});
                        classroom.in(room).emit('assignmentTerminated', data);
                    })

                } else {
                    winston.warn("Tried to end assignment either didn't exist or was already due");
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
